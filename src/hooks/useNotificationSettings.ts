
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export interface NotificationSettings {
  email: boolean;
  push: boolean;
}

export function useNotificationSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: false,
  });

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get notification settings
          const { data, error } = await supabase
            .from('notification_settings')
            .select('email_notifications, push_notifications')
            .eq('profile_id', user.id)
            .single();
          
          // Don't throw if no data is found - it's OK for settings to be missing initially
          if (error && error.code !== 'PGRST116') throw error;
          
          if (data) {
            setNotificationSettings({
              email: data.email_notifications ?? true,
              push: data.push_notifications ?? false,
            });
          }
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    };
    
    loadNotificationSettings();
  }, []);

  const updateNotificationSettingsField = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveNotificationSettings = async () => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          profile_id: user.id,
          email_notifications: notificationSettings.email,
          push_notifications: notificationSettings.push
        }, {
          onConflict: 'profile_id'
        });
      
      if (error) throw error;
      
      toast({
        title: t('notificationSettingsUpdated'),
        description: t('notificationSettingsSaved'),
      });
      
      return true;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: t('errorOccurred'),
        description: t('errorUpdatingSettings'),
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    notificationSettings,
    isSaving,
    updateNotificationSettingsField,
    saveNotificationSettings
  };
}

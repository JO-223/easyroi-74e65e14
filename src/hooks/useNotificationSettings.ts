
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
          // Get notification settings using RPC
          const { data, error } = await supabase.rpc(
            'get_notification_settings',
            { p_user_id: user.id }
          ) as { data: any[] | null, error: any };
          
          // Don't throw if no data is found - it's OK for settings to be missing initially
          if (error && error.code !== 'PGRST116') throw error;
          
          if (data && data.length > 0) {
            setNotificationSettings({
              email: Boolean(data[0]?.email_notifications ?? true),
              push: Boolean(data[0]?.push_notifications ?? false),
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
      
      const { error } = await supabase.rpc(
        'update_notification_settings',
        {
          p_user_id: user.id,
          p_email_notifications: notificationSettings.email,
          p_push_notifications: notificationSettings.push
        }
      ) as { data: any, error: any };
      
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

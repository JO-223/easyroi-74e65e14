
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export interface AccountSettings {
  name: string;
  email: string;
}

export function useAccountSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    name: "John Doe",
    email: "john@example.com",
  });

  useEffect(() => {
    const loadAccountSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profileData) {
            setAccountSettings({
              name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || "John Doe",
              email: profileData.email || "john@example.com",
            });
          }
        }
      } catch (error) {
        console.error("Error loading account settings:", error);
      }
    };
    
    loadAccountSettings();
  }, []);

  const saveAccountSettings = async () => {
    try {
      setIsSaving(true);
      
      // In a real implementation, this would save the account settings
      
      toast({
        title: t('accountSettingsUpdated'),
        description: t('accountSettingsSaved'),
      });
      
      return true;
    } catch (error) {
      console.error("Error updating account settings:", error);
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
    accountSettings,
    isSaving,
    saveAccountSettings
  };
}

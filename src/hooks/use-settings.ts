
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export type SettingsType = 'account' | 'display' | 'notifications' | 'privacy';

interface AccountSettings {
  name: string;
  email: string;
}

interface DisplaySettings {
  language: Language;
  currency: Currency;
  timezone: Timezone;
  theme: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
}

interface PrivacySettings {
  publicProfile: boolean;
  dataSharing: boolean;
}

export interface UserSettings {
  account: AccountSettings;
  display: DisplaySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export function useSettings() {
  const { toast } = useToast();
  const { displaySettings, updateDisplaySettings, t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [settingsData, setSettingsData] = useState<UserSettings>({
    account: {
      name: "John Doe",
      email: "john@example.com",
    },
    display: {
      language: displaySettings.language,
      currency: displaySettings.currency,
      timezone: displaySettings.timezone,
      theme: "light",
    },
    notifications: {
      email: true,
      push: false,
    },
    privacy: {
      publicProfile: true,
      dataSharing: false,
    },
  });

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          // Fetch display settings
          const { data: displayData, error: displayError } = await supabase
            .from('display_settings')
            .select('*')
            .eq('profile_id', user.id)
            .single();
          
          if (displayError) throw displayError;
          
          // Update local state with fetched data
          setSettingsData(prev => ({
            ...prev,
            account: {
              name: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || "John Doe",
              email: profileData?.email || "john@example.com",
            },
            display: {
              language: displayData?.language as Language || displaySettings.language,
              currency: displayData?.currency as Currency || displaySettings.currency,
              timezone: displayData?.timezone as Timezone || displaySettings.timezone,
              theme: "light", // Default theme
            }
          }));
          
          // Update context for immediate effect
          if (displayData) {
            updateDisplaySettings({
              language: displayData.language as Language,
              currency: displayData.currency as Currency,
              timezone: displayData.timezone as Timezone
            });
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: t('errorOccurred'),
          description: t('errorLoadingSettings'),
          variant: "destructive"
        });
      }
    };
    
    loadUserSettings();
  }, [toast, t, displaySettings, updateDisplaySettings]);

  const handleSettingsSubmit = async (settingsType: SettingsType) => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      switch (settingsType) {
        case 'account':
          // Handle account settings update logic here
          toast({
            title: t('accountSettingsUpdated'),
            description: t('accountSettingsSaved'),
          });
          break;
          
        case 'display':
          // Update display settings in database
          const { error } = await supabase
            .from('display_settings')
            .update({
              language: settingsData.display.language,
              currency: settingsData.display.currency,
              timezone: settingsData.display.timezone
            })
            .eq('profile_id', user.id);
          
          if (error) throw error;
          
          // Update context for immediate effect
          updateDisplaySettings({
            language: settingsData.display.language as Language,
            currency: settingsData.display.currency as Currency,
            timezone: settingsData.display.timezone as Timezone
          });
          
          toast({
            title: t('displaySettingsUpdated'),
            description: t('displaySettingsSaved'),
          });
          break;
          
        case 'notifications':
          // Handle notification settings update logic here
          toast({
            title: t('notificationSettingsUpdated'),
            description: t('notificationSettingsSaved'),
          });
          break;
          
        case 'privacy':
          // Handle privacy settings update logic here
          toast({
            title: t('privacySettingsUpdated'),
            description: t('privacySettingsSaved'),
          });
          break;
          
        default:
          console.warn('Unknown settings type');
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: t('errorOccurred'),
        description: t('errorUpdatingSettings'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateDisplaySettingsField = (field: keyof DisplaySettings, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [field]: value
      }
    }));
  };

  const updateNotificationSettingsField = (field: keyof NotificationSettings, value: boolean) => {
    setSettingsData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const updatePrivacySettingsField = (field: keyof PrivacySettings, value: boolean) => {
    setSettingsData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  return {
    settingsData,
    isSaving,
    handleSettingsSubmit,
    updateDisplaySettingsField,
    updateNotificationSettingsField,
    updatePrivacySettingsField,
  };
}

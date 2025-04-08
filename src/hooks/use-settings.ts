
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileVisibility } from "@/services/networkService";

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
  profileVisibility: ProfileVisibility;
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
      profileVisibility: 'public',
    },
  });

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          // Get display settings
          const { data: displayData, error: displayError } = await supabase
            .from('display_settings')
            .select('*')
            .eq('profile_id', user.id)
            .single();
          
          if (displayError && displayError.code !== 'PGRST116') throw displayError;
          
          // Get privacy settings using an RPC call
          const { data: privacyData, error: privacyError } = await supabase
            .rpc('get_privacy_settings', { user_id: user.id });
          
          if (privacyError && privacyError.code !== 'PGRST116') throw privacyError;
          
          // Update settings data with data from the database
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
              theme: "light",
            },
            privacy: {
              publicProfile: Array.isArray(privacyData) && privacyData.length > 0 ? !!privacyData[0]?.public_profile : true,
              dataSharing: Array.isArray(privacyData) && privacyData.length > 0 ? !!privacyData[0]?.data_sharing : false,
              profileVisibility: (profileData?.visibility as ProfileVisibility) || 'public',
            }
          }));
          
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
          toast({
            title: t('accountSettingsUpdated'),
            description: t('accountSettingsSaved'),
          });
          break;
          
        case 'display':
          const { error } = await supabase
            .from('display_settings')
            .update({
              language: settingsData.display.language,
              currency: settingsData.display.currency,
              timezone: settingsData.display.timezone
            })
            .eq('profile_id', user.id);
          
          if (error) throw error;
          
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
          toast({
            title: t('notificationSettingsUpdated'),
            description: t('notificationSettingsSaved'),
          });
          break;
          
        case 'privacy':
          // Use RPC function to update privacy settings
          const { error: privacyError } = await supabase
            .rpc('update_privacy_settings', {
              user_id: user.id,
              p_public_profile: settingsData.privacy.publicProfile,
              p_data_sharing: settingsData.privacy.dataSharing
            });
          
          if (privacyError) throw privacyError;
          
          // Update profile visibility
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              visibility: settingsData.privacy.profileVisibility
            })
            .eq('id', user.id);
          
          if (profileError) throw profileError;
          
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

  const updatePrivacySettingsField = (field: keyof PrivacySettings, value: any) => {
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

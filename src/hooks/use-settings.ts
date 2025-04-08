
import { useState } from "react";
import { useAccountSettings, AccountSettings } from "./useAccountSettings";
import { useDisplaySettings, DisplaySettings } from "./useDisplaySettings";
import { useNotificationSettings, NotificationSettings } from "./useNotificationSettings";
import { usePrivacySettings, PrivacySettings } from "./usePrivacySettings";
import { ProfileVisibility } from "@/services/networkService";

export type SettingsType = 'account' | 'display' | 'notifications' | 'privacy';

export interface UserSettings {
  account: AccountSettings;
  display: DisplaySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export function useSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    accountSettings,
    saveAccountSettings
  } = useAccountSettings();
  
  const {
    displaySettings,
    updateDisplaySettingsField,
    saveDisplaySettings
  } = useDisplaySettings();
  
  const {
    notificationSettings,
    updateNotificationSettingsField,
    saveNotificationSettings
  } = useNotificationSettings();
  
  const {
    privacySettings,
    updatePrivacySettingsField,
    savePrivacySettings
  } = usePrivacySettings();

  // Combine all settings into one object
  const settingsData: UserSettings = {
    account: accountSettings,
    display: displaySettings,
    notifications: notificationSettings,
    privacy: privacySettings
  };

  const handleSettingsSubmit = async (settingsType: SettingsType) => {
    try {
      setIsSaving(true);
      
      let success = false;
      
      switch (settingsType) {
        case 'account':
          success = await saveAccountSettings();
          break;
          
        case 'display':
          success = await saveDisplaySettings();
          break;
          
        case 'notifications':
          success = await saveNotificationSettings();
          break;
          
        case 'privacy':
          success = await savePrivacySettings();
          break;
          
        default:
          console.warn('Unknown settings type');
          success = false;
      }
      
      return success;
    } finally {
      setIsSaving(false);
    }
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


import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileVisibility } from "@/services/network/types";

export interface PrivacySettings {
  publicProfile: boolean;
  dataSharing: boolean;
  profileVisibility: ProfileVisibility;
}

export function usePrivacySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    publicProfile: true,
    dataSharing: false,
    profileVisibility: 'public',
  });

  useEffect(() => {
    const loadPrivacySettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get profile visibility using RPC
          const { data: profileData, error: profileError } = await supabase.rpc(
            'get_profile_by_id',
            { p_user_id: user.id }
          ) as { data: any[] | null, error: any };
          
          if (profileError) throw profileError;
          
          // Get privacy settings using an RPC call
          const { data: privacyData, error: privacyError } = await supabase.rpc(
            'get_privacy_settings', 
            { p_user_id: user.id }
          ) as { data: any[] | null, error: any };
          
          if (privacyError) throw privacyError;
          
          // Extract data with type safety
          const publicProfile = privacyData && privacyData.length > 0 
            ? Boolean(privacyData[0]?.public_profile) 
            : true;
            
          const dataSharing = privacyData && privacyData.length > 0 
            ? Boolean(privacyData[0]?.data_sharing) 
            : false;
            
          const profileVisibility = profileData && profileData.length > 0
            ? (profileData[0]?.visibility as ProfileVisibility || 'public')
            : 'public';
          
          setPrivacySettings({
            publicProfile,
            dataSharing,
            profileVisibility,
          });
        }
      } catch (error) {
        console.error("Error loading privacy settings:", error);
      }
    };
    
    loadPrivacySettings();
  }, []);

  const updatePrivacySettingsField = (field: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePrivacySettings = async () => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      // Use RPC function to update privacy settings
      const { error: privacyError } = await supabase.rpc(
        'update_privacy_settings',
        {
          p_user_id: user.id,
          p_public_profile: privacySettings.publicProfile,
          p_data_sharing: privacySettings.dataSharing
        }
      );
      
      if (privacyError) throw privacyError;
      
      // Update profile visibility
      const { error: profileError } = await supabase.rpc(
        'update_profile_visibility',
        {
          p_user_id: user.id,
          p_visibility: privacySettings.profileVisibility
        }
      );
      
      if (profileError) throw profileError;
      
      toast({
        title: t('privacySettingsUpdated'),
        description: t('privacySettingsSaved'),
      });
      
      return true;
    } catch (error) {
      console.error("Error updating privacy settings:", error);
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
    privacySettings,
    isSaving,
    updatePrivacySettingsField,
    savePrivacySettings
  };
}

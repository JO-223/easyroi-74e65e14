
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { DisplaySettings } from "@/contexts/LanguageContext";

export function useDisplaySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { language, displaySettings, updateDisplaySettings, t } = useLanguage();
  const [localDisplaySettings, setLocalDisplaySettings] = useState<DisplaySettings>({
    language: displaySettings.language,
    currency: displaySettings.currency,
    timezone: displaySettings.timezone,
  });

  useEffect(() => {
    const loadDisplaySettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get display settings
          const { data: displayData, error: displayError } = await supabase
            .from('display_settings')
            .select('language, currency, timezone')
            .eq('profile_id', user.id)
            .single();
          
          // Don't throw if no data is found - it's OK for settings to be missing initially
          if (displayError && displayError.code !== 'PGRST116') throw displayError;
          
          if (displayData) {
            const updatedSettings = {
              language: displayData.language as Language || displaySettings.language,
              currency: displayData.currency as Currency || displaySettings.currency,
              timezone: displayData.timezone as Timezone || displaySettings.timezone,
            };
            
            setLocalDisplaySettings(updatedSettings);
            updateDisplaySettings({
              language: updatedSettings.language,
              currency: updatedSettings.currency,
              timezone: updatedSettings.timezone
            });
          }
        }
      } catch (error) {
        console.error("Error loading display settings:", error);
      }
    };
    
    loadDisplaySettings();
  }, [displaySettings, updateDisplaySettings]);

  const updateDisplaySettingsField = (field: keyof DisplaySettings, value: any) => {
    setLocalDisplaySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveDisplaySettings = async () => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      const { error } = await supabase
        .from('display_settings')
        .upsert({
          profile_id: user.id,
          language: localDisplaySettings.language,
          currency: localDisplaySettings.currency,
          timezone: localDisplaySettings.timezone
        }, {
          onConflict: 'profile_id'
        });
      
      if (error) throw error;
      
      updateDisplaySettings({
        language: localDisplaySettings.language,
        currency: localDisplaySettings.currency,
        timezone: localDisplaySettings.timezone
      });
      
      toast({
        title: t('displaySettingsUpdated'),
        description: t('displaySettingsSaved'),
      });
      
      return true;
    } catch (error) {
      console.error("Error updating display settings:", error);
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
    displaySettings: localDisplaySettings,
    isSaving,
    updateDisplaySettingsField,
    saveDisplaySettings
  };
}

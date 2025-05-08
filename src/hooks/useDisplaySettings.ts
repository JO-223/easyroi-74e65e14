
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language, Currency, Timezone, DisplaySettings } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { isEqual } from "lodash-es";

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { DisplaySettings } from "@/contexts/LanguageContext";

export function useDisplaySettings() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { language, displaySettings, updateDisplaySettings, t } = useLanguage();
  const [localDisplaySettings, setLocalDisplaySettings] = useState<DisplaySettings>({
    language: language,
    currency: displaySettings.currency,
    timezone: displaySettings.timezone,
  });

  // Load settings only once on initial mount
  useEffect(() => {
    let isMounted = true;
    
    const loadDisplaySettings = async () => {
      if (isInitialized) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && isMounted) {
          // Get display settings
          const { data: displayData, error: displayError } = await supabase
            .from('display_settings')
            .select('language, currency, timezone')
            .eq('profile_id', user.id)
            .single();
          
          // Don't throw if no data is found - it's OK for settings to be missing initially
          if (displayError && displayError.code !== 'PGRST116') throw displayError;
          
          if (displayData && isMounted) {
            const loadedSettings = {
              language: displayData.language as Language || language,
              currency: displayData.currency as Currency || displaySettings.currency,
              timezone: displayData.timezone as Timezone || displaySettings.timezone,
            };
            
            // Only update if settings are different to avoid loops
            if (!isEqual(loadedSettings, localDisplaySettings)) {
              setLocalDisplaySettings(loadedSettings);
              
              // Only call updateDisplaySettings if values are different from current
              if (loadedSettings.language !== language || 
                  loadedSettings.currency !== displaySettings.currency || 
                  loadedSettings.timezone !== displaySettings.timezone) {
                updateDisplaySettings(loadedSettings);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading display settings:", error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };
    
    loadDisplaySettings();
    
    return () => {
      isMounted = false;
    };
  // Removed displaySettings from dependencies to prevent circular updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, updateDisplaySettings]);

  const updateDisplaySettingsField = useCallback((field: keyof DisplaySettings, value: any) => {
    // Only update if value is different to avoid unnecessary rerenders
    setLocalDisplaySettings(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

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
      
      // Only update context if values are different to avoid loops
      if (localDisplaySettings.language !== displaySettings.language ||
          localDisplaySettings.currency !== displaySettings.currency ||
          localDisplaySettings.timezone !== displaySettings.timezone) {
        updateDisplaySettings({
          language: localDisplaySettings.language,
          currency: localDisplaySettings.currency,
          timezone: localDisplaySettings.timezone
        });
      }
      
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

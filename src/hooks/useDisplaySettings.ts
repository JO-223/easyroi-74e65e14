
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language, Currency, Timezone, DisplaySettings } from "@/contexts/LanguageContext";
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
  
  // Use refs to track component state
  const settingsLoaded = useRef(false);
  const isMounted = useRef(true);
  const isSettingsUpdateScheduled = useRef(false);

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Early return if settings are already loaded to break potential loops
    if (settingsLoaded.current) {
      return;
    }
    
    const loadDisplaySettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || !isMounted.current) return;
        
        // Get display settings
        const { data: displayData, error: displayError } = await supabase
          .from('display_settings')
          .select('language, currency, timezone')
          .eq('profile_id', user.id)
          .maybeSingle();
        
        // Don't throw if no data is found - it's OK for settings to be missing initially
        if (displayError && displayError.code !== 'PGRST116') {
          console.error("Error loading display settings:", displayError);
          settingsLoaded.current = true; // Mark as loaded even on error to prevent loops
          return;
        }
        
        if (!displayData || !isMounted.current) {
          settingsLoaded.current = true; // Mark as loaded even with no data to prevent loops
          return;
        }
        
        const updatedSettings = {
          language: displayData.language as Language || displaySettings.language,
          currency: displayData.currency as Currency || displaySettings.currency,
          timezone: displayData.timezone as Timezone || displaySettings.timezone,
        };
        
        if (isMounted.current) {
          setLocalDisplaySettings(updatedSettings);
        }
        
        // Use setTimeout with a longer delay to avoid React state update deadlocks
        // Only update global settings once to avoid infinite loops
        if (isMounted.current && !settingsLoaded.current && !isSettingsUpdateScheduled.current) {
          isSettingsUpdateScheduled.current = true;
          
          setTimeout(() => {
            if (isMounted.current) {
              updateDisplaySettings({
                language: updatedSettings.language,
                currency: updatedSettings.currency,
                timezone: updatedSettings.timezone
              });
              
              // Mark settings as loaded to prevent future updates
              settingsLoaded.current = true;
              isSettingsUpdateScheduled.current = false;
            }
          }, 200);
        }
      } catch (error) {
        console.error("Error loading display settings:", error);
        settingsLoaded.current = true; // Mark as loaded even on error to prevent loops
      }
    };
    
    if (!settingsLoaded.current) {
      loadDisplaySettings();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Remove displaySettings from dependencies to prevent loops

  const updateDisplaySettingsField = (field: keyof DisplaySettings, value: any) => {
    if (!isMounted.current) return;
    
    setLocalDisplaySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveDisplaySettings = async () => {
    try {
      if (!isMounted.current) return false;
      
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
      
      // Use setTimeout to avoid React state update deadlocks
      if (isMounted.current && !isSettingsUpdateScheduled.current) {
        isSettingsUpdateScheduled.current = true;
        
        setTimeout(() => {
          if (isMounted.current) {
            updateDisplaySettings({
              language: localDisplaySettings.language,
              currency: localDisplaySettings.currency,
              timezone: localDisplaySettings.timezone
            });
            
            isSettingsUpdateScheduled.current = false;
          }
        }, 200);
      }
      
      if (isMounted.current) {
        toast({
          title: t('displaySettingsUpdated'),
          description: t('displaySettingsSaved'),
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating display settings:", error);
      
      if (isMounted.current) {
        toast({
          title: t('errorOccurred'),
          description: t('errorUpdatingSettings'),
          variant: "destructive"
        });
      }
      
      return false;
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  return {
    displaySettings: localDisplaySettings,
    isSaving,
    updateDisplaySettingsField,
    saveDisplaySettings
  };
}


import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCheck, Clock, Languages, Moon, Sun } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type SettingsType = 'account' | 'display' | 'notifications' | 'privacy';

const Settings = () => {
  const { toast } = useToast();
  const { displaySettings, updateDisplaySettings, t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [settingsData, setSettingsData] = useState({
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

  // Load user's settings from Supabase when component mounts
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

  return (
    <DashboardLayout title={t('settings')} subtitle={t('manageSettings')}>
      <div className="space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('accountSettings')}</CardTitle>
            <CardDescription>{t('accountSettingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('name')}
              </Label>
              <Input id="name" value={settingsData.account.name} className="col-span-2" disabled />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('email')}
              </Label>
              <Input id="email" value={settingsData.account.email} className="col-span-2" disabled />
            </div>
            <Button onClick={() => handleSettingsSubmit('account')} disabled={isSaving} className="ml-auto">
              {isSaving ? t('saving') : t('updateAccount')}
            </Button>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('displaySettings')}</CardTitle>
            <CardDescription>{t('displaySettingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                {t('language')}
              </Label>
              <Select 
                value={settingsData.display.language}
                onValueChange={(value) => setSettingsData(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    language: value as Language
                  }
                }))}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="italian">Italiano</SelectItem>
                  <SelectItem value="spanish">Español</SelectItem>
                  <SelectItem value="german">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                {t('currency')}
              </Label>
              <Select 
                value={settingsData.display.currency}
                onValueChange={(value) => setSettingsData(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    currency: value as Currency
                  }
                }))}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder={t('selectCurrency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="timezone" className="text-right">
                {t('timezone')}
              </Label>
              <Select 
                value={settingsData.display.timezone}
                onValueChange={(value) => setSettingsData(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    timezone: value as Timezone
                  }
                }))}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder={t('selectTimezone')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="cet">CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleSettingsSubmit('display')} disabled={isSaving} className="ml-auto">
              {isSaving ? t('saving') : t('updateDisplay')}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('notificationSettings')}</CardTitle>
            <CardDescription>{t('notificationSettingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1 leading-none">
                <p className="text-sm font-medium">{t('emailNotifications')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('emailNotificationsDesc')}
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={settingsData.notifications.email}
                onCheckedChange={(checked) => setSettingsData(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    email: checked
                  }
                }))} 
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1 leading-none">
                <p className="text-sm font-medium">{t('pushNotifications')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('pushNotificationsDesc')}
                </p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={settingsData.notifications.push}
                onCheckedChange={(checked) => setSettingsData(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    push: checked
                  }
                }))} 
              />
            </div>
            <Button onClick={() => handleSettingsSubmit('notifications')} disabled={isSaving} className="ml-auto">
              {isSaving ? t('saving') : t('updateNotifications')}
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('privacySettings')}</CardTitle>
            <CardDescription>{t('privacySettingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1 leading-none">
                <p className="text-sm font-medium">{t('publicProfile')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('publicProfileDesc')}
                </p>
              </div>
              <Switch 
                id="public-profile" 
                checked={settingsData.privacy.publicProfile}
                onCheckedChange={(checked) => setSettingsData(prev => ({
                  ...prev,
                  privacy: {
                    ...prev.privacy,
                    publicProfile: checked
                  }
                }))} 
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1 leading-none">
                <p className="text-sm font-medium">{t('dataSharing')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('dataSharingDesc')}
                </p>
              </div>
              <Switch 
                id="data-sharing" 
                checked={settingsData.privacy.dataSharing}
                onCheckedChange={(checked) => setSettingsData(prev => ({
                  ...prev,
                  privacy: {
                    ...prev.privacy,
                    dataSharing: checked
                  }
                }))} 
              />
            </div>
            <Button onClick={() => handleSettingsSubmit('privacy')} disabled={isSaving} className="ml-auto">
              {isSaving ? t('saving') : t('updatePrivacy')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

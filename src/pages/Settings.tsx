
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bell, Globe, Lock, Loader2, Mail, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type NotificationSettings = Database['public']['Tables']['notification_settings']['Row'];
type SecuritySettings = Database['public']['Tables']['security_settings']['Row'];
type DisplaySettings = Database['public']['Tables']['display_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface UISecuritySettings extends Omit<SecuritySettings, 'session_timeout'> {
  session_timeout: string;
}

const Settings = () => {
  const { toast } = useToast();
  const { displaySettings: contextDisplaySettings, updateDisplaySettings, t } = useLanguage();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    profile_id: "",
    email_notifications: true,
    sms_notifications: false,
    property_alerts: true,
    event_reminders: true,
    marketing_updates: false,
    app_notifications: true
  });
  
  const [securitySettings, setSecuritySettings] = useState<UISecuritySettings>({
    profile_id: "",
    two_factor_auth: false,
    login_alerts: true,
    session_timeout: "30",
  });
  
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    profile_id: "",
    language: contextDisplaySettings.language as Language,
    currency: contextDisplaySettings.currency as Currency,
    timezone: contextDisplaySettings.timezone as Timezone
  });
  
  const [profile, setProfile] = useState<Profile>({
    id: "",
    email: "",
    first_name: null,
    last_name: null,
    phone: null,
    location: null,
    bio: null,
    join_date: "",
    level: null,
    avatar_url: null
  });
  
  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No user logged in");
        }
        
        setUserId(user.id);
        
        // Fetch notification settings
        const { data: notifData, error: notifError } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('profile_id', user.id)
          .single();
        
        if (notifError && notifError.code !== 'PGRST116') {
          throw notifError;
        }
        
        // Fetch security settings
        const { data: securityData, error: securityError } = await supabase
          .from('security_settings')
          .select('*')
          .eq('profile_id', user.id)
          .single();
        
        if (securityError && securityError.code !== 'PGRST116') {
          throw securityError;
        }
        
        // Fetch display settings
        const { data: displayData, error: displayError } = await supabase
          .from('display_settings')
          .select('*')
          .eq('profile_id', user.id)
          .single();
        
        if (displayError && displayError.code !== 'PGRST116') {
          throw displayError;
        }
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // Update states with fetched data
        if (notifData) {
          setNotificationSettings({
            ...notifData
          });
        } else {
          setNotificationSettings({
            ...notificationSettings,
            profile_id: user.id
          });
        }
        
        if (securityData) {
          setSecuritySettings({
            ...securityData,
            session_timeout: securityData.session_timeout?.toString() || "30"
          });
        } else {
          setSecuritySettings({
            ...securitySettings,
            profile_id: user.id
          });
        }
        
        if (displayData) {
          setDisplaySettings({
            ...displayData
          });
          updateDisplaySettings(displayData as any);
        } else {
          setDisplaySettings({
            ...displaySettings,
            profile_id: user.id
          });
        }
        
        if (profileData) {
          setProfile({
            ...profile,
            ...profileData,
            id: user.id
          });
        } else {
          setProfile({
            ...profile,
            id: user.id
          });
        }
        
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: t('errorOccurred'),
          description: t('errorLoadingSettings'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast, t, updateDisplaySettings]);
  
  const handleSaveSettings = async (section: string) => {
    if (!userId) return;
    
    try {
      setSavingSection(section);
      
      switch (section) {
        case 'notificationSettings':
          await supabase
            .from('notification_settings')
            .upsert({
              profile_id: userId,
              email_notifications: notificationSettings.email_notifications,
              sms_notifications: notificationSettings.sms_notifications,
              property_alerts: notificationSettings.property_alerts,
              event_reminders: notificationSettings.event_reminders,
              marketing_updates: notificationSettings.marketing_updates,
              app_notifications: notificationSettings.app_notifications
            });
          break;
          
        case 'securitySettings':
          await supabase
            .from('security_settings')
            .upsert({
              profile_id: userId,
              two_factor_auth: securitySettings.two_factor_auth,
              login_alerts: securitySettings.login_alerts,
              session_timeout: parseInt(securitySettings.session_timeout)
            });
          break;
          
        case 'displaySettings':
          await supabase
            .from('display_settings')
            .upsert({
              profile_id: userId,
              language: displaySettings.language,
              currency: displaySettings.currency,
              timezone: displaySettings.timezone
            });
          
          // Update context for immediate effect
          updateDisplaySettings(displaySettings);
          break;
          
        default:
          break;
      }
      
      toast({
        title: t('settingsSaved'),
        description: `${t(section)} ${t('savedSuccessfully')}`,
      });
      
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast({
        title: t('errorOccurred'),
        description: t('errorSavingSettings'),
        variant: "destructive"
      });
    } finally {
      setSavingSection(null);
    }
  };
  
  const updateEmail = async () => {
    try {
      if (!userId || !profile.email) return;
      
      await supabase
        .from('profiles')
        .update({ email: profile.email })
        .eq('id', userId);
      
      toast({
        title: t('emailUpdated'),
        description: t('emailUpdatedSuccess')
      });
      
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: t('errorOccurred'),
        description: t('errorUpdatingEmail'),
        variant: "destructive"
      });
    }
  };
  
  const updatePhone = async () => {
    try {
      if (!userId) return;
      
      await supabase
        .from('profiles')
        .update({ phone: profile.phone })
        .eq('id', userId);
      
      toast({
        title: t('phoneUpdated'),
        description: t('phoneUpdatedSuccess')
      });
      
    } catch (error) {
      console.error("Error updating phone:", error);
      toast({
        title: t('errorOccurred'),
        description: t('errorUpdatingPhone'),
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('settings')} subtitle={t('configurePreferences')}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
          <span className="ml-2 text-lg text-easyroi-navy">{t('loadingSettings')}</span>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title={t('settings')} subtitle={t('configurePreferences')}>
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 md:w-[400px]">
          <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
          <TabsTrigger value="account">{t('account')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
        </TabsList>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-easyroi-navy" />
                <CardTitle>{t('notificationSettings')}</CardTitle>
              </div>
              <CardDescription>{t('notificationSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t('notificationChannels')}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">{t('emailNotifications')}</Label>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.email_notifications || false}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="sms-notifications">{t('smsNotifications')}</Label>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notificationSettings.sms_notifications || false}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms_notifications: checked})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t('notificationTypes')}</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="property-alerts">{t('propertyAlerts')}</Label>
                  <Switch 
                    id="property-alerts" 
                    checked={notificationSettings.property_alerts || false}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, property_alerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="event-reminders">{t('eventReminders')}</Label>
                  <Switch 
                    id="event-reminders" 
                    checked={notificationSettings.event_reminders || false}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, event_reminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-updates">{t('marketingNewsletter')}</Label>
                  <Switch 
                    id="marketing-updates" 
                    checked={notificationSettings.marketing_updates || false}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketing_updates: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={() => handleSaveSettings('notificationSettings')}
                disabled={savingSection === 'notificationSettings'}
              >
                {savingSection === 'notificationSettings' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('saveNotificationSettings')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-easyroi-navy" />
                <CardTitle>{t('securitySettings')}</CardTitle>
              </div>
              <CardDescription>{t('securitySettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t('authentication')}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth">{t('twoFactorAuth')}</Label>
                    <p className="text-sm text-muted-foreground">{t('twoFactorDesc')}</p>
                  </div>
                  <Switch 
                    id="two-factor-auth" 
                    checked={securitySettings.two_factor_auth || false}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, two_factor_auth: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">{t('loginAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('loginAlertsDesc')}</p>
                  </div>
                  <Switch 
                    id="login-alerts" 
                    checked={securitySettings.login_alerts || false}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, login_alerts: checked})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-3">
                <h3 className="text-sm font-medium">{t('passwordManagement')}</h3>
                <Button variant="outline">{t('changePassword')}</Button>
              </div>
              
              <Separator />
              
              <div className="grid gap-3">
                <h3 className="text-sm font-medium">{t('sessionManagement')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-timeout">{t('sessionTimeout')}</Label>
                    <p className="text-sm text-muted-foreground">{t('sessionTimeoutDesc')}</p>
                  </div>
                  <Select 
                    value={securitySettings.session_timeout} 
                    onValueChange={(value) => setSecuritySettings({...securitySettings, session_timeout: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 {t('minutes')}</SelectItem>
                      <SelectItem value="30">30 {t('minutes')}</SelectItem>
                      <SelectItem value="60">1 {t('hour')}</SelectItem>
                      <SelectItem value="120">2 {t('hours')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={() => handleSaveSettings('securitySettings')}
                disabled={savingSection === 'securitySettings'}
              >
                {savingSection === 'securitySettings' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('saveSecuritySettings')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-easyroi-navy" />
                <CardTitle>{t('displayPreferences')}</CardTitle>
              </div>
              <CardDescription>{t('displayPreferences')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language">{t('language')}</Label>
                  <Select 
                    value={displaySettings.language || 'english'} 
                    onValueChange={(value) => setDisplaySettings({ ...displaySettings, language: value as Language })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italiano</SelectItem>
                      <SelectItem value="spanish">Español</SelectItem>
                      <SelectItem value="german">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency">{t('displayCurrency')}</Label>
                  <Select 
                    value={displaySettings.currency || 'eur'} 
                    onValueChange={(value) => setDisplaySettings({ ...displaySettings, currency: value as Currency })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="chf">CHF (Fr.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">{t('timezone')}</Label>
                  <Select 
                    value={displaySettings.timezone || 'europe_rome'} 
                    onValueChange={(value) => setDisplaySettings({ ...displaySettings, timezone: value as Timezone })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe_rome">Europe/Rome (UTC+1/2)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+0/1)</SelectItem>
                      <SelectItem value="europe_zurich">Europe/Zurich (UTC+1/2)</SelectItem>
                      <SelectItem value="america_newyork">America/New York (UTC-5/4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">{t('contactInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t('primaryEmail')}</Label>
                    <div className="flex mt-1">
                      <Input 
                        id="email" 
                        value={profile.email || ''} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})} 
                        className="rounded-r-none" 
                      />
                      <Button 
                        className="rounded-l-none"
                        onClick={updateEmail}
                      >
                        {t('update')}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('phoneNumber')}</Label>
                    <div className="flex mt-1">
                      <Input 
                        id="phone" 
                        value={profile.phone || ''} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                        className="rounded-r-none" 
                      />
                      <Button 
                        className="rounded-l-none"
                        onClick={updatePhone}
                      >
                        {t('update')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={() => handleSaveSettings('displaySettings')}
                disabled={savingSection === 'displaySettings'}
              >
                {savingSection === 'displaySettings' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('savePreferences')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;

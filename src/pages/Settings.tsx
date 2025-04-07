
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bell, Globe, Lock, Mail, Phone, Save, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";

const Settings = () => {
  const { toast } = useToast();
  const { displaySettings, updateDisplaySettings, t } = useLanguage();
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    propertyAlerts: true,
    eventReminders: true,
    marketingUpdates: false,
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });
  
  const handleSaveSettings = (section: string) => {
    toast({
      title: t('saveSettings'),
      description: `${t(section)} ${t('saveSettings').toLowerCase()}.`,
    });
  };
  
  const handleSavePreferences = () => {
    updateDisplaySettings({
      language: displaySettings.language,
      currency: displaySettings.currency,
      timezone: displaySettings.timezone
    });
    
    toast({
      title: t('savePreferences'),
      description: t('savePreferences'),
    });
  };
  
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
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="sms-notifications">{t('smsNotifications')}</Label>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
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
                    checked={notificationSettings.propertyAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, propertyAlerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="event-reminders">{t('eventReminders')}</Label>
                  <Switch 
                    id="event-reminders" 
                    checked={notificationSettings.eventReminders}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, eventReminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-updates">{t('marketingNewsletter')}</Label>
                  <Switch 
                    id="marketing-updates" 
                    checked={notificationSettings.marketingUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingUpdates: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={() => handleSaveSettings('notificationSettings')}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('saveNotificationSettings')}
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
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">{t('loginAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('loginAlertsDesc')}</p>
                  </div>
                  <Switch 
                    id="login-alerts" 
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
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
                    value={securitySettings.sessionTimeout} 
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
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
              >
                <Save className="mr-2 h-4 w-4" />
                {t('saveSecuritySettings')}
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
                    value={displaySettings.language} 
                    onValueChange={(value) => updateDisplaySettings({ language: value as Language })}
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
                    value={displaySettings.currency} 
                    onValueChange={(value) => updateDisplaySettings({ currency: value as Currency })}
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
                    value={displaySettings.timezone} 
                    onValueChange={(value) => updateDisplaySettings({ timezone: value as Timezone })}
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
                      <Input id="email" value="john.doe@example.com" readOnly className="rounded-r-none" />
                      <Button className="rounded-l-none">{t('verify')}</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('phoneNumber')}</Label>
                    <div className="flex mt-1">
                      <Input id="phone" value="+39 123 456 7890" readOnly className="rounded-r-none" />
                      <Button className="rounded-l-none">{t('verify')}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={handleSavePreferences}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('savePreferences')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;

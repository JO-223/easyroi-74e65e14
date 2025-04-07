
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

const Settings = () => {
  const { toast } = useToast();
  
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
  
  const [displaySettings, setDisplaySettings] = useState({
    language: "english",
    currency: "eur",
    timezone: "europe_rome",
  });
  
  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings Updated",
      description: `Your ${section} settings have been saved successfully.`,
    });
  };
  
  return (
    <DashboardLayout title="Settings" subtitle="Configure your account preferences and settings">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 md:w-[400px]">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-easyroi-navy" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Notification Channels</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
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
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
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
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="property-alerts">Property Alerts & Updates</Label>
                  <Switch 
                    id="property-alerts" 
                    checked={notificationSettings.propertyAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, propertyAlerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="event-reminders">Event Reminders</Label>
                  <Switch 
                    id="event-reminders" 
                    checked={notificationSettings.eventReminders}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, eventReminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-updates">Marketing & Newsletter</Label>
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
                onClick={() => handleSaveSettings('notification')}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
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
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth">Two-factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch 
                    id="two-factor-auth" 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when someone logs into your account.</p>
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
                <h3 className="text-sm font-medium">Password Management</h3>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <Separator />
              
              <div className="grid gap-3">
                <h3 className="text-sm font-medium">Session Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-timeout">Automatic Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Choose how long until your session expires.</p>
                  </div>
                  <Select 
                    value={securitySettings.sessionTimeout} 
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={() => handleSaveSettings('security')}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
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
                <CardTitle>Display Preferences</CardTitle>
              </div>
              <CardDescription>Customize your regional and interface preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={displaySettings.language} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, language: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency">Display Currency</Label>
                  <Select 
                    value={displaySettings.currency} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, currency: value})}
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
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={displaySettings.timezone} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, timezone: value})}
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
                <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Primary Email Address</Label>
                    <div className="flex mt-1">
                      <Input id="email" value="john.doe@example.com" readOnly className="rounded-r-none" />
                      <Button className="rounded-l-none">Verify</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex mt-1">
                      <Input id="phone" value="+39 123 456 7890" readOnly className="rounded-r-none" />
                      <Button className="rounded-l-none">Verify</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-easyroi-navy hover:bg-easyroi-navy/90"
                onClick={() => handleSaveSettings('display')}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;

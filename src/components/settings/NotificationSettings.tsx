
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  isSaving: boolean;
  onEmailNotificationsChange: (checked: boolean) => void;
  onPushNotificationsChange: (checked: boolean) => void;
  onSave: () => void;
}

export function NotificationSettings({
  emailNotifications,
  pushNotifications,
  isSaving,
  onEmailNotificationsChange,
  onPushNotificationsChange,
  onSave,
}: NotificationSettingsProps) {
  const { t } = useLanguage();

  return (
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
            checked={emailNotifications}
            onCheckedChange={onEmailNotificationsChange} 
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
            checked={pushNotifications}
            onCheckedChange={onPushNotificationsChange} 
          />
        </div>
        <Button onClick={onSave} disabled={isSaving} className="ml-auto">
          {isSaving ? t('saving') : t('updateNotifications')}
        </Button>
      </CardContent>
    </Card>
  );
}

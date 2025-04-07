
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

interface PrivacySettingsProps {
  publicProfile: boolean;
  dataSharing: boolean;
  isSaving: boolean;
  onPublicProfileChange: (checked: boolean) => void;
  onDataSharingChange: (checked: boolean) => void;
  onSave: () => void;
}

export function PrivacySettings({
  publicProfile,
  dataSharing,
  isSaving,
  onPublicProfileChange,
  onDataSharingChange,
  onSave,
}: PrivacySettingsProps) {
  const { t } = useLanguage();

  return (
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
            checked={publicProfile}
            onCheckedChange={onPublicProfileChange} 
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
            checked={dataSharing}
            onCheckedChange={onDataSharingChange} 
          />
        </div>
        <Button onClick={onSave} disabled={isSaving} className="ml-auto">
          {isSaving ? t('saving') : t('updatePrivacy')}
        </Button>
      </CardContent>
    </Card>
  );
}

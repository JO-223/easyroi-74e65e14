
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PrivacySettingsProps {
  publicProfile: boolean;
  dataSharing: boolean;
  profileVisibility: "public" | "semi-public" | "private";
  isSaving: boolean;
  onPublicProfileChange: (checked: boolean) => void;
  onDataSharingChange: (checked: boolean) => void;
  onProfileVisibilityChange: (value: "public" | "semi-public" | "private") => void;
  onSave: () => void;
}

export function PrivacySettings({
  publicProfile,
  dataSharing,
  profileVisibility,
  isSaving,
  onPublicProfileChange,
  onDataSharingChange,
  onProfileVisibilityChange,
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

        <div className="rounded-md border p-4">
          <div className="space-y-1 mb-4">
            <p className="text-sm font-medium">{t('profileVisibility')}</p>
            <p className="text-sm text-muted-foreground">
              {t('profileVisibilityDesc')}
            </p>
          </div>
          <RadioGroup 
            value={profileVisibility} 
            onValueChange={value => onProfileVisibilityChange(value as "public" | "semi-public" | "private")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="font-medium">{t('profilePublic')}</Label>
              <span className="text-xs text-muted-foreground">— {t('profilePublicDesc')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="semi-public" id="semi-public" />
              <Label htmlFor="semi-public" className="font-medium">{t('profileSemiPublic')}</Label>
              <span className="text-xs text-muted-foreground">— {t('profileSemiPublicDesc')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="font-medium">{t('profilePrivate')}</Label>
              <span className="text-xs text-muted-foreground">— {t('profilePrivateDesc')}</span>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={onSave} disabled={isSaving} className="ml-auto">
          {isSaving ? t('saving') : t('updatePrivacy')}
        </Button>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccountSettingsProps {
  name: string;
  email: string;
  isSaving: boolean;
  onSave: () => void;
}

export function AccountSettings({ name, email, isSaving, onSave }: AccountSettingsProps) {
  const { t } = useLanguage();

  return (
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
          <Input id="name" value={name} className="col-span-2" disabled />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            {t('email')}
          </Label>
          <Input id="email" value={email} className="col-span-2" disabled />
        </div>
        <Button onClick={onSave} disabled={isSaving} className="ml-auto">
          {isSaving ? t('saving') : t('updateAccount')}
        </Button>
      </CardContent>
    </Card>
  );
}

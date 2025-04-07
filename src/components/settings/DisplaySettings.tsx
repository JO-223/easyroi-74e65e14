
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, Language, Currency, Timezone } from "@/contexts/LanguageContext";

interface DisplaySettingsProps {
  language: Language;
  currency: Currency;
  timezone: Timezone;
  isSaving: boolean;
  onLanguageChange: (value: Language) => void;
  onCurrencyChange: (value: Currency) => void;
  onTimezoneChange: (value: Timezone) => void;
  onSave: () => void;
}

export function DisplaySettings({
  language,
  currency,
  timezone,
  isSaving,
  onLanguageChange,
  onCurrencyChange,
  onTimezoneChange,
  onSave,
}: DisplaySettingsProps) {
  const { t } = useLanguage();

  return (
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
          <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder={t('selectLanguage')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
          <Select value={currency} onValueChange={(value) => onCurrencyChange(value as Currency)}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder={t('selectCurrency')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
          <Select value={timezone} onValueChange={(value) => onTimezoneChange(value as Timezone)}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder={t('selectTimezone')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="europe_rome">Europe/Rome</SelectItem>
              <SelectItem value="europe_london">Europe/London</SelectItem>
              <SelectItem value="america_newyork">America/New York</SelectItem>
              <SelectItem value="europe_zurich">Europe/Zurich</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onSave} disabled={isSaving} className="ml-auto">
          {isSaving ? t('saving') : t('updateDisplay')}
        </Button>
      </CardContent>
    </Card>
  );
}

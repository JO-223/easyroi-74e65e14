
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AdminEventFormValues } from "./types";

interface EventLocationFieldsProps {
  form: UseFormReturn<AdminEventFormValues>;
}

export function EventLocationFields({ form }: EventLocationFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('location')}</FormLabel>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input placeholder={t('enterLocation')} {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isOnline"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
            <FormControl>
              <Checkbox 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                {t('isOnlineEvent')}
              </FormLabel>
              <FormDescription>
                {t('onlineEventDescription')}
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

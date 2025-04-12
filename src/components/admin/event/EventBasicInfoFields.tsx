
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AdminEventFormValues } from "./types";

interface EventBasicInfoFieldsProps {
  form: UseFormReturn<AdminEventFormValues>;
}

export function EventBasicInfoFields({ form }: EventBasicInfoFieldsProps) {
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('eventTitle')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterEventTitle')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterEventDescription')} 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

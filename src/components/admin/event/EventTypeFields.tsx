
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AdminEventFormValues } from "./types";

interface EventTypeFieldsProps {
  form: UseFormReturn<AdminEventFormValues>;
}

export function EventTypeFields({ form }: EventTypeFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="eventType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('eventType')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="presentation">{t('presentation')}</SelectItem>
                <SelectItem value="workshop">{t('workshop')}</SelectItem>
                <SelectItem value="networking">{t('networking')}</SelectItem>
                <SelectItem value="property_tour">{t('propertyTour')}</SelectItem>
                <SelectItem value="investment_conference">{t('investmentConference')}</SelectItem>
                <SelectItem value="webinar">{t('webinar')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="maxAttendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('maxAttendees')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1}
                placeholder="50" 
                {...field}
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>
              {t('leaveBlankForUnlimited')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

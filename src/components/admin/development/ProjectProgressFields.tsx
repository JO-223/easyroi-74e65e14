
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AdminDevelopmentProjectFormValues } from "./types";

interface ProjectProgressFieldsProps {
  form: UseFormReturn<AdminDevelopmentProjectFormValues>;
}

export function ProjectProgressFields({ form }: ProjectProgressFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="progressPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('progressPercentage')} (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0}
                max={100}
                placeholder="0" 
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="totalUnits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('totalUnits')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1}
                placeholder="1" 
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="availableUnits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('availableUnits')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0}
                placeholder="0" 
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}


import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AdminDevelopmentProjectFormValues } from "./types";

interface ProjectInvestmentFieldsProps {
  form: UseFormReturn<AdminDevelopmentProjectFormValues>;
}

export function ProjectInvestmentFields({ form }: ProjectInvestmentFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="minInvestment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('minInvestment')} (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>
              {t('optionalField')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="expectedRoi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('expectedRoi')} (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                {...field}
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>
              {t('optionalField')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="investorLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('investorLevel')}</FormLabel>
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
                <SelectItem value="starter">{t('starterInvestor')}</SelectItem>
                <SelectItem value="bronze">{t('bronzeInvestor')}</SelectItem>
                <SelectItem value="silver">{t('silverInvestor')}</SelectItem>
                <SelectItem value="gold">{t('goldInvestor')}</SelectItem>
                <SelectItem value="ruby">{t('rubyInvestor')}</SelectItem>
                <SelectItem value="emerald">{t('emeraldInvestor')}</SelectItem>
                <SelectItem value="platinum">{t('platinumInvestor')}</SelectItem>
                <SelectItem value="diamond">{t('diamondInvestor')}</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {t('minimumLevelRequired')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

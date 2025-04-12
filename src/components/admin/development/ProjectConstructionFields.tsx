
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AdminDevelopmentProjectFormValues } from "./types";

interface ProjectConstructionFieldsProps {
  form: UseFormReturn<AdminDevelopmentProjectFormValues>;
}

export function ProjectConstructionFields({ form }: ProjectConstructionFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="expectedCompletion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('expectedCompletion')}</FormLabel>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="constructionStage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('constructionStage')}</FormLabel>
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
                <SelectItem value="planning">{t('planning')}</SelectItem>
                <SelectItem value="foundation">{t('foundation')}</SelectItem>
                <SelectItem value="framing">{t('framing')}</SelectItem>
                <SelectItem value="interior">{t('interior')}</SelectItem>
                <SelectItem value="finishing">{t('finishing')}</SelectItem>
                <SelectItem value="completed">{t('completed')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

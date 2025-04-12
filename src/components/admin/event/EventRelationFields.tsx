
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AdminEventFormValues } from "./types";
import { AdminProperty, AdminDevelopmentProject } from "@/types/admin";

interface EventRelationFieldsProps {
  form: UseFormReturn<AdminEventFormValues>;
  properties: AdminProperty[];
  projects: AdminDevelopmentProject[];
}

export function EventRelationFields({ form, properties, projects }: EventRelationFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="propertyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('relatedProperty')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectProperty')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">{t('none')}</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {t('optionalField')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="projectId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('relatedProject')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectProject')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">{t('none')}</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {t('optionalField')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

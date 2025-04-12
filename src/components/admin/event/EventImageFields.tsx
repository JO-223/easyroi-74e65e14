
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AdminEventFormValues } from "./types";

interface EventImageFieldsProps {
  form: UseFormReturn<AdminEventFormValues>;
}

export function EventImageFields({ form }: EventImageFieldsProps) {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('imageUrl')}</FormLabel>
          <div className="flex items-center">
            <Link className="mr-2 h-4 w-4 text-muted-foreground" />
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
          </div>
          <FormDescription>
            {t('optionalField')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

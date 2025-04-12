
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldTooltip } from "./FieldTooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Control } from "react-hook-form";
import { PropertyFormValues } from "./types";

interface BasicInfoFieldsProps {
  control: Control<PropertyFormValues>;
}

export function BasicInfoFields({ control }: BasicInfoFieldsProps) {
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("propertyName")} tooltip={t("tooltip.propertyName")} />
            </FormLabel>
            <FormControl>
              <Input placeholder={t("enterPropertyName")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

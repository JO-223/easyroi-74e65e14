
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldTooltip } from "./FieldTooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Control } from "react-hook-form";
import { PropertyFormValues } from "./types";
import { PropertyType } from "@/types/property";

interface PropertyTypeFieldProps {
  control: Control<PropertyFormValues>;
  propertyTypes: PropertyType[];
}

export function PropertyTypeField({ control, propertyTypes }: PropertyTypeFieldProps) {
  const { t } = useLanguage();

  return (
    <FormField
      control={control}
      name="typeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <FieldTooltip label={t("propertyType")} tooltip={t("tooltip.propertyType")} />
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("selectPropertyType")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

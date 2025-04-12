
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldTooltip } from "./FieldTooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Control } from "react-hook-form";
import { PropertyFormValues } from "./types";

interface LocationFieldsProps {
  control: Control<PropertyFormValues>;
  availableCountries: string[];
}

export function LocationFields({ control, availableCountries }: LocationFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("address")} tooltip={t("tooltip.address")} />
            </FormLabel>
            <FormControl>
              <Input placeholder={t("enterAddress")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("city")} tooltip={t("tooltip.city")} />
            </FormLabel>
            <FormControl>
              <Input placeholder={t("enterCity")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("country")} tooltip={t("tooltip.country")} />
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCountry")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="zone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("zone")} tooltip={t("tooltip.zone")} />
            </FormLabel>
            <FormControl>
              <Input placeholder={t("enterZone")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

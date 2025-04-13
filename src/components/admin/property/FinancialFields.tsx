
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldTooltip } from "./FieldTooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Control } from "react-hook-form";
import { PropertyFormValues } from "./types";
import { useEffect, useState } from "react";

interface FinancialFieldsProps {
  control: Control<PropertyFormValues>;
  watchCountry: string;
}

export function FinancialFields({ control, watchCountry }: FinancialFieldsProps) {
  const { t } = useLanguage();
  const [showServiceCharges, setShowServiceCharges] = useState(false);
  
  useEffect(() => {
    setShowServiceCharges(watchCountry === "UAE");
  }, [watchCountry]);

  return (
    <>
      <FormField
        control={control}
        name="roiPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("roiPercentage")} tooltip={t("roiPercentageTooltip")} />
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                step="0.01"
                {...field}
                value={field.value === undefined ? "" : field.value}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>{t("percentageExample")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {showServiceCharges && (
        <FormField
          control={control}
          name="serviceCharges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldTooltip label={t("serviceCharges")} tooltip={t("serviceChargesTooltip")} />
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>{t("serviceChargesDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

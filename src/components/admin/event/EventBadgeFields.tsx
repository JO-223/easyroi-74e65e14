
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { AdminEventFormValues } from "./types";

interface EventBadgeFieldsProps {
  form: UseFormReturn<AdminEventFormValues>;
}

export function EventBadgeFields({ form }: EventBadgeFieldsProps) {
  const { t } = useLanguage();
  
  const investorLevelOptions = [
    { value: "starter", label: "Starter" },
    { value: "bronze", label: "Bronze" },
    { value: "silver", label: "Silver" },
    { value: "gold", label: "Gold" },
    { value: "ruby", label: "Ruby" },
    { value: "emerald", label: "Emerald" },
    { value: "platinum", label: "Platinum" },
    { value: "diamond", label: "Diamond" }
  ];

  return (
    <FormField
      control={form.control}
      name="requiredBadges"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{t('requiredInvestorLevels')}</FormLabel>
            <FormDescription>
              {t('selectInvestorLevelsEvent')}
            </FormDescription>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {investorLevelOptions.map((level) => (
              <FormField
                key={level.value}
                control={form.control}
                name="requiredBadges"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={level.value}
                      className="flex flex-row items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(level.value)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, level.value]);
                            } else {
                              field.onChange(current.filter((val) => val !== level.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {level.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

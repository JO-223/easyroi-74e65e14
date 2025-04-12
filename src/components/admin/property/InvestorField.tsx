
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldTooltip } from "./FieldTooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Control } from "react-hook-form";
import { PropertyFormValues } from "./types";
import { Investor } from "@/types/admin";
import { useEffect, useState } from "react";

interface InvestorFieldProps {
  control: Control<PropertyFormValues>;
  investors: Investor[];
}

export function InvestorField({ control, investors }: InvestorFieldProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FormField
      control={control}
      name="userId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <FieldTooltip label={t("investor")} tooltip={t("tooltip.investor")} />
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("selectInvestor")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {investors.length === 0 ? (
                <SelectItem value="no-investors" disabled>
                  {t("noInvestorsAvailable")}
                </SelectItem>
              ) : (
                investors.map((investor) => (
                  <SelectItem key={investor.id} value={investor.id}>
                    {investor.first_name} {investor.last_name} ({investor.email})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

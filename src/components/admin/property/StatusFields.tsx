
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldTooltip } from "./FieldTooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Control } from "react-hook-form";
import { PropertyFormValues } from "./types";

interface StatusFieldsProps {
  control: Control<PropertyFormValues>;
  occupationOptions: string[];
  statusOptions: string[];
  listingOptions: string[];
}

export function StatusFields({ 
  control, 
  occupationOptions, 
  statusOptions, 
  listingOptions 
}: StatusFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={control}
        name="occupationStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("occupationStatus")} tooltip={t("tooltip.occupationStatus")} />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectOccupationStatus")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {occupationOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("status")} tooltip={t("tooltip.status")} />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
        name="listingStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldTooltip label={t("listingStatus")} tooltip={t("tooltip.listingStatus")} />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectListingStatus")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {listingOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

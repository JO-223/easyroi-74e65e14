
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form } from "@/components/ui/form";
import { fetchInvestors } from "@/services/admin/investorService";
import { fetchPropertyTypes } from "@/services/admin/propertyService";
import { addPropertyForUser } from "@/services/admin/propertyService";
import { useAdminActions } from "@/services/admin/hooks/useAdminActions";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Investor } from "@/types/admin";
import { PropertyType } from "@/types/property";
import { RpcResponse } from "@/services/admin/utils";

import { PropertyFormLayout } from "./property/PropertyFormLayout";
import { BasicInfoFields } from "./property/BasicInfoFields";
import { LocationFields } from "./property/LocationFields";
import { PropertyTypeField } from "./property/PropertyTypeField";
import { PriceFields } from "./property/PriceFields";
import { SizeFields } from "./property/SizeFields";
import { StatusFields } from "./property/StatusFields";
import { FinancialFields } from "./property/FinancialFields";
import { InvestorField } from "./property/InvestorField";
import { SubmitButton } from "./property/SubmitButton";

import { 
  propertyFormSchema, 
  PropertyFormValues,
  AVAILABLE_COUNTRIES_LIST,
  OCCUPATION_STATUS_LIST,
  STATUS_LIST,
  LISTING_STATUS_LIST,
  CURRENCY_LIST
} from "./property/types";

export function AdminPropertyForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAdminAction } = useAdminActions();
  const { toast } = useToast();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      userId: "",
      name: "",
      address: "",
      city: "",
      country: "Italy",
      zone: "",
      typeId: "",
      price: 0,
      currency: "EUR",
      sizeSqm: 0,
      bedrooms: 0,
      bathrooms: 0,
      occupationStatus: "vacant",
      status: "active",
      listingStatus: "not_listed",
      roiPercentage: undefined,
      serviceCharges: undefined
    }
  });

  const watchCountry = form.watch("country");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [investorsData, propertyTypesData] = await Promise.all([
          fetchInvestors(),
          fetchPropertyTypes()
        ]);
        setInvestors(investorsData);
        setPropertyTypes(propertyTypesData as PropertyType[]);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast({
          title: t("error"),
          description: t("errorFetchingFormData"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast, t]);

  const onSubmit = async (data: PropertyFormValues): Promise<RpcResponse> => {
    setIsSubmitting(true);
    return await handleAdminAction(
      async () => {
        return await addPropertyForUser(data.userId, {
          name: data.name,
          address: data.address,
          city: data.city,
          country: data.country,
          zone: data.zone,
          typeId: data.typeId,
          price: data.price,
          sizeSqm: data.sizeSqm,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          occupationStatus: data.occupationStatus,
          status: data.status,
          price_currency: data.currency,
          listing_status: data.listingStatus,
          roiPercentage: data.roiPercentage,
          serviceCharges: data.serviceCharges
        });
      },
      t("propertyAddedSuccessfully"),
      t("errorAddingProperty")
    );
  };

  return (
    <PropertyFormLayout title={t("addPropertyForUser")} isLoading={isLoading}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InvestorField control={form.control} investors={investors} />
          <BasicInfoFields control={form.control} />
          <LocationFields control={form.control} availableCountries={AVAILABLE_COUNTRIES_LIST} />
          <PropertyTypeField control={form.control} propertyTypes={propertyTypes} />
          <PriceFields control={form.control} currencies={CURRENCY_LIST} />
          <SizeFields control={form.control} />
          <StatusFields 
            control={form.control} 
            occupationOptions={OCCUPATION_STATUS_LIST}
            statusOptions={STATUS_LIST}
            listingOptions={LISTING_STATUS_LIST}
          />
          <FinancialFields control={form.control} watchCountry={watchCountry} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </PropertyFormLayout>
  );
}

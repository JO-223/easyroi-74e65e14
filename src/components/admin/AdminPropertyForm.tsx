
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchInvestors } from "@/services/admin/investorService";
import { fetchPropertyTypes } from "@/services/admin/propertyService";
import { addPropertyForUser } from "@/services/admin/propertyService";
import { useAdminActions } from "@/services/admin/hooks/useAdminActions";
import { useState, useEffect } from "react";
import { Building2, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Investor } from "@/types/admin";
import { PropertyType } from "@/types/property";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AVAILABLE_COUNTRIES = ["Italy", "UAE", "Thailand", "Switzerland"];
const OCCUPATION_STATUS_OPTIONS = ["rented", "occupied", "vacant", "partially_occupied"];
const STATUS_OPTIONS = ["active", "pending", "residential"];
const LISTING_STATUS_OPTIONS = ["for_sale", "negotiable", "not_listed"];
const CURRENCY_OPTIONS = ["EUR", "USD", "AED"];

const PROPERTY_RULES = {
  active: {
    rented: {
      visibility: ["dashboard", "analytics"],
      public: false,
      roi: true
    },
    occupied: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    },
    vacant: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    },
    partially_occupied: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    }
  },
  residential: {
    rented: { 
      visibility: ["dashboard", "analytics"],
      public: false,
      roi: true
    },
    occupied: {
      visibility: ["dashboard", "analytics"],
      public: false,
      roi: false
    },
    partially_occupied: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    },
    vacant: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    }
  },
  pending: {
    rented: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    },
    occupied: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    },
    vacant: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    },
    partially_occupied: {
      visibility: ["dashboard"],
      public: false,
      roi: false
    }
  }
};

const formSchema = z.object({
  userId: z.string().min(1, "Investor is required"),
  name: z.string().min(2, "Property name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.enum(AVAILABLE_COUNTRIES as [string, ...string[]]),
  zone: z.string().min(1, "Zone is required"),
  typeId: z.string().min(1, "Property type is required"),
  price: z.number().min(1, "Price is required"),
  currency: z.enum(CURRENCY_OPTIONS as [string, ...string[]]),
  sizeSqm: z.number().min(1, "Size is required"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or greater"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or greater"),
  occupationStatus: z.enum(OCCUPATION_STATUS_OPTIONS as [string, ...string[]]),
  status: z.enum(STATUS_OPTIONS as [string, ...string[]]),
  listingStatus: z.enum(LISTING_STATUS_OPTIONS as [string, ...string[]]),
  roiPercentage: z.number().optional(),
  serviceCharges: z.number().optional()
});

export function AdminPropertyForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAdminAction } = useAdminActions();
  const { toast } = useToast();
  const [showServiceCharges, setShowServiceCharges] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    setShowServiceCharges(watchCountry === "UAE");
  }, [watchCountry]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [investorsData, propertyTypesData] = await Promise.all([
          fetchInvestors(),
          fetchPropertyTypes()
        ]);
        setInvestors(investorsData);
        setPropertyTypes(propertyTypesData);
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    await handleAdminAction(
      async () => {
        const result = await addPropertyForUser(data.userId, {
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
        
        if (result && result.success) {
          form.reset();
        }
        
        return result;
      },
      t("propertyAddedSuccessfully"),
      t("errorAddingProperty")
    );
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 rounded-lg border">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-gold" />
        </div>
      </div>
    );
  }

  const withTooltip = (label: string, tooltip: string) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t("addPropertyForUser")}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {withTooltip(t("investor"), t("tooltip.investor"))}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectInvestor")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {investors.map((investor) => (
                      <SelectItem key={investor.id} value={investor.id}>
                        {investor.first_name} {investor.last_name} ({investor.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {withTooltip(t("propertyName"), t("tooltip.propertyName"))}
                </FormLabel>
                <FormControl>
                  <Input placeholder={t("enterPropertyName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("address"), t("tooltip.address"))}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterAddress")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("city"), t("tooltip.city"))}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterCity")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("country"), t("tooltip.country"))}
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
                      {AVAILABLE_COUNTRIES.map((country) => (
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
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("zone"), t("tooltip.zone"))}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterZone")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {withTooltip(t("propertyType"), t("tooltip.propertyType"))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("price"), t("tooltip.price"))}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("currency"), t("tooltip.currency"))}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCurrency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="sizeSqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("sizeSqm"), t("tooltip.sizeSqm"))}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>{t("sizeInSquareMeters")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("bedrooms"), t("tooltip.bedrooms"))}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("bathrooms"), t("tooltip.bathrooms"))}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="occupationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("occupationStatus"), t("tooltip.occupationStatus"))}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectOccupationStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OCCUPATION_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("status"), t("tooltip.status"))}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("listingStatus"), t("tooltip.listingStatus"))}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectListingStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LISTING_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="roiPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {withTooltip(t("roiPercentage"), t("tooltip.roiPercentage"))}
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
              control={form.control}
              name="serviceCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {withTooltip(t("serviceCharges"), t("tooltip.serviceCharges"))}
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

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                <Building2 className="mr-2 h-4 w-4" />
                {t("addProperty")}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addPropertyForUser, fetchInvestors, fetchPropertyTypes, useAdminActions } from "@/services/admin/adminService";
import { useState, useEffect } from "react";
import { Building2, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Investor } from "@/types/admin";
import { PropertyType } from "@/types/property";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  userId: z.string().min(1, "Investor is required"),
  name: z.string().min(2, "Property name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.enum(["Italy", "UAE", "Thailand", "Switzerland"]),
  zone: z.string().min(1, "Zone is required"),
  typeId: z.string().min(1, "Property type is required"),
  price: z.number().min(1, "Price is required"),
  currency: z.enum(["EUR", "USD", "AED"]),
  sizeSqm: z.number().min(1, "Size is required"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or greater"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or greater"),
  occupationStatus: z.enum(["rented", "occupied", "vacant", "partially_occupied"]),
  status: z.enum(["active", "pending", "residential"]),
  saleStatus: z.enum(["for_sale", "not_for_sale", "negotiable"]),
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
      saleStatus: "not_for_sale",
      roiPercentage: undefined,
      serviceCharges: undefined
    }
  });

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
        await addPropertyForUser(data.userId, data);
        form.reset();
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
                  {withTooltip(t("investor"), "Select the user to whom this property will be assigned.")}
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
          {/* Continue wrapping other fields in withTooltip() similarly */}
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

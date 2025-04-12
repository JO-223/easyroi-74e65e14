
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addPropertyForSale, fetchPropertyTypes, useAdminActions } from "@/services/admin";
import { useState, useEffect } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertyType } from "@/types/property";

const formSchema = z.object({
  name: z.string().min(2, "Property name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zone: z.string().min(1, "Zone is required"),
  typeId: z.string().min(1, "Property type is required"),
  price: z.number().min(1, "Price is required"),
  sizeSqm: z.number().min(1, "Size is required"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or greater"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or greater"),
  minInvestment: z.number().optional(),
  roiPercentage: z.number().optional(),
  investorLevel: z.string().optional(),
});

export function AdminForSalePropertyForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAdminAction } = useAdminActions();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      country: "",
      zone: "",
      typeId: "",
      price: 0,
      sizeSqm: 0,
      bedrooms: 0,
      bathrooms: 0,
      minInvestment: undefined,
      roiPercentage: undefined,
      investorLevel: "bronze",
    },
  });

  // Fetch property types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const propertyTypesData = await fetchPropertyTypes();
        setPropertyTypes(propertyTypesData);
      } catch (error) {
        console.error("Error fetching property types:", error);
        toast({
          title: t('errorLoadingData'),
          description: t('errorFetchingPropertyTypes'),
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
        // Return the result of the RPC call
        return await addPropertyForSale({
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
          minInvestment: data.minInvestment,
          roiPercentage: data.roiPercentage,
          investorLevel: data.investorLevel,
        });
        // Form reset moved to the success callback of handleAdminAction
      },
      t('propertyForSaleAddedSuccessfully'),
      t('errorAddingPropertyForSale')
    );
    
    form.reset();
    setIsSubmitting(false);
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 rounded-lg border">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t('addPropertyForSale')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('propertyName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterPropertyName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('propertyType')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectPropertyType')} />
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
          </div>

          {/* Location fields */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('enterAddress')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('zone')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterZone')} {...field} />
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
                  <FormLabel>{t('city')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterCity')} {...field} />
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
                  <FormLabel>{t('country')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterCountry')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Property details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('price')} (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sizeSqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sizeSqm')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bedrooms')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
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
                  <FormLabel>{t('bathrooms')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Investment details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="minInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('minInvestment')} (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roiPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roiPercentage')} (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="investorLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('investorLevel')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="starter">{t('starterInvestor')}</SelectItem>
                      <SelectItem value="bronze">{t('bronzeInvestor')}</SelectItem>
                      <SelectItem value="silver">{t('silverInvestor')}</SelectItem>
                      <SelectItem value="gold">{t('goldInvestor')}</SelectItem>
                      <SelectItem value="ruby">{t('rubyInvestor')}</SelectItem>
                      <SelectItem value="emerald">{t('emeraldInvestor')}</SelectItem>
                      <SelectItem value="platinum">{t('platinumInvestor')}</SelectItem>
                      <SelectItem value="diamond">{t('diamondInvestor')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('minimumLevelRequired')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <Building2 className="mr-2 h-4 w-4" />
                {t('addPropertyForSale')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

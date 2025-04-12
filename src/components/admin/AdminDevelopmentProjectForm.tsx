
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addNewDevelopmentProject } from "@/services/admin/projectService";
import { useAdminActions } from "@/services/admin/hooks/useAdminActions";
import { useState } from "react";
import { Calendar, Construction, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Description is required (min 10 characters)"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zone: z.string().min(1, "Zone is required"),
  expectedCompletion: z.string().min(1, "Expected completion date is required"),
  constructionStage: z.string().min(1, "Construction stage is required"),
  progressPercentage: z.number().min(0).max(100, "Must be between 0 and 100"),
  totalUnits: z.number().min(1, "Total units must be at least 1"),
  availableUnits: z.number().min(0, "Available units must be at least 0"),
  minInvestment: z.number().optional(),
  expectedRoi: z.number().optional(),
  investorLevel: z.string().default("bronze"),
});

export function AdminDevelopmentProjectForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAdminAction } = useAdminActions();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      zone: "",
      expectedCompletion: new Date().toISOString().split('T')[0],
      constructionStage: "planning",
      progressPercentage: 0,
      totalUnits: 1,
      availableUnits: 1,
      minInvestment: undefined,
      expectedRoi: undefined,
      investorLevel: "bronze",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    await handleAdminAction(
      async () => {
        // Return the result of the RPC call
        return await addNewDevelopmentProject({
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          country: data.country,
          zone: data.zone,
          expectedCompletion: data.expectedCompletion,
          constructionStage: data.constructionStage,
          progressPercentage: data.progressPercentage,
          totalUnits: data.totalUnits,
          availableUnits: data.availableUnits,
          minInvestment: data.minInvestment,
          expectedRoi: data.expectedRoi,
          investorLevel: data.investorLevel,
        });
        // Form reset moved to the success callback of handleAdminAction
      },
      t('developmentProjectAddedSuccessfully'),
      t('errorAddingDevelopmentProject')
    );
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t('addDevelopmentProject')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('projectName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('enterProjectName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t('enterProjectDescription')} 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Construction details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="expectedCompletion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expectedCompletion')}</FormLabel>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="constructionStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('constructionStage')}</FormLabel>
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
                      <SelectItem value="planning">{t('planning')}</SelectItem>
                      <SelectItem value="foundation">{t('foundation')}</SelectItem>
                      <SelectItem value="framing">{t('framing')}</SelectItem>
                      <SelectItem value="interior">{t('interior')}</SelectItem>
                      <SelectItem value="finishing">{t('finishing')}</SelectItem>
                      <SelectItem value="completed">{t('completed')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Progress details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="progressPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('progressPercentage')} (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      max={100}
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
              name="totalUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('totalUnits')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="1" 
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
              name="availableUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('availableUnits')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
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
              name="expectedRoi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expectedRoi')} (%)</FormLabel>
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
                <Construction className="mr-2 h-4 w-4" />
                {t('addDevelopmentProject')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { savePropertySearch, updateSavedSearch } from "@/services/savedSearchService";
import { alertFrequencyOptions, SavedPropertySearch } from "@/types/savedSearch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Import field-specific components as needed
import MultiSelectField from "./MultiSelectField"; // You'll need to create this component

interface SavedSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingSearch: SavedPropertySearch | null;
  onSuccess: () => void;
}

const formSchema = z.object({
  search_name: z.string().min(1, "Search name is required"),
  min_bedrooms: z.number().optional(),
  max_bedrooms: z.number().optional(),
  min_bathrooms: z.number().optional(),
  max_bathrooms: z.number().optional(),
  min_roi: z.number().optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  property_types: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  is_alert: z.boolean().default(false),
  alert_frequency: z.string().optional()
});

export default function SavedSearchDialog({
  isOpen,
  onClose,
  existingSearch,
  onSuccess
}: SavedSearchDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // You would need to fetch property types and locations from your database
  const { data: propertyTypes = [] } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      // Replace with actual API call to fetch property types
      return [
        { id: 'apartment', name: 'Apartment' },
        { id: 'house', name: 'House' },
        { id: 'villa', name: 'Villa' },
        { id: 'commercial', name: 'Commercial' }
      ];
    }
  });
  
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      // Replace with actual API call to fetch locations
      return [
        { id: 'dubai', name: 'Dubai' },
        { id: 'milan', name: 'Milan' },
        { id: 'london', name: 'London' },
        { id: 'paris', name: 'Paris' }
      ];
    }
  });
  
  // Parse price range if it exists
  let initialPriceMin, initialPriceMax;
  if (existingSearch?.price_range) {
    const range = existingSearch.price_range.replace(/[\[\]\(\)]/g, '').split(',');
    if (range.length === 2) {
      initialPriceMin = parseFloat(range[0]);
      initialPriceMax = parseFloat(range[1]);
    }
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search_name: existingSearch?.search_name || "",
      min_bedrooms: existingSearch?.min_bedrooms || undefined,
      max_bedrooms: existingSearch?.max_bedrooms || undefined,
      min_bathrooms: existingSearch?.min_bathrooms || undefined,
      max_bathrooms: existingSearch?.max_bathrooms || undefined,
      min_roi: existingSearch?.min_roi || undefined,
      price_min: initialPriceMin,
      price_max: initialPriceMax,
      property_types: existingSearch?.property_types || [],
      locations: existingSearch?.locations || [],
      is_alert: existingSearch?.is_alert || false,
      alert_frequency: existingSearch?.alert_frequency || 'weekly'
    }
  });
  
  const isAlertEnabled = form.watch('is_alert');
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      if (existingSearch) {
        await updateSavedSearch(existingSearch.id, values);
        toast({
          title: t('savedSearchUpdated'),
          description: t('savedSearchUpdatedSuccessfully'),
        });
      } else {
        await savePropertySearch(values, user.id);
        toast({
          title: t('savedSearchCreated'),
          description: t('savedSearchCreatedSuccessfully'),
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: t('errorSavingSearch'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existingSearch ? t('editSavedSearch') : t('createSavedSearch')}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="search_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('searchName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterSearchName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minBedrooms')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maxBedrooms')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minBathrooms')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maxBathrooms')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_roi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minROI')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        step={0.1}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minPrice')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maxPrice')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="is_alert"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t('receiveAlerts')}</FormLabel>
                    <FormDescription>
                      {t('receiveAlertsDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isAlertEnabled && (
              <FormField
                control={form.control}
                name="alert_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('alertFrequency')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectAlertFrequency')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {alertFrequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving 
                  ? (existingSearch ? t('updating') : t('saving'))
                  : (existingSearch ? t('update') : t('save'))
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

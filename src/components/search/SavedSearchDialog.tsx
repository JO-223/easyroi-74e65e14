
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { savePropertySearch } from "@/services/savedSearchService";
import { PropertyFilter } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

interface SavedSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: PropertyFilter;
  onSuccess: () => void;
}

const formSchema = z.object({
  searchName: z.string().min(1, "Search name is required"),
  isAlert: z.boolean().default(false),
  alertFrequency: z.string().optional(),
});

export default function SavedSearchDialog({
  isOpen,
  onClose,
  currentFilter,
  onSuccess,
}: SavedSearchDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchName: "",
      isAlert: false,
      alertFrequency: "weekly",
    },
  });
  
  const watchIsAlert = form.watch("isAlert");
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      await savePropertySearch(
        values.searchName, 
        currentFilter, 
        values.isAlert, 
        values.isAlert ? values.alertFrequency : undefined
      );
      
      toast({
        title: t("success"),
        description: t("searchSavedSuccessfully"),
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving search:", error);
      toast({
        title: t("error"),
        description: t("errorSavingSearch"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("saveSearch")}</DialogTitle>
          <DialogDescription>
            {t("saveSearchDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="searchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("searchName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterSearchName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isAlert"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>{t("createAlert")}</FormLabel>
                    <FormDescription>
                      {t("receiveNotificationsForNewMatches")}
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
            
            {watchIsAlert && (
              <FormField
                control={form.control}
                name="alertFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("alertFrequency")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectFrequency")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">{t("daily")}</SelectItem>
                        <SelectItem value="weekly">{t("weekly")}</SelectItem>
                        <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSaving}
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("save")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

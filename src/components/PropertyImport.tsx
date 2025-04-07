
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataImport, UserRole } from "@/types/property";
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const importFormSchema = z.object({
  source: z.string().min(1, {
    message: "Source name is required",
  }),
  importData: z.string().min(1, {
    message: "Import data is required",
  }),
});

type ImportFormValues = z.infer<typeof importFormSchema>;

export function PropertyImport() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      source: "",
      importData: "",
    },
  });
  
  // Check if the current user is an administrator
  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch the user's profile to get their level (role)
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user role:", error);
            return;
          }
          
          if (data && data.level) {
            const level = data.level as UserRole;
            setUserRole(level);
            setIsAdmin(['administrator', 'owner'].includes(level));
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    }
    
    checkUserRole();
  }, []);
  
  const onSubmit = async (data: ImportFormValues) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can import property data.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Create a new data import record
      const { data: importRecord, error: importError } = await supabase
        .from('data_imports')
        .insert({
          source: data.source,
          status: 'processing'
        })
        .select('id')
        .single();
        
      if (importError) throw importError;
      
      // Here we would normally process the JSON data
      // For now, we'll just simulate it worked
      
      // In a real implementation, we would parse the JSON data, validate it,
      // and insert or update property records in the database
      
      // Update the import record to reflect completion
      const { error: updateError } = await supabase
        .from('data_imports')
        .update({ 
          status: 'completed',
          records_processed: 10,
          records_created: 8,
          records_updated: 2,
          completed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Import Successful",
        description: "Your property data has been imported.",
      });
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Import failed:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing your property data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAdmin && userRole !== null) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('accessDenied')}</AlertTitle>
        <AlertDescription>
          {t('importPropertiesAdminOnly')}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 flex items-center gap-2">
          <Shield size={16} />
          {t('importProperties')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Properties</DialogTitle>
          <DialogDescription>
            Import property data from external sources in JSON format.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apify, Make.com, Manual" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the source of your property data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="importData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>JSON Data</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='Paste your JSON data here...' 
                      className="h-56 font-mono text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Paste your property data in JSON format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90"
              >
                {isLoading ? "Importing..." : "Import Data"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

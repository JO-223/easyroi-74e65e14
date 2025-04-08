
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const importFormSchema = z.object({
  source: z.string().min(1, {
    message: "Source name is required",
  }),
  importData: z.string().min(1, {
    message: "Import data is required",
  }),
});

type ImportFormValues = z.infer<typeof importFormSchema>;

interface ImportFormProps {
  onSuccess: () => void;
}

export function ImportForm({ onSuccess }: ImportFormProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  
  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      source: "",
      importData: "",
    },
  });
  
  const onSubmit = async (data: ImportFormValues) => {
    setIsLoading(true);
    setProgress("Validating JSON data...");
    
    try {
      // Validate the JSON structure
      let propertyData: any[];
      try {
        const parsedData = JSON.parse(data.importData);
        propertyData = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        if (propertyData.length === 0) {
          throw new Error("No property data found in JSON");
        }
        
        // Basic validation of each property
        for (const property of propertyData) {
          if (!property.name || !property.address || !property.price) {
            throw new Error("Each property must have at least a name, address, and price");
          }
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        toast({
          title: "Invalid JSON format",
          description: "Please check your JSON data format and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      setProgress(`Processing ${propertyData.length} properties...`);
      
      // Create a new data import record
      const { data: importRecord, error: importError } = await supabase
        .from('data_imports')
        .insert({
          source: data.source,
          status: 'processing'
        })
        .select('id')
        .single();
        
      if (importError) {
        console.error("Error creating import record:", importError);
        throw new Error("Failed to create import record");
      }
      
      // Call the Edge Function for processing large datasets
      setProgress("Sending data to import service...");
      
      const { data: importResult, error: functionError } = await supabase.functions.invoke(
        'import-properties',
        {
          body: {
            source: data.source,
            data: propertyData
          }
        }
      );
      
      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error("Import process failed");
      }
      
      // Show success message with details
      toast({
        title: "Import Successful",
        description: `Processed ${importResult.processed} properties: ${importResult.created} created, ${importResult.updated} updated, ${importResult.failed} failed.`,
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Import failed:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "There was an error importing your property data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };
  
  return (
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
                Paste your property data in JSON format. The system can handle hundreds of properties in a single import.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {progress && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress}
          </div>
        )}
        
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
  );
}

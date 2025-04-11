
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addNewInvestor } from "@/services/admin/adminService";
import { useAdminActions } from "@/services/admin/adminService";
import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { NewInvestorData } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  initialInvestment: z.number().optional(),
});

export function AdminInvestorForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAdminAction } = useAdminActions();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      initialInvestment: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Passo 1: Crea l'utente tramite edge function
      const createUserResponse = await supabase.functions.invoke('create-owner-user', {
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName
        }
      });

      if (!createUserResponse.data?.success) {
        console.error("Error creating user:", createUserResponse.error);
        throw new Error(createUserResponse.error?.message || 
                       createUserResponse.data?.message || 
                       "Failed to create user");
      }

      console.log("User created successfully:", createUserResponse.data);
      const userId = createUserResponse.data.user.id;
      
      // Passo 2: Completa il profilo tramite RPC
      const investorData: NewInvestorData = {
        user_id: userId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        initialInvestment: data.initialInvestment
      };
      
      const rpcResult = await addNewInvestor(investorData);
      console.log("RPC result:", rpcResult);
      
      if (!rpcResult?.[0]?.success) {
        throw new Error(rpcResult?.[0]?.message || "Error initializing investor profile");
      }

      toast({
        title: t('success'),
        description: rpcResult[0].message || t('investorAddedSuccessfully'),
        variant: "default"
      });

      form.reset();
    } catch (error) {
      console.error("Error in investor creation process:", error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('errorAddingInvestor'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t('addNewInvestor')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('firstName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterFirstName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('lastName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterLastName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t('enterPassword')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initialInvestment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('initialInvestment')} (€)</FormLabel>
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
                <UserPlus className="mr-2 h-4 w-4" />
                {t('addInvestor')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

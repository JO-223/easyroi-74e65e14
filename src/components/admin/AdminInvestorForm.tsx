
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addNewInvestor } from "@/services/admin/adminService";
import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { NewInvestorData } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  initialInvestment: z.number().optional()
});

export function AdminInvestorForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("Starting investor creation process...");
      // Step 1: create user
      console.log("Invoking create-owner-user edge function...");
      const response = await supabase.functions.invoke("create-owner-user", {
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName
        }
      });

      console.log("Edge function response:", response);

      const user = response.data?.user;
      const success = response.data?.success;

      if (!success || !user) {
        const rawMessage = response.data?.message || response.error?.message || "";
        const msg = rawMessage.toLowerCase();

        if (msg.includes("email") && msg.includes("already")) {
          toast({
            title: t("error"),
            description: t("emailAlreadyExists") || "Email is already registered.",
            variant: "destructive",
          });
        } else {
          toast({
            title: t("error"),
            description: rawMessage || t("edgeFunctionFailure"),
            variant: "destructive",
          });
        }

        return;
      }

      // Step 2: complete investor profile
      console.log("User created successfully, now creating investor profile...");
      const investorData: NewInvestorData = {
        user_id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        initialInvestment: data.initialInvestment,
      };

      const rpcResult = await addNewInvestor(investorData);

      console.log("RPC result:", rpcResult);
      if (!rpcResult?.[0]?.success) {
        toast({
          title: t("error"),
          description: rpcResult?.[0]?.message || t("errorAddingInvestor"),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("success"),
        description: rpcResult?.[0]?.message || t("investorAddedSuccessfully"),
        variant: "default",
      });

      form.reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: t("error"),
        description: t("errorAddingInvestor"),
        variant: "destructive",
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
            <FormField name="firstName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>{t('firstName')}</FormLabel>
                <FormControl><Input {...field} placeholder="Marco" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="lastName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lastName')}</FormLabel>
                <FormControl><Input {...field} placeholder="Gallina Grande" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl><Input {...field} type="email" placeholder="email@example.com" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl><Input {...field} type="password" placeholder={t('enterPassword')} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="initialInvestment" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{t('initialInvestment')} (€)</FormLabel>
              <FormControl>
                <Input type="number" {...field}
                  placeholder="0"
                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>{t('optionalField')}</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('processing')}</>
            ) : (
              <><UserPlus className="mr-2 h-4 w-4" />{t('addInvestor')}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

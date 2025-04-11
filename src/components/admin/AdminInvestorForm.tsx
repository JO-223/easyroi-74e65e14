import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  initialInvestment: z.coerce.number().optional()
});

export function AdminInvestorForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", initialInvestment: undefined },
  });

  const onSubmit = async (values) => {
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke("create-owner-user", {
        body: values
      });

      if (edgeError || !edgeData?.success) {
        toast({
          title: t("error"),
          description: edgeData?.message || edgeError?.message || t("errorCreatingUser"),
          variant: "destructive"
        });
        return;
      }

      const userId = edgeData.user.id;
      const { data: rpcData, error: rpcError } = await supabase.rpc("add_new_investor", {
        p_user_id: userId,
        p_first_name: values.firstName,
        p_last_name: values.lastName,
        p_email: values.email,
        p_initial_investment: values.initialInvestment
      });

      if (rpcError || !rpcData?.[0]?.success) {
        toast({
          title: t("error"),
          description: rpcData?.[0]?.message || rpcError?.message || t("errorAddingInvestor"),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t("success"),
        description: rpcData[0].message || t("investorAddedSuccessfully"),
        variant: "default"
      });

      form.reset();
    } catch (err) {
      toast({
        title: t("error"),
        description: err?.message || t("unexpectedError"),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t("addNewInvestor")}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField name="firstName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>{t("firstName")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="lastName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>{t("lastName")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>{t("email")}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>{t("password")}</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="initialInvestment" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>{t("initialInvestment")} (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" className="w-full md:w-auto">
            {form.formState.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("processing")}</>) : (<><UserPlus className="mr-2 h-4 w-4" />{t("addInvestor")}</>)}
          </Button>
        </form>
      </Form>
    </div>
  );
}
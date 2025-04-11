import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  initialInvestment: z
    .string()
    .transform((val) => val.trim() === "" ? undefined : Number(val))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Initial investment must be a number",
    })
});

export function AdminInvestorForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      initialInvestment: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { data: rpcResponse, error } = await supabase.rpc("add_new_investor", {
        p_email: data.email,
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_password: data.password,
        p_initial_investment: data.initialInvestment
      });

      console.log("RPC Response:", rpcResponse, error);

      if (error || !rpcResponse) {
        toast({
          title: t("error"),
          description: error?.message || "Unknown error",
          variant: "destructive"
        });
        return;
      }

      if (!rpcResponse.success) {
        toast({
          title: t("error"),
          description: rpcResponse.message || t("errorAddingInvestor"),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t("success"),
        description: rpcResponse.message || t("investorAddedSuccessfully"),
        variant: "default"
      });
      form.reset();
    } catch (e: any) {
      console.error("Submit error:", e);
      toast({
        title: t("error"),
        description: e.message || t("errorAddingInvestor"),
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
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="lastName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="initialInvestment" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInvestment")} (€)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormDescription>{t("optionalField")}</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full md:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            {t("addInvestor")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
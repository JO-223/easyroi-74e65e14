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
import { addNewInvestor } from "@/services/admin/adminService";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { NewInvestorData } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 2 characters"),
  lastName: z.string().min(3, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  initialInvestment: z.number().optional(),
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
      // Step 1: Create user via Edge Function
      const createUserResponse = await supabase.functions.invoke("create-owner-user", {
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      const edgeError = createUserResponse.error;
      const edgeData = createUserResponse.data;

      if (!edgeData?.success || edgeError) {
        const msg = edgeData?.message || edgeError?.message;
        if (msg?.toLowerCase().includes("already registered") || msg?.toLowerCase().includes("email")) {
          toast({ title: t("error"), description: t("emailAlreadyExists"), variant: "destructive" });
        } else {
          toast({ title: t("error"), description: msg || t("edgeFunctionFailure"), variant: "destructive" });
        }
        setIsSubmitting(false);
        return;
      }

      const userId = edgeData.user.id;

      // Step 2: Add investor profile via RPC
      const investorData: NewInvestorData = {
        user_id: userId,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        initialInvestment: data.initialInvestment,
      };

      const rpcResult = await addNewInvestor(investorData);

      if (!rpcResult?.success) {
        toast({
          title: t("error"),
          description: rpcResult.message || t("errorAddingInvestor"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: t("success"),
        description: rpcResult.message || t("investorAddedSuccessfully"),
        variant: "default",
      });

      form.reset();
    } catch (err) {
      toast({
        title: t("error"),
        description: err instanceof Error ? err.message : t("errorAddingInvestor"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t("addNewInvestor")}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("firstName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterFirstName")} {...field} />
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
                  <FormLabel>{t("lastName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterLastName")} {...field} />
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
                <FormLabel>{t("email")}</FormLabel>
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
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t("enterPassword")} {...field} />
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
                <FormLabel>{t("initialInvestment")} (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>{t("optionalField")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {t("addInvestor")}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
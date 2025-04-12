
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { addNewInvestor, createOwnerUser } from "@/services/admin/investorService";
import { parseSupabaseError, validateInvestorData } from "@/services/admin/utils/investorUtils";
import { investorFormSchema, InvestorFormData } from "@/types/investorForm";

export const useInvestorForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: InvestorFormData) => {
    setIsSubmitting(true);

    // Extra validation beyond Zod
    const validationResult = validateInvestorData(data.firstName, data.lastName, data.email);
    if (validationResult !== true) {
      toast({
        title: t("validation_error"),
        description: validationResult,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // STEP 1: Call edge function to create user
      const createdUser = await createOwnerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
      const userId = createdUser.id;

      // STEP 2: Call RPC to create/update profile and settings
      const investorPayload = {
        user_id: userId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email
      };
      const rpcResult = await addNewInvestor(investorPayload);

      toast({
        title: t("success"),
        description: rpcResult.message || t("investorAddedSuccessfully"),
        variant: "default"
      });
      form.reset();
    } catch (error) {
      console.error("Error during investor creation", error);
      const errorMessage = error instanceof Error ? parseSupabaseError(error) : t("errorAddingInvestor");
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
};

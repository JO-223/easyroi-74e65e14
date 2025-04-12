
// AdminInvestorForm.tsx - Refactored
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useInvestorForm } from "@/hooks/useInvestorForm";
import { InvestorFormFields } from "@/components/admin/investor/InvestorFormFields";

export function AdminInvestorForm() {
  const { t } = useLanguage();
  const { form, isSubmitting, onSubmit } = useInvestorForm();

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t("addNewInvestor")}</h3>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <InvestorFormFields form={form} />

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

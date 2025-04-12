
import React, { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AdminDevelopmentProjectFormValues } from "./types";

interface ProjectFormLayoutProps {
  form: UseFormReturn<AdminDevelopmentProjectFormValues>;
  onSubmit: (values: AdminDevelopmentProjectFormValues) => Promise<any>;
  isLoading?: boolean;
  children: ReactNode;
}

export function ProjectFormLayout({ 
  form, 
  onSubmit, 
  isLoading = false, 
  children 
}: ProjectFormLayoutProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 rounded-lg border">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t('addDevelopmentProject')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {children}
        </form>
      </Form>
    </div>
  );
}

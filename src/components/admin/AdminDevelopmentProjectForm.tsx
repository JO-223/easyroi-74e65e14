
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { addNewDevelopmentProject } from "@/services/admin/projectService";
import { useAdminActions } from "@/services/admin/hooks/useAdminActions";
import { RpcResponse } from "@/services/admin/utils";

// Import the new components
import { ProjectFormLayout } from "./development/ProjectFormLayout";
import { ProjectBasicInfoFields } from "./development/ProjectBasicInfoFields";
import { ProjectLocationFields } from "./development/ProjectLocationFields";
import { ProjectConstructionFields } from "./development/ProjectConstructionFields";
import { ProjectProgressFields } from "./development/ProjectProgressFields";
import { ProjectInvestmentFields } from "./development/ProjectInvestmentFields";
import { ProjectImageFields } from "./development/ProjectImageFields";
import { ProjectSubmitButton } from "./development/ProjectSubmitButton";
import { developmentProjectFormSchema, AdminDevelopmentProjectFormValues } from "./development/types";

export function AdminDevelopmentProjectForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAdminAction } = useAdminActions();
  
  const form = useForm<AdminDevelopmentProjectFormValues>({
    resolver: zodResolver(developmentProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      zone: "",
      expectedCompletion: new Date().toISOString().split('T')[0],
      constructionStage: "planning",
      progressPercentage: 0,
      totalUnits: 1,
      availableUnits: 1,
      minInvestment: undefined,
      expectedRoi: undefined,
      investorLevel: "bronze",
      imageUrl: undefined,
    },
  });

  const onSubmit = async (data: AdminDevelopmentProjectFormValues): Promise<RpcResponse> => {
    setIsSubmitting(true);
    
    return await handleAdminAction(
      async () => {
        await addNewDevelopmentProject({
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          country: data.country,
          zone: data.zone,
          expectedCompletion: data.expectedCompletion,
          constructionStage: data.constructionStage,
          progressPercentage: data.progressPercentage,
          totalUnits: data.totalUnits,
          availableUnits: data.availableUnits,
          minInvestment: data.minInvestment,
          expectedRoi: data.expectedRoi,
          investorLevel: data.investorLevel,
          imageUrl: data.imageUrl,
        });
        return { success: true, message: t('developmentProjectAddedSuccessfully') };
      },
      t('developmentProjectAddedSuccessfully'),
      t('errorAddingDevelopmentProject')
    );
  };

  return (
    <ProjectFormLayout form={form} onSubmit={onSubmit}>
      <ProjectBasicInfoFields form={form} />
      <ProjectLocationFields form={form} />
      <ProjectConstructionFields form={form} />
      <ProjectProgressFields form={form} />
      <ProjectInvestmentFields form={form} />
      <ProjectImageFields form={form} />
      <ProjectSubmitButton isSubmitting={isSubmitting} />
    </ProjectFormLayout>
  );
}

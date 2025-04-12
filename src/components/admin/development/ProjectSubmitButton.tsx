
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Construction, Loader2 } from "lucide-react";

interface ProjectSubmitButtonProps {
  isSubmitting: boolean;
}

export function ProjectSubmitButton({ isSubmitting }: ProjectSubmitButtonProps) {
  const { t } = useLanguage();

  return (
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
          <Construction className="mr-2 h-4 w-4" />
          {t('addDevelopmentProject')}
        </>
      )}
    </Button>
  );
}

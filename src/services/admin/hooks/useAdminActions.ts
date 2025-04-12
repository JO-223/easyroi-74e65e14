
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Custom hook for handling admin actions with toast notifications
export const useAdminActions = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleAdminAction = useCallback(async (
    action: () => Promise<void>, 
    successMessage: string, 
    errorMessage: string
  ) => {
    try {
      await action();
      toast({
        title: t('success'),
        description: successMessage,
        variant: "default"
      });
      return true;
    } catch (error) {
      console.error("Admin action error:", error);
      toast({
        title: t('error'),
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [toast, t]);
  
  return { handleAdminAction };
};

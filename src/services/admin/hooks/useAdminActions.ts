
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RpcResponse } from "../utils";

export const useAdminActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAdminAction = useCallback(
    async <T extends RpcResponse>(
      action: () => Promise<T>,
      successMessage?: string,
      errorMessage?: string
    ): Promise<T | null> => {
      setIsLoading(true);

      try {
        const result = await action();
        
        // Log the complete result for debugging
        console.log("Admin action result:", result);

        // Check if the result has a success flag
        if (result && 'success' in result) {
          if (result.success === true) {
            // Only show success toast if operation was actually successful
            toast({
              title: t("success"),
              description: result.message || successMessage || t("operationSuccessful"),
              variant: "default",
            });
            return result;
          } else {
            // Show error toast if operation failed (even though no exception was thrown)
            toast({
              title: t("error"),
              description: result.message || errorMessage || t("operationFailed"),
              variant: "destructive",
            });
            console.error("Operation failed:", result.message);
            return null;
          }
        } else {
          // Regular non-RPC result
          toast({
            title: t("success"),
            description: successMessage || t("operationSuccessful"),
            variant: "default",
          });
          return result;
        }
      } catch (error) {
        console.error("Admin action error:", error);
        
        // Format the error message
        const errorMsg = error instanceof Error 
          ? error.message 
          : errorMessage || t("operationFailed");
          
        toast({
          title: t("error"),
          description: errorMsg,
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, t]
  );

  return { handleAdminAction, isLoading };
};

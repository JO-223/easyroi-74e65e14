
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RpcResponse } from "../utils";

export const useAdminActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAdminAction = useCallback(
    async <T extends any>(
      action: () => Promise<T | RpcResponse>,
      successMessage?: string,
      errorMessage?: string
    ): Promise<T | null> => {
      setIsLoading(true);

      try {
        const result = await action();

        // Check if the result is an RPC response with a success flag
        if (result && typeof result === 'object' && 'success' in result) {
          const rpcResponse = result as RpcResponse;
          
          if (rpcResponse.success === true) {
            // Only show success toast if operation was actually successful
            toast({
              title: t("success"),
              description: rpcResponse.message || successMessage || t("operationSuccessful"),
              variant: "default",
            });
            return result;
          } else {
            // Show error toast if operation failed (even though no exception was thrown)
            toast({
              title: t("error"),
              description: rpcResponse.message || errorMessage || t("operationFailed"),
              variant: "destructive",
            });
            console.error("Operation failed:", rpcResponse.message);
            return null;
          }
        } else {
          // Regular non-RPC result
          toast({
            title: t("success"),
            description: successMessage || t("operationSuccessful"),
            variant: "default",
          });
          return result as T;
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

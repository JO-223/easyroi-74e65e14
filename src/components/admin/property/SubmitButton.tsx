
import { Button } from "@/components/ui/button";
import { Loader2, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("saving")}
        </>
      ) : (
        <>
          <Home className="mr-2 h-4 w-4" />
          {t("addProperty")}
        </>
      )}
    </Button>
  );
}

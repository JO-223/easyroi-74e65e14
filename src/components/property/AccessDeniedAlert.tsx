
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function AccessDeniedAlert() {
  const t = useTranslation();
  
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t('accessDenied')}</AlertTitle>
      <AlertDescription>
        {t('importPropertiesAdminOnly')}
      </AlertDescription>
    </Alert>
  );
}

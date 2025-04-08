
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminRole } from "@/hooks/use-admin-role";
import { AccessDeniedAlert } from "@/components/property/AccessDeniedAlert";
import { ImportForm } from "@/components/property/ImportForm";

export function PropertyImport() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, userRole, isLoading } = useAdminRole();
  
  // If still loading role, show nothing to prevent flashing UI
  if (isLoading) {
    return null;
  }
  
  if (!isAdmin && userRole !== null) {
    return <AccessDeniedAlert />;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 flex items-center gap-2">
          <Shield size={16} />
          {t('importProperties')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Properties</DialogTitle>
          <DialogDescription>
            Import property data from external sources in JSON format.
          </DialogDescription>
        </DialogHeader>
        
        <ImportForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

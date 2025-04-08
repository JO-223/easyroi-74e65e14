
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
import { Construction } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminRole } from "@/hooks/use-admin-role";
import { AccessDeniedAlert } from "@/components/property/AccessDeniedAlert";

export function DevelopmentProjectImport() {
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
          <Construction size={16} />
          {t('importProjects')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Development Projects</DialogTitle>
          <DialogDescription>
            Import development project data from external sources in JSON format.
          </DialogDescription>
        </DialogHeader>
        
        {/* We can reuse the ImportForm component with small modifications later */}
        <div className="py-4">
          <p>Development project import functionality will be implemented soon.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

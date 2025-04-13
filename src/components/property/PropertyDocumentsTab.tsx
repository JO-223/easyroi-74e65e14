
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DocumentsList from "@/components/documents/DocumentsList";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PropertyDocumentsTabProps {
  propertyId: string;
  ownerId?: string;
}

export default function PropertyDocumentsTab({ 
  propertyId,
  ownerId 
}: PropertyDocumentsTabProps) {
  const { t } = useLanguage();
  const { user, isAdmin, isOwner } = useAuth();
  
  // Determine if user can modify documents
  const isPropertyOwner = user?.id === ownerId;
  const canModifyDocuments = isPropertyOwner || isAdmin || isOwner;
  
  // Determine if user can view documents
  const canViewDocuments = canModifyDocuments;
  
  if (!canViewDocuments) {
    return (
      <Alert variant="default" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('accessRestricted')}</AlertTitle>
        <AlertDescription>
          {t('documentsAccessRestricted')}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="my-4">
      <DocumentsList
        propertyId={propertyId}
        canUpload={canModifyDocuments}
        canDelete={canModifyDocuments}
      />
    </div>
  );
}

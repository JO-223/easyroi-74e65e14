import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchPropertyDocuments } from "@/services/propertyDocumentService";
import { PropertyDocument } from "@/types/propertyDocument";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { File, FileText, Lock, Download, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { getDocumentAccessUrl, deletePropertyDocument } from "@/services/propertyDocumentService";
import { formatFileSize } from "@/utils/formatFileSize";
import { downloadFile } from "@/utils/documentHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import DocumentUploadDialog from "./DocumentUploadDialog";

interface DocumentsListProps {
  propertyId: string;
  canUpload?: boolean;
  canDelete?: boolean;
}

export default function DocumentsList({ 
  propertyId, 
  canUpload = true, 
  canDelete = true 
}: DocumentsListProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const { 
    data: documents = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['propertyDocuments', propertyId],
    queryFn: () => fetchPropertyDocuments(propertyId),
    enabled: !!propertyId
  });
  
  const handleDownload = async (document: PropertyDocument) => {
    try {
      const url = await getDocumentAccessUrl(document.id);
      downloadFile(url, document.document_name);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: t('errorDownloadingDocument'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (documentId: string) => {
    if (!confirm(t('confirmDocumentDelete'))) return;
    
    try {
      await deletePropertyDocument(documentId);
      toast({
        title: t('documentDeleted'),
        description: t('documentDeletedSuccessfully'),
      });
      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: t('errorDeletingDocument'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('propertyDocuments')}</CardTitle>
            <CardDescription>{t('propertyDocumentsDescription')}</CardDescription>
          </div>
          {canUpload && (
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              {t('uploadDocument')}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-10 h-10 mb-2" />}
            title={t('noDocumentsFound')}
            description={t('noDocumentsFoundDescription')}
            actionLabel={canUpload ? t('uploadFirstDocument') : undefined}
            action={canUpload ? () => setIsUploadDialogOpen(true) : undefined}
          />
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.document_name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{doc.document_type}</span>
                        <span className="mx-2">•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                        {doc.is_confidential && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <Lock className="h-3 w-3 mr-1" />
                              {t('confidential')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {canDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {doc.description && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <DocumentUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        propertyId={propertyId}
        onSuccess={() => {
          setIsUploadDialogOpen(false);
          refetch();
        }}
      />
    </Card>
  );
}

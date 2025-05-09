
import { useLanguage } from "@/contexts/LanguageContext";
import { ClubDealDocument } from "@/types/clubDeal";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClubDealDocumentsSectionProps {
  documents: ClubDealDocument[];
  className?: string;
}

export function ClubDealDocumentsSection({ 
  documents, 
  className = "" 
}: ClubDealDocumentsSectionProps) {
  const { t } = useLanguage();
  
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'business_plan':
        return t('businessPlans');
      case 'legal':
        return t('legalDocuments');
      case 'financial':
        return t('financialReports');
      default:
        return t('documents');
    }
  };
  
  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'business_plan':
        return "bg-easyroi-gold text-easyroi-navy";
      case 'legal':
        return "bg-blue-500 text-white";
      case 'financial':
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  if (documents.length === 0) {
    return null;
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xl font-semibold">{t('documents')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <FileText className="h-5 w-5 text-easyroi-navy" />
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{doc.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`${getDocumentTypeColor(doc.type)}`}>
                      {getDocumentTypeLabel(doc.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('download')}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { FileText, FileLock, FileChartLine, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentTab {
  id: string;
  label: string;
  icon: React.FC;
  documents: {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: string;
    uploaded?: string;
  }[];
}

interface PropertyDocumentsProps {
  property: Property;
}

export function PropertyDocuments({ property }: PropertyDocumentsProps) {
  const t = useTranslation();
  
  // For demo purposes, we'll create mock documents
  // In a real app, these would come from the backend
  const documentTabs: DocumentTab[] = [
    {
      id: "contracts",
      label: t("contracts"),
      icon: FileText,
      documents: [
        {
          id: "contract-1",
          name: "Purchase Agreement.pdf",
          url: "#",
          type: "application/pdf",
          size: "1.2 MB",
          uploaded: "2023-06-15"
        }
      ]
    },
    {
      id: "deeds",
      label: t("notarialDeeds"),
      icon: FileLock,
      documents: [
        {
          id: "deed-1",
          name: "Property Deed.pdf",
          url: "#",
          type: "application/pdf",
          size: "3.4 MB",
          uploaded: "2023-06-10"
        }
      ]
    },
    {
      id: "financial",
      label: t("financialReports"),
      icon: FileChartLine,
      documents: [
        {
          id: "report-1",
          name: "Annual Financial Report 2023.pdf",
          url: "#",
          type: "application/pdf",
          size: "2.1 MB",
          uploaded: "2024-01-20"
        },
        {
          id: "report-2",
          name: "Q1 2024 Financial Statement.xlsx",
          url: "#",
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: "567 KB",
          uploaded: "2024-04-05"
        }
      ]
    },
    {
      id: "tax",
      label: t("taxDeclarations"),
      icon: FileText,
      documents: [
        {
          id: "tax-1",
          name: "Property Tax Declaration 2023.pdf",
          url: "#",
          type: "application/pdf",
          size: "1.8 MB",
          uploaded: "2024-03-15"
        }
      ]
    },
    {
      id: "other",
      label: t("otherDocuments"),
      icon: File,
      documents: [
        {
          id: "other-1",
          name: "Property Photos.zip",
          url: "#",
          type: "application/zip",
          size: "15.2 MB",
          uploaded: "2023-09-22"
        }
      ]
    }
  ];

  const handleDownload = (document: any) => {
    // In a real application, this would download the actual file
    console.log("Downloading:", document.name);
    // window.open(document.url, '_blank');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{t('digitalDocumentation')}</h2>
      
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="mb-4">
          {documentTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger value={tab.id} key={tab.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {documentTabs.map((tab) => (
          <TabsContent value={tab.id} key={tab.id}>
            {tab.documents.length > 0 ? (
              <div className="space-y-2">
                {tab.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.size} • {t('uploaded')}: {doc.uploaded}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                    >
                      {t('download')}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  {t('noDocumentsFound')}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

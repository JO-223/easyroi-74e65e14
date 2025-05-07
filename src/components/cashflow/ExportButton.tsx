
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileSpreadsheet } from "lucide-react";
import { CashflowEntry, exportCashflowToCSV } from "@/services/cashflow/cashflowService";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: CashflowEntry[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: t('noData') || 'No Data',
        description: t('noDataToExport') || 'There is no data to export.',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const csvContent = exportCashflowToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and click it to trigger download
      const link = document.createElement('a');
      const filename = `cashflow_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: t('exportSuccess') || 'Export Successful',
        description: t('fileDownloaded') || 'The file has been downloaded.',
        variant: "default"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: t('exportError') || 'Export Failed',
        description: t('errorExportingData') || 'There was an error exporting the data.',
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={handleExport} className="ml-auto">
      <FileSpreadsheet className="mr-2 h-4 w-4" />
      {t('exportData') || 'Export Data'}
    </Button>
  );
};

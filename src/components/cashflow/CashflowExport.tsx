
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { CashflowData } from "@/services/cashflowService";

interface CashflowExportProps {
  data: CashflowData[] | undefined;
  disabled: boolean;
}

export function CashflowExport({ data, disabled }: CashflowExportProps) {
  const t = useTranslation();

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    
    // Prepare CSV headers
    const headers = [
      'Month',
      'Total Bookings',
      'Portal Fees',
      'Cleaning Costs',
      'Tourist Tax (DTCM)',
      'Forecasted Gross Total',
      'Actual Gross Total',
      'Gross Difference %',
      'Utility Costs',
      'Maintenance Costs',
      'Forecasted Net Total',
      'Actual Net Total',
      'Net Difference %'
    ].join(',');
    
    // Prepare CSV rows
    const rows = data.map(row => {
      const grossDifference = row.forecastedGrossTotal ? 
        ((row.actualGrossTotal - row.forecastedGrossTotal) / row.forecastedGrossTotal * 100).toFixed(2) : 
        '0';
      
      const netDifference = row.forecastedNetTotal ? 
        ((row.actualNetTotal - row.forecastedNetTotal) / row.forecastedNetTotal * 100).toFixed(2) : 
        '0';
      
      return [
        row.month,
        row.bookingsTotal,
        row.portalFees,
        row.cleaningCosts,
        row.touristTax,
        row.forecastedGrossTotal,
        row.actualGrossTotal,
        grossDifference,
        row.utilityCosts,
        row.maintenanceCosts,
        row.forecastedNetTotal,
        row.actualNetTotal,
        netDifference
      ].join(',');
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up and trigger the download
    link.setAttribute('href', url);
    link.setAttribute('download', `cashflow_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={exportToCSV} 
      disabled={disabled}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {t("exportCSV")}
    </Button>
  );
}

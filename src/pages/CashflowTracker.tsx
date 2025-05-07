
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CashflowFilters } from "@/components/cashflow/CashflowFilters";
import { CashflowTable } from "@/components/cashflow/CashflowTable";
import { ExportButton } from "@/components/cashflow/ExportButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { CashflowEntry, fetchCashflowData } from "@/services/cashflow/cashflowService";
import { useToast } from "@/hooks/use-toast";

const CashflowTracker: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [cashflowData, setCashflowData] = useState<CashflowEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadCashflowData();
  }, []);
  
  const loadCashflowData = async (startDate?: Date, endDate?: Date, propertyId?: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCashflowData(startDate, endDate, propertyId);
      setCashflowData(data);
    } catch (error) {
      console.error("Failed to load cashflow data:", error);
      toast({
        title: t('dataLoadError') || 'Error',
        description: t('errorLoadingCashflowData') || 'Failed to load cashflow data',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (startDate: Date | undefined, endDate: Date | undefined, propertyId?: string) => {
    loadCashflowData(startDate, endDate, propertyId);
  };
  
  return (
    <DashboardLayout title={t('cashflowTracker') || 'Cashflow Tracker'}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">{t('cashflowAnalytics') || 'Cashflow Analytics'}</h2>
          <ExportButton data={cashflowData} />
        </div>
        
        <CashflowFilters onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <CashflowTable data={cashflowData} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CashflowTracker;

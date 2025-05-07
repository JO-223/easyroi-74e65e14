
import React from "react";
import { CashflowFilters } from "./CashflowFilters";
import { CashflowTable } from "./CashflowTable";
import { useCashflowData } from "@/hooks/useCashflowData";
import { CashflowExport } from "./CashflowExport";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function CashflowContent() {
  const { data, isLoading, error, filters, setFilters } = useCashflowData();
  const { toast } = useToast();
  
  // Show error if there's a problem loading the data
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load cashflow data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6">
        <CashflowFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
        />
      </Card>
      
      <Card className="p-0 overflow-hidden">
        <CashflowTable 
          data={data} 
          isLoading={isLoading} 
        />
      </Card>
      
      <div className="flex justify-end">
        <CashflowExport data={data} disabled={isLoading || !data?.length} />
      </div>
    </div>
  );
}

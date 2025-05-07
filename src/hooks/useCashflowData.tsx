
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CashflowFilters, CashflowData, fetchCashflowData } from "@/services/cashflowService";

export function useCashflowData() {
  const [filters, setFilters] = useState<CashflowFilters>({
    year: new Date().getFullYear(),
    month: null,
    propertyId: null,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['cashflow-data', filters],
    queryFn: () => fetchCashflowData(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    filters,
    setFilters,
  };
}

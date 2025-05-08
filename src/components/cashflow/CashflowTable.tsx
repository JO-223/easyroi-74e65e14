
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { CashflowData } from "@/services/cashflowService";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";

interface CashflowTableProps {
  data: CashflowData[] | undefined;
  isLoading: boolean;
}

export function CashflowTable({ data, isLoading }: CashflowTableProps) {
  const t = useTranslation();

  const renderDifferencePercentage = (forecasted: number, actual: number) => {
    if (forecasted === 0) return <span>-</span>;
    
    const difference = ((actual - forecasted) / forecasted) * 100;
    const formattedDifference = difference.toFixed(2);
    const isPositive = difference > 0;
    
    return (
      <Badge variant={isPositive ? "secondary" : "destructive"} className="ml-2">
        {isPositive ? '+' : ''}{formattedDifference}%
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{t("noCashflowData")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="bg-muted/50">{t("month")}</TableHead>
            <TableHead rowSpan={2}>{t("totalBookings")}</TableHead>
            <TableHead rowSpan={2}>{t("portalFees")}</TableHead>
            <TableHead rowSpan={2}>{t("cleaningCosts")}</TableHead>
            <TableHead rowSpan={2}>{t("touristTax")}</TableHead>
            <TableHead colSpan={2} className="text-center bg-muted/20">{t("grossTotal")}</TableHead>
            <TableHead rowSpan={2}>{t("utilityCosts")}</TableHead>
            <TableHead rowSpan={2}>{t("maintenanceCosts")}</TableHead>
            <TableHead colSpan={2} className="text-center bg-muted/20">{t("netTotal")}</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="bg-muted/20">{t("forecast")}</TableHead>
            <TableHead className="bg-muted/20">{t("actual")}</TableHead>
            <TableHead className="bg-muted/20">{t("forecast")}</TableHead>
            <TableHead className="bg-muted/20">{t("actual")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => {
            const {
              month,
              bookingsTotal,
              portalFees,
              cleaningCosts,
              touristTax,
              utilityCosts,
              maintenanceCosts,
              forecastedGrossTotal,
              actualGrossTotal,
              forecastedNetTotal,
              actualNetTotal
            } = row;

            // Convert month names to lowercase for translation keys
            const monthKey = month.toLowerCase() as TranslationKey;

            return (
              <TableRow key={month}>
                <TableCell className="font-medium bg-muted/50">{t(monthKey)}</TableCell>
                <TableCell>{formatCurrency(bookingsTotal)}</TableCell>
                <TableCell>{formatCurrency(portalFees)}</TableCell>
                <TableCell>{formatCurrency(cleaningCosts)}</TableCell>
                <TableCell>{formatCurrency(touristTax)}</TableCell>
                <TableCell className="bg-muted/20">{formatCurrency(forecastedGrossTotal)}</TableCell>
                <TableCell className="bg-muted/20">
                  {formatCurrency(actualGrossTotal)}
                  {renderDifferencePercentage(forecastedGrossTotal, actualGrossTotal)}
                </TableCell>
                <TableCell>{formatCurrency(utilityCosts)}</TableCell>
                <TableCell>{formatCurrency(maintenanceCosts)}</TableCell>
                <TableCell className="bg-muted/20">{formatCurrency(forecastedNetTotal)}</TableCell>
                <TableCell className="bg-muted/20">
                  {formatCurrency(actualNetTotal)}
                  {renderDifferencePercentage(forecastedNetTotal, actualNetTotal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

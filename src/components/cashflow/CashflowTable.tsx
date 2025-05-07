
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { CashflowEntry, formatCurrency } from "@/services/cashflow/cashflowService";

interface CashflowTableProps {
  data: CashflowEntry[];
}

export const CashflowTable: React.FC<CashflowTableProps> = ({ data }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('monthlyCashflow') || 'Monthly Cashflow'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('month') || 'Month'}</TableHead>
                <TableHead>{t('year') || 'Year'}</TableHead>
                <TableHead>{t('totalBookings') || 'Total Bookings'}</TableHead>
                <TableHead>{t('portalCommissions') || 'Portal Commissions'}</TableHead>
                <TableHead>{t('cleaningCosts') || 'Cleaning Costs'}</TableHead>
                <TableHead>{t('touristTaxDTCM') || 'Tourist Tax DTCM'}</TableHead>
                <TableHead className="bg-green-50">{t('grossTotal') || 'Gross Total'}</TableHead>
                <TableHead>{t('utilityCosts') || 'Utility Costs'}</TableHead>
                <TableHead>{t('maintenanceCosts') || 'Maintenance Costs'}</TableHead>
                <TableHead className="bg-blue-50">{t('netTotal') || 'Net Total'}</TableHead>
                <TableHead>{t('dataType') || 'Data Type'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    {t('noData') || 'No cashflow data available'}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((entry, index) => (
                  <TableRow key={`${entry.year}-${entry.month}-${index}`}>
                    <TableCell>{entry.month}</TableCell>
                    <TableCell>{entry.year}</TableCell>
                    <TableCell>{entry.totalBookings}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(-entry.portalCommissions)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(-entry.cleaningCosts)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(-entry.touristTaxDTCM)}</TableCell>
                    <TableCell className={`font-medium ${entry.grossTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(entry.grossTotal)}
                    </TableCell>
                    <TableCell className="text-red-600">{formatCurrency(-entry.utilityCosts)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(-entry.maintenanceCosts)}</TableCell>
                    <TableCell className={`font-medium ${entry.netTotal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(entry.netTotal)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        entry.isActual 
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }>
                        {entry.isActual 
                          ? (t('actual') || 'Actual') 
                          : (t('forecast') || 'Forecast')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

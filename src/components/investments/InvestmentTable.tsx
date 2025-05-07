
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";
import { Investment } from "@/types/investment";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { ArrowDown, ArrowUp } from "lucide-react";

interface InvestmentTableProps {
  investments: Investment[];
  type: 'secondary' | 'offPlan' | 'clubDeal';
  showExtendedColumns?: boolean;
}

type SortKey = 'name' | 'location' | 'currentValue' | 'purchaseDate' | 
               'percentageOwned' | 'investedCapital' | 'contractYears' | 
               'expectedYield' | 'actualYield';

type SortDirection = 'asc' | 'desc';

export function InvestmentTable({ investments, type, showExtendedColumns = false }: InvestmentTableProps) {
  const t = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortedInvestments = () => {
    return [...investments].sort((a, b) => {
      let compareA: any = a[sortKey as keyof Investment];
      let compareB: any = b[sortKey as keyof Investment];
      
      // Handle date comparisons
      if (sortKey === 'purchaseDate') {
        compareA = new Date(compareA).getTime();
        compareB = new Date(compareB).getTime();
      }

      // Handle numerical or string comparison
      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return sortDirection === 'asc' ? compareA - compareB : compareB - compareA;
      } else {
        const strA = String(compareA).toLowerCase();
        const strB = String(compareB).toLowerCase();
        return sortDirection === 'asc' ? 
          strA.localeCompare(strB) : 
          strB.localeCompare(strA);
      }
    });
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-2" /> : 
      <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const renderSortableHeader = (key: SortKey, label: string) => (
    <TableHead 
      className="cursor-pointer"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(key)}
      </div>
    </TableHead>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (investments.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        {t('noInvestmentsFound')}
      </Card>
    );
  }

  const sortedInvestments = getSortedInvestments();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {renderSortableHeader('name', t('propertyName'))}
            {renderSortableHeader('location', t('location'))}
            {renderSortableHeader('currentValue', t('currentValue'))}
            {renderSortableHeader('purchaseDate', t('purchaseDate'))}
            
            {showExtendedColumns && (
              <>
                {renderSortableHeader('percentageOwned', t('percentageOwned'))}
                {renderSortableHeader('investedCapital', t('investedCapital'))}
                {renderSortableHeader('contractYears', t('contractYears'))}
                {renderSortableHeader('expectedYield', t('expectedYield'))}
                {renderSortableHeader('actualYield', t('actualYield'))}
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvestments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className="font-medium">{investment.name}</TableCell>
              <TableCell>{investment.location}</TableCell>
              <TableCell>{formatCurrency(investment.currentValue)}</TableCell>
              <TableCell>{formatDate(investment.purchaseDate)}</TableCell>
              
              {showExtendedColumns && (
                <>
                  <TableCell>{formatPercentage(investment.percentageOwned || 0)}</TableCell>
                  <TableCell>{formatCurrency(investment.investedCapital || 0)}</TableCell>
                  <TableCell>{investment.contractYears || '-'}</TableCell>
                  <TableCell>{formatPercentage(investment.expectedYield || 0)}</TableCell>
                  <TableCell>{formatPercentage(investment.actualYield || 0)}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

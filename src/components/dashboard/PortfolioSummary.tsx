
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PortfolioSummaryProps {
  isLoading?: boolean;
}

export function PortfolioSummary({ isLoading = false }: PortfolioSummaryProps) {
  const { t } = useLanguage();
  
  // Demo data for display
  const data = {
    totalInvestment: 1250000,
    portfolioROI: 7.2,
    totalProperties: 5,
    investmentChange: 3.4,
    roiChange: 0.5,
    propertyChange: 1
  };
  
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("yourInvestmentOverview")}</CardTitle>
        <CardDescription>{t("lastUpdated")}: {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("totalInvestment")}</p>
            <p className="text-2xl font-bold">{formatCurrency(data.totalInvestment)}</p>
            <p className={`text-xs flex items-center ${data.investmentChange > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data.investmentChange > 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(data.investmentChange)}% {t("fromLastMonth")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("portfolioROI")}</p>
            <p className="text-2xl font-bold">{data.portfolioROI.toFixed(1)}%</p>
            <p className={`text-xs flex items-center ${data.roiChange > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data.roiChange > 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(data.roiChange)}% {t("fromLastMonth")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("totalProperties")}</p>
            <p className="text-2xl font-bold">{data.totalProperties}</p>
            <p className={`text-xs flex items-center ${data.propertyChange > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data.propertyChange > 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(data.propertyChange)} {t("fromLastMonth")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioSummaryData } from "@/types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingDown, TrendingUp, Building, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserLevelCard } from "./UserLevelCard";

interface PortfolioSummaryProps {
  data: PortfolioSummaryData | null;
  isLoading: boolean;
}

export function PortfolioSummary({ data, isLoading }: PortfolioSummaryProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <>
        <SummarySkeleton />
        <SummarySkeleton />
        <SummarySkeleton />
      </>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <>
      <SummaryCard
        title={t('totalInvestment')}
        value={formatCurrency(data?.totalInvestment || 0)}
        change={data?.investmentChange || 0}
        icon={<PieChart className="h-5 w-5" />}
      />
      <SummaryCard
        title={t('portfolioROI')}
        value={`${(data?.portfolioROI || 0).toFixed(2)}%`}
        change={data?.roiChange || 0}
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <UserLevelCard />
    </>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

function SummaryCard({ title, value, change, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="bg-muted p-1.5 rounded-full">{icon}</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
            {change > 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : change < 0 ? (
              <TrendingDown className="h-4 w-4 mr-1" />
            ) : null}
            <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-end justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

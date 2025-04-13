
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChartSkeleton } from "./chart-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";

interface ResponsiveChartProps {
  className?: string;
  chart: React.ReactNode;
  mobileChart?: React.ReactNode;
  isLoading?: boolean;
  skeletonHeight?: number;
  skeletonVariant?: "line" | "bar" | "pie";
  title?: React.ReactNode;
  height?: number;
  emptyState?: React.ReactNode;
  hasData?: boolean;
  error?: Error | null;
}

export function ResponsiveChart({
  className,
  chart,
  mobileChart,
  isLoading,
  skeletonHeight = 300,
  skeletonVariant = "line",
  title,
  height,
  emptyState,
  hasData = true,
  error,
}: ResponsiveChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useLanguage();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show skeleton during loading
  if (isLoading || !isMounted) {
    return (
      <div className={className}>
        {title && <div className="mb-4">{title}</div>}
        <ChartSkeleton 
          className=""
          height={skeletonHeight}
          variant={skeletonVariant} 
        />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("bg-red-50 border border-red-200 rounded-lg p-4", className)}>
        {title && <div className="mb-4">{title}</div>}
        <div className="flex flex-col items-center justify-center py-8 text-red-600">
          <AlertCircle className="h-12 w-12 mb-3" />
          <p className="text-center font-medium">{t('errorLoadingData')}</p>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!hasData) {
    if (emptyState) {
      return (
        <div className={className}>
          {title && <div className="mb-4">{title}</div>}
          {emptyState}
        </div>
      );
    }
    
    return (
      <div className={cn("bg-muted/30 border border-dashed rounded-lg", className)}>
        {title && <div className="mb-4">{title}</div>}
        <div className="flex flex-col items-center justify-center h-[200px] p-4">
          <p className="text-muted-foreground font-medium">{t('noDataAvailable')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('dataWillAppearSoon')}</p>
        </div>
      </div>
    );
  }

  // Show chart
  return (
    <div className={cn("relative", className)} style={height ? { height: `${height}px` } : {}}>
      <ErrorBoundary>
        {title && <div className="mb-4">{title}</div>}
        {isMobile && mobileChart ? mobileChart : chart}
      </ErrorBoundary>
    </div>
  );
}

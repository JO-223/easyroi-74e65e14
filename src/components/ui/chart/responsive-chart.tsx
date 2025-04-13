
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChartSkeleton } from "./chart-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";

interface ResponsiveChartProps {
  className?: string;
  chart: React.ReactNode;
  mobileChart?: React.ReactNode;
  isLoading?: boolean;
  skeletonHeight?: number;
  skeletonVariant?: "line" | "bar" | "pie";
  title?: React.ReactNode;
  height?: number;
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
}: ResponsiveChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <ChartSkeleton 
        className={className}
        height={skeletonHeight}
        variant={skeletonVariant} 
      />
    );
  }

  return (
    <div className={cn("relative", className)} style={height ? { height: `${height}px` } : {}}>
      <ErrorBoundary>
        {title && <div className="mb-4">{title}</div>}
        {isMobile && mobileChart ? mobileChart : chart}
      </ErrorBoundary>
    </div>
  );
}

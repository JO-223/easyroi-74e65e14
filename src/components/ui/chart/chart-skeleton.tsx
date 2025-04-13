
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  className?: string;
  height?: number;
  variant?: "line" | "bar" | "pie";
}

export function ChartSkeleton({ 
  className, 
  height = 300,
  variant = "line"
}: ChartSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-[100px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      <div 
        className="relative overflow-hidden rounded-lg border border-dashed p-2"
        style={{ height: `${height}px` }}
      >
        {variant === "pie" ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : variant === "bar" ? (
          <div className="flex items-end justify-between h-full p-4 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-full" 
                style={{ 
                  height: `${30 + Math.random() * 60}%`
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
            <Skeleton className="h-[150px]" />
            <div className="grid grid-cols-7 gap-4 mt-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

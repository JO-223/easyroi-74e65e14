
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart3, FileQuestion, Settings } from "lucide-react";

type EmptyStateVariant = "default" | "analytics" | "settings" | "properties" | "network" | "events";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: EmptyStateVariant;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const { t } = useLanguage();

  // Determine icon based on variant
  const Icon = () => {
    if (icon) return <>{icon}</>;

    switch (variant) {
      case "analytics":
        return <BarChart3 className="h-12 w-12 text-muted-foreground/50" />;
      case "settings":
        return <Settings className="h-12 w-12 text-muted-foreground/50" />;
      default:
        return <FileQuestion className="h-12 w-12 text-muted-foreground/50" />;
    }
  };

  // Default text based on variant
  const defaultTitle = title || (
    variant === "analytics" ? t('noDataAvailable') :
    variant === "properties" ? t('noPropertiesFound') :
    variant === "network" ? t('noInvestorsFound') :
    variant === "events" ? t('noEventsFound') :
    t('noData')
  );

  const defaultDescription = description || (
    variant === "analytics" ? t('dataWillAppearSoon') : 
    variant === "properties" ? t('tryDifferentFilters') :
    variant === "network" ? t('tryDifferentSearch') :
    variant === "events" ? t('tryDifferentFilters') :
    t('refreshOrContactSupport')
  );

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed",
      variant === "default" ? "bg-background" : "bg-muted/30",
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon />
      </div>
      <h3 className="mt-6 text-xl font-semibold">{defaultTitle}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">{defaultDescription}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

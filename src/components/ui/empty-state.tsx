
import React from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardTitle } from "./card";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
  variant?: "default" | "card";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  variant = "default"
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full">
      {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mt-2">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );

  if (variant === "card") {
    return <Card className="w-full">{content}</Card>;
  }

  return content;
}

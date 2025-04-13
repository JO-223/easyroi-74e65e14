
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  action?: () => void;
  variant?: string; // Add variant prop to support the component props in AnalyticsContent
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  action,
  variant = 'default'
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${variant === 'card' ? 'bg-white rounded-lg shadow p-6' : ''}`}>
      {icon && (
        <div className="text-muted-foreground mb-2">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mt-2">
          {description}
        </p>
      )}
      {actionLabel && action && (
        <Button 
          onClick={action} 
          className="mt-4"
          variant="outline"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

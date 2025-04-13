
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertCircle } from 'lucide-react';

export function DashboardError() {
  const { t } = useLanguage();
  
  return (
    <EmptyState
      variant="card"
      icon={<AlertCircle size={40} />}
      title={"No Data Available"}
      description={"Please refresh the page or contact support if the issue persists"}
    />
  );
}

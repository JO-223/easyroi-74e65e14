
import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import SavedSearchesList from "@/components/search/SavedSearchesList";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SavedSearches() {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout 
      title={t('savedSearches')} 
      subtitle={t('savedSearchesDescription')}
    >
      <div className="container mx-auto py-6">
        <SavedSearchesList />
      </div>
    </DashboardLayout>
  );
}


import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SavedSearchesList } from "@/components/search/SavedSearchesList";

export default function SavedSearches() {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout title={"Saved Searches"} subtitle={"View and manage your saved property searches"}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Saved Searches</h1>
        <SavedSearchesList />
      </div>
    </DashboardLayout>
  );
}


import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { AdminInvestorForm } from "@/components/admin/AdminInvestorForm";
import { AdminPropertyForm } from "@/components/admin/AdminPropertyForm";
import { AdminForSalePropertyForm } from "@/components/admin/AdminForSalePropertyForm";
import { AdminDevelopmentProjectForm } from "@/components/admin/AdminDevelopmentProjectForm";
import { AdminEventForm } from "@/components/admin/AdminEventForm";
import { ShieldAlert } from "lucide-react";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("investors");

  return (
    <DashboardLayout 
      title={t('adminPanel')} 
      subtitle={t('adminPanelSubtitle')}
    >
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 text-easyroi-navy">
            <ShieldAlert size={24} className="text-easyroi-gold" />
            <h2 className="text-2xl font-semibold">{t('adminPanel')}</h2>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 w-full grid grid-cols-5">
              <TabsTrigger value="investors">{t('investors')}</TabsTrigger>
              <TabsTrigger value="properties">{t('properties')}</TabsTrigger>
              <TabsTrigger value="forSale">{t('forSaleProperties')}</TabsTrigger>
              <TabsTrigger value="projects">{t('developmentProjects')}</TabsTrigger>
              <TabsTrigger value="events">{t('events')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="investors" className="pt-4">
              <AdminInvestorForm />
            </TabsContent>
            
            <TabsContent value="properties" className="pt-4">
              <AdminPropertyForm />
            </TabsContent>
            
            <TabsContent value="forSale" className="pt-4">
              <AdminForSalePropertyForm />
            </TabsContent>
            
            <TabsContent value="projects" className="pt-4">
              <AdminDevelopmentProjectForm />
            </TabsContent>
            
            <TabsContent value="events" className="pt-4">
              <AdminEventForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;


import { AdminFunctionTester } from "@/components/admin/AdminFunctionTester";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flask } from "lucide-react";

const AdminTester = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout 
      title={t('adminFunctionTester')}
      subtitle={t('testAdminFunctions')}
    >
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 text-easyroi-navy">
            <Flask size={24} className="text-easyroi-gold" />
            <h2 className="text-2xl font-semibold">{t('adminFunctionTester')}</h2>
          </div>

          <AdminFunctionTester />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTester;

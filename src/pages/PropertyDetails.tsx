
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading property data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <DashboardLayout title={t('propertyDetails')}>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t('propertyDetails')}: {id}</h2>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full max-w-md" />
              <Skeleton className="h-72 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p>{t('propertyDetails')} {t('comingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;

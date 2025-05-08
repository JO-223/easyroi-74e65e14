
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ConsultantCard } from "./ConsultantCard";
import { Consultant } from "@/types/consultation";
import { fetchAllConsultants } from "@/services/consultationService";

export function AllConsultantsList() {
  const t = useTranslation();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConsultants = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllConsultants();
        setConsultants(data);
      } catch (error) {
        console.error("Error loading consultants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultants();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ConsultantCard key={i} isLoading={true} />
        ))}
      </div>
    );
  }

  if (!consultants || consultants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{t('noConsultantsAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {consultants.map((consultant) => (
        <ConsultantCard key={consultant.id} consultant={consultant} />
      ))}
    </div>
  );
}

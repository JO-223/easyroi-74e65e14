
import { useTranslation } from "@/hooks/useTranslation";
import { ConsultantCard } from "./ConsultantCard";
import { ExpertType } from "@/types/consultation";
import { useConsultants } from "@/hooks/useConsultants";

interface ConsultantsListProps {
  type: ExpertType;
}

export function ConsultantsList({ type }: ConsultantsListProps) {
  const t = useTranslation();
  const { consultants, isLoading } = useConsultants(type);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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

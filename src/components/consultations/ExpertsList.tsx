
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Expert } from "@/types/consultation";
import { ExpertCard } from "./ExpertCard";

interface ExpertsListProps {
  experts: Expert[];
  category: string;
}

export function ExpertsList({ experts, category }: ExpertsListProps) {
  const t = useTranslation();

  if (!experts.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        {t('noExpertsFound')}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => (
        <ExpertCard key={expert.id} expert={expert} />
      ))}
    </div>
  );
}


import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EventsAttendedCardProps {
  count: number;
}

export const EventsAttendedCard = ({ count }: EventsAttendedCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{t('eventsAttended')}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6 pt-2">
        <div className="bg-easyroi-navy/10 p-4 rounded-full">
          <Calendar className="h-8 w-8 text-easyroi-navy" />
        </div>
        <div>
          <span className="text-4xl font-bold">{count}</span>
          <p className="text-muted-foreground">{t('eventsInLastYear')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

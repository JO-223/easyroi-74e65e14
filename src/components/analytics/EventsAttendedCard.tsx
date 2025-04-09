
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventsAttendedCardProps {
  count: number;
}

export const EventsAttendedCard = ({ count }: EventsAttendedCardProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('eventsAttended')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-5xl font-bold">{count}</p>
            <p className="text-muted-foreground mt-2">
              {count === 0 ? t('noEventsYet') : t('totalEvents')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

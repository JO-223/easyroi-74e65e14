
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/property";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar, ChevronRight } from "lucide-react";
import { EventCard } from "../events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  actionLabel?: string;
  action?: () => void;
}

export function EventList({ events, isLoading = false, actionLabel, action }: EventListProps) {
  const { t } = useLanguage();
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col space-y-3">
          {[1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (events.length === 0) {
      return (
        <EmptyState
          icon={<Calendar size={50} />}
          title={t('noEventsFound')}
          description={t('tryDifferentFilters')}
        />
      );
    }
    
    return (
      <div className="flex flex-col space-y-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} compact />
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('upcomingEvents')}</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      {!isLoading && events.length > 0 && action && actionLabel && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={action}
            className="flex items-center"
          >
            {actionLabel}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

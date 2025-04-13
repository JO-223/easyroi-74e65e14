
import { Event } from "@/types/event";
import { EventCard } from "./EventCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  userBadge?: string;
}

export function EventList({ events, isLoading = false, userBadge = "bronze" }: EventListProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleEventClick = (event: Event) => {
    navigate(`/dashboard/events/${event.id}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">{t('noEventsFound')}</h3>
        <p className="mt-2 text-sm text-gray-500">{t('tryDifferentFilters')}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onClick={handleEventClick} 
          userBadge={userBadge}
        />
      ))}
    </div>
  );
}

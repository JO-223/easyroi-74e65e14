
import React from 'react';
import { Event } from "@/types/event";
import { EventCard } from '@/components/events/EventCard'; // Fix the import
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface EventListProps {
  events: Event[];
  compact?: boolean;
}

export function EventList({ events, compact = false }: EventListProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.slice(0, 3).map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onClick={(e) => navigate(`/dashboard/events/${e.id}`)}
            userBadge="bronze" 
          />
        ))}
      </div>
      
      {!compact && events.length > 3 && (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/events')}
          >
            {t("viewAllEvents")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

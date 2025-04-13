
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Users, Globe, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { BadgeLevel } from "@/components/ui/badge-level";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  userBadge?: string;
}

export function EventCard({ event, onClick, userBadge = "bronze" }: EventCardProps) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
  // Check if event is at capacity
  const isAtCapacity = event.max_attendees !== null && event.current_attendees >= event.max_attendees;
  
  // Check if user has required badge
  const userHasRequiredBadge = !event.required_badges || 
    event.required_badges.length === 0 || 
    event.required_badges.includes(userBadge.toLowerCase());
  
  // Parse the date from the event
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMM d, yyyy');
  
  // Gestione degli errori di caricamento delle immagini
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Card 
      className={cn(
        "group overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer",
        isAtCapacity ? "opacity-70" : "",
        !userHasRequiredBadge ? "opacity-50" : ""
      )}
      onClick={() => onClick(event)}
    >
      <div className="relative h-48 bg-gray-200">
        {event.image_url && !imageError ? (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Badge className="bg-easyroi-gold text-easyroi-navy">
            {event.event_type}
          </Badge>
          
          {event.is_online && (
            <Badge className="bg-blue-500">
              <Monitor className="w-3 h-3 mr-1" />
              {t('online')}
            </Badge>
          )}
        </div>
        
        {isAtCapacity && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive">
              {t('atCapacity')}
            </Badge>
          </div>
        )}
        
        {!userHasRequiredBadge && (
          <div className="absolute bottom-2 left-2 right-2">
            <Badge variant="outline" className="w-full flex justify-center bg-black bg-opacity-70 text-white">
              {t('upgradeRequiredToJoin')}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="w-4 h-4 mr-2" />
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-1">
          {event.is_online ? (
            <Globe className="w-4 h-4 mr-2" />
          ) : (
            <MapPin className="w-4 h-4 mr-2" />
          )}
          <span className="line-clamp-1">{event.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          <span>
            {event.max_attendees 
              ? `${event.current_attendees}/${event.max_attendees} ${t('attendees')}`
              : `${event.current_attendees} ${t('attendees')}`
            }
          </span>
        </div>
        
        {event.required_badges && event.required_badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.required_badges.map((badge) => (
              <BadgeLevel key={badge} level={badge as any} className="scale-75 origin-left" />
            ))}
          </div>
        )}
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </CardContent>
    </Card>
  );
}

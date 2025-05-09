
import { useLanguage } from "@/contexts/LanguageContext";
import { ClubDealEvent } from "@/types/clubDeal";
import { format } from "date-fns";
import { Circle, CheckCircle, TrendingUp, BarChart } from "lucide-react";

interface ClubDealTimelineProps {
  events: ClubDealEvent[];
  className?: string;
}

export function ClubDealTimeline({ events, className = "" }: ClubDealTimelineProps) {
  const { t } = useLanguage();
  
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return CheckCircle;
      case 'financial':
        return TrendingUp;
      default:
        return Circle;
    }
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return "text-easyroi-gold";
      case 'financial':
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xl font-semibold">{t('dealTimeline')}</h3>
      
      <div className="relative">
        {/* Left side line */}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
        
        {sortedEvents.map((event, index) => {
          const EventIcon = getEventIcon(event.type);
          const colorClass = getEventColor(event.type);
          const formattedDate = format(new Date(event.date), 'MMM d, yyyy');
          
          return (
            <div key={event.id} className="relative pl-10 py-4">
              {/* Icon */}
              <div className={`absolute left-1 top-4 w-6 h-6 rounded-full bg-white ${colorClass}`}>
                <EventIcon className="w-6 h-6" />
              </div>
              
              {/* Content */}
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
                <h4 className="text-md font-medium mt-1">{event.title}</h4>
                <p className="text-sm mt-1">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

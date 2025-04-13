
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEvent, registerForEvent, fetchSimilarEvents } from '@/services/eventService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SideCardItem } from '@/components/ui/side-card-item';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, AlertTriangle, Globe, Building, Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BadgeLevel } from '@/components/ui/badge-level';
import { EventList } from '@/components/events/EventList';
import { EventReviewsList } from '@/components/events/EventReviewsList';
import { EmptyState } from '@/components/ui/empty-state';

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const { t } = useLanguage();
  const { user, userDetails } = useAuth();
  const { toast } = useToast();
  const [registeringInProgress, setRegisteringInProgress] = useState(false);
  
  // Fetch event details
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId!),
    enabled: !!eventId
  });
  
  // Fetch similar events
  const { data: similarEvents = [] } = useQuery({
    queryKey: ['similarEvents', eventId],
    queryFn: () => fetchSimilarEvents(eventId!),
    enabled: !!eventId && !!event
  });
  
  // Handle error states
  if (error) {
    return (
      <DashboardLayout title={t('eventDetail')} subtitle={""}>
        <EmptyState 
          variant="card"
          icon={<AlertTriangle size={40} />}
          title={t('errorLoadingEvent')}
          description={t('errorLoadingEventDescription')}
        />
      </DashboardLayout>
    );
  }
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('eventDetail')} subtitle={""}>
        <div className="w-full text-center p-10">
          <div className="animate-spin w-10 h-10 border-4 border-easyroi-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading event details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!event) {
    return (
      <DashboardLayout title={t('eventDetail')} subtitle={""}>
        <EmptyState 
          variant="card"
          icon={<AlertTriangle size={40} />}
          title={t('eventNotFound')}
          description={t('eventNotFoundDescription')}
        />
      </DashboardLayout>
    );
  }
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  
  // Check if user is already registered
  const isRegistered = false; // This would come from a backend check
  
  // Check if event is in the past
  const isPastEvent = new Date(event.date) < new Date();
  
  // Check if event is at capacity
  const isAtCapacity = event.max_attendees !== null && event.current_attendees >= event.max_attendees;
  
  // Format rating if available
  const formattedRating = event.average_rating 
    ? `${event.average_rating.toFixed(1)}/5.0`
    : "No ratings yet";
    
  return (
    <DashboardLayout 
      title={event.title} 
      subtitle={formattedDate}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Event image */}
          <div className="relative rounded-lg overflow-hidden h-72 bg-gray-100">
            {event.image_url ? (
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <Calendar className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Related property or project links */}
          {event.property_id && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">{t('relatedProperty')}</h3>
              <Link to={`/properties/${event.property_id}`} className="text-easyroi-gold hover:underline flex items-center">
                <Building className="mr-2 h-4 w-4" />
                View related property
              </Link>
            </div>
          )}
          
          {event.project_id && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">{t('relatedProject')}</h3>
              <Link to={`/development/${event.project_id}`} className="text-easyroi-gold hover:underline flex items-center">
                <Construction className="mr-2 h-4 w-4" />
                View related development project
              </Link>
            </div>
          )}
          
          {/* Event description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Event Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          {/* Event tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border">
                  <h3 className="font-medium text-lg mb-3">Event Information</h3>
                  <div className="space-y-3">
                    {/* Required level */}
                    {event.required_badges && event.required_badges.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">{t('requiredLevel')}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {event.required_badges.map(badge => (
                              <BadgeLevel key={badge} level={badge as any} className="scale-75" />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Format: online or in-person */}
                    <div className="flex items-start space-x-3">
                      {event.is_online ? <Globe className="h-5 w-5 text-blue-500 mt-0.5" /> : <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />}
                      <div>
                        <p className="text-sm text-gray-500">{t('format')}</p>
                        <p className="font-medium">
                          {event.is_online ? "Online" : t('inPerson')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Capacity */}
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">{t('capacity')}</p>
                        <p className="font-medium">
                          {event.max_attendees 
                            ? `${event.current_attendees}/${event.max_attendees} ${t('attendees')}`
                            : `${event.current_attendees} ${t('registered')} (unlimited capacity)`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <EventReviewsList eventId={event.id} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Registration card */}
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            {/* Registration action button */}
            <Button 
              className="w-full bg-easyroi-gold hover:bg-easyroi-gold/90 mb-4"
              disabled={isRegistered || isPastEvent || isAtCapacity || registeringInProgress}
            >
              {isRegistered 
                ? "You're registered" 
                : isPastEvent 
                  ? "Event has ended" 
                  : isAtCapacity 
                    ? "Event at capacity" 
                    : "Register for event"
              }
            </Button>
            
            {/* Event info summary */}
            <div className="space-y-4 pt-4 border-t">
              <SideCardItem 
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                label="Date"
                value={formattedDate}
              />
              <SideCardItem 
                icon={<Clock className="h-5 w-5 text-gray-400" />}
                label="Time"
                value={event.time}
              />
              <SideCardItem 
                icon={event.is_online ? <Globe className="h-5 w-5 text-gray-400" /> : <MapPin className="h-5 w-5 text-gray-400" />}
                label="Location"
                value={event.location}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar events section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">{t('similarEvents')}</h2>
        {similarEvents.length > 0 ? (
          <EventList events={similarEvents} userBadge={userDetails?.level} />
        ) : (
          <p className="text-gray-500 text-center py-8">{t('noSimilarEvents')}</p>
        )}
      </div>
    </DashboardLayout>
  );
}

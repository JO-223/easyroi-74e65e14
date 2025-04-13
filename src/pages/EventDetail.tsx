import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "@/services/eventService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Users, Building2, Construction, Star, Home, Building } from "lucide-react";
import { format } from "date-fns";
import EventReviewsList from "@/components/events/EventReviewsList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link, ExternalLink } from "react-router-dom";
import { SideCardItem } from "@/components/ui/side-card-item";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const { t } = useLanguage();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId as string),
    enabled: !!eventId
  });
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('loading')} subtitle="">
        <div className="container mx-auto py-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-40 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout title={t('error')} subtitle="">
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorLoadingEvent')}</AlertTitle>
            <AlertDescription>
              {t('errorLoadingEventDescription')}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!event) {
    return (
      <DashboardLayout title={t('eventNotFound')} subtitle="">
        <div className="container mx-auto py-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('eventNotFound')}</AlertTitle>
            <AlertDescription>
              {t('eventNotFoundDescription')}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title={event.title} subtitle="">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {event.event_type}
                      </Badge>
                      {event.average_rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                          {event.average_rating.toFixed(1)}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <Button>
                    {t('registerForEvent')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {event.image_url && (
                  <div className="relative w-full h-64 mb-6">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>
                      {event.current_attendees} / {event.max_attendees || '∞'} {t('attendees')}
                    </span>
                  </div>
                  
                  {event.property_id && (
                    <SideCardItem
                      icon={<Home size={16} />}
                      label={t('relatedProperty')}
                      value={
                        <Link
                          to={`/properties/${event.property_id}`}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {t('viewDetails')} <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      }
                    />
                  )}
                  
                  {event.project_id && (
                    <SideCardItem
                      icon={<Building size={16} />}
                      label={t('relatedProject')}
                      value={
                        <Link
                          to={`/development/${event.project_id}`}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {t('viewDetails')} <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      }
                    />
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('description')}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <EventReviewsList eventId={eventId as string} />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('eventDetails')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{t('requiredLevel')}</h4>
                    <div className="flex gap-1 mt-1">
                      {event.required_badges?.map((badge) => (
                        <Badge key={badge} variant="outline">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{t('eventType')}</h4>
                    <p className="text-muted-foreground">{event.event_type}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{t('format')}</h4>
                    <p className="text-muted-foreground">
                      {event.is_online ? t('online') : t('inPerson')}
                    </p>
                  </div>
                  
                  {event.max_attendees && (
                    <div>
                      <h4 className="font-medium">{t('capacity')}</h4>
                      <p className="text-muted-foreground">
                        {event.max_attendees} {t('attendees')}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium">{t('registered')}</h4>
                    <p className="text-muted-foreground">
                      {event.current_attendees} {t('attendees')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('similarEvents')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('noSimilarEvents')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

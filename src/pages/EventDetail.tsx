
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent, registerForEvent, cancelEventRegistration } from "@/services/eventService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id!),
    meta: {
      onError: () => {
        toast({
          title: t('errorFetchingEvent'),
          description: t('pleaseTryAgainLater'),
          variant: "destructive",
        });
      },
    },
  });
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('eventDetails')} subtitle={t('loading')}>
        <div className="container mx-auto py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
          
          <div className="space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !event) {
    return (
      <DashboardLayout title={t('eventNotFound')} subtitle={t('errorLoadingEvent')}>
        <div className="container mx-auto py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
          
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">{t('eventNotFound')}</h3>
            <p className="mt-2 text-sm text-gray-500">{t('eventMayHaveBeenRemoved')}</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard/events')}>
              {t('viewAllEvents')}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const eventDate = event.date ? new Date(event.date) : new Date();
  const formattedDate = format(eventDate, 'MMMM d, yyyy');
  
  const isAtCapacity = event.max_attendees !== null && event.current_attendees >= event.max_attendees;
  
  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      // In a real app, get the user ID from auth context
      const userId = "current-user-id";
      const result = await registerForEvent(event.id, userId);
      
      if (result.success) {
        setIsRegistered(true);
        toast({
          title: t('registrationSuccessful'),
          description: t('youAreNowRegisteredForThisEvent'),
        });
      } else {
        toast({
          title: t('registrationFailed'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: t('registrationFailed'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleCancelRegistration = async () => {
    setIsRegistering(true);
    try {
      // In a real app, get the user ID from auth context
      const userId = "current-user-id";
      const result = await cancelEventRegistration(event.id, userId);
      
      if (result.success) {
        setIsRegistered(false);
        toast({
          title: t('registrationCanceled'),
          description: t('youAreNoLongerRegisteredForThisEvent'),
        });
      } else {
        toast({
          title: t('cancellationFailed'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast({
        title: t('cancellationFailed'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <DashboardLayout title={event.title} subtitle={event.event_type}>
      <div className="container mx-auto py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>
        
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
              <div className="flex items-center mt-1">
                <Badge className="mr-2 bg-easyroi-gold text-easyroi-navy">
                  {event.event_type}
                </Badge>
                {isAtCapacity && (
                  <Badge variant="destructive">
                    {t('atCapacity')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 mb-6">
            {event.image_url ? (
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-medium mb-4">{t('aboutThisEvent')}</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">{event.description}</p>
              
              <Separator className="my-4" />
              
              <h2 className="text-xl font-medium mb-4">{t('eventDetails')}</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <span>
                    {event.max_attendees 
                      ? `${event.current_attendees}/${event.max_attendees} ${t('attendees')}`
                      : `${event.current_attendees} ${t('attendees')}`
                    }
                  </span>
                </div>
              </div>
              
              {(event.property_id || event.project_id) && (
                <>
                  <Separator className="my-4" />
                  
                  <h2 className="text-xl font-medium mb-4">{t('relatedProperty')}</h2>
                  <p className="text-gray-700">
                    {event.property_id 
                      ? t('thisEventIsRelatedToAProperty') 
                      : t('thisEventIsRelatedToADevelopmentProject')
                    }
                  </p>
                  <Button 
                    className="mt-3" 
                    variant="outline"
                    onClick={() => {
                      if (event.property_id) {
                        // Navigate to property detail
                        // This would need to be implemented
                      } else if (event.project_id) {
                        navigate(`/dashboard/development/${event.project_id}`);
                      }
                    }}
                  >
                    {t('viewDetails')}
                  </Button>
                </>
              )}
            </div>
            
            <div>
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">{t('joinThisEvent')}</h3>
                
                {isRegistered ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-green-800">
                        {t('youAreRegisteredForThisEvent')}
                      </p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled={isRegistering}
                        >
                          {t('cancelRegistration')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('cancelYourRegistration')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('areYouSureYouWantToCancelYourRegistration')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('goBack')}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCancelRegistration}>
                            {t('confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      {isAtCapacity 
                        ? t('thisEventHasReachedCapacity') 
                        : t('joinUsForThisExcitingEvent')
                      }
                    </p>
                    
                    <Button 
                      className="w-full" 
                      disabled={isAtCapacity || isRegistering}
                      onClick={handleRegister}
                    >
                      {isAtCapacity 
                        ? t('eventFull') 
                        : t('registerForEvent')
                      }
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

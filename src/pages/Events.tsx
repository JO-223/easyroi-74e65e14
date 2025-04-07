
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Globe, MapPin, Ticket, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample event data
const upcomingEvents = [
  {
    id: 1,
    title: "Dubai Property Showcase",
    description: "Exclusive showcase of our newest luxury properties in Dubai Marina and Palm Jumeirah.",
    date: "June 15, 2024",
    time: "18:00 - 21:00",
    location: "Armani Hotel, Burj Khalifa, Dubai",
    type: "in-person",
    capacity: "Limited to 50 investors",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Italy Investment Strategy Webinar",
    description: "Learn about new tax incentives and market trends in the Italian luxury real estate sector.",
    date: "June 22, 2024",
    time: "16:00 - 17:30",
    location: "Online (Zoom)",
    type: "online",
    capacity: "Unlimited",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Madrid Networking Reception",
    description: "Connect with fellow investors and our team over cocktails at this exclusive gathering.",
    date: "July 8, 2024",
    time: "19:00 - 22:00",
    location: "Four Seasons Hotel, Madrid",
    type: "in-person",
    capacity: "Limited to 30 investors",
    image: "/placeholder.svg",
  },
];

const pastEvents = [
  {
    id: 101,
    title: "Florence Property Tour",
    description: "Guided tour of our historic property portfolio in Florence's city center.",
    date: "May 10, 2024",
    time: "10:00 - 15:00",
    location: "Florence, Italy",
    type: "in-person",
    image: "/placeholder.svg",
  },
  {
    id: 102,
    title: "Q1 Investment Results Webinar",
    description: "Presentation of Q1 2024 investment results and market outlook.",
    date: "April 15, 2024",
    time: "17:00 - 18:00",
    location: "Online (Zoom)",
    type: "online",
    image: "/placeholder.svg",
  },
];

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleRSVP = (eventId: number, eventTitle: string) => {
    toast({
      title: t('rsvpConfirmed'),
      description: `${t('rsvpConfirmedMsg')} ${eventTitle}`,
    });
  };

  const handleDownloadRecording = (eventId: number) => {
    toast({
      title: t('downloadStarted'),
      description: t('downloadStartedMsg'),
    });
  };

  const EventCard = ({ event, isPast = false }: { event: any, isPast?: boolean }) => (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-100">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge variant={event.type === "online" ? "outline" : "default"} className={event.type === "online" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}>
            {event.type === "online" ? t('online') : t('inPerson')}
          </Badge>
        </div>
        <CardDescription className="mt-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm">
            {event.type === "online" ? (
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
            ) : (
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{event.location}</span>
          </div>
          {!isPast && event.capacity && (
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{event.capacity.includes("Limited") ? 
                `${t('limitedTo')} ${event.capacity.split(" ")[2]} ${t('investors')}` : 
                t('unlimited')}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isPast ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handleDownloadRecording(event.id)}
          >
            <Ticket className="mr-2 h-4 w-4" /> {t('viewDetails')}
          </Button>
        ) : (
          <Button 
            className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90" 
            onClick={() => handleRSVP(event.id, event.title)}
          >
            <Ticket className="mr-2 h-4 w-4" /> {t('rsvp')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <DashboardLayout title={t('events')} subtitle={t('exclusiveEvents')}>
      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">{t('upcomingEvents')}</TabsTrigger>
            <TabsTrigger value="past">{t('pastEvents')}</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            {activeTab === "upcoming" ? upcomingEvents.length : pastEvents.length} {t('eventsFound')}
          </div>
        </div>
        
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Events;

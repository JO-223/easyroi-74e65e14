
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Expert } from "@/types/consultation";

interface ExpertCardProps {
  expert: Expert;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  const t = useTranslation();

  const handleBookConsultation = () => {
    window.open(expert.calendarLink, "_blank", "noopener,noreferrer");
  };

  // Get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-0 pt-6 px-6 flex flex-row items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={expert.imageUrl} alt={expert.name} />
          <AvatarFallback>{getInitials(expert.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{expert.name}</h3>
          <p className="text-sm text-muted-foreground">{expert.role}</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4 flex-grow">
        <p className="text-sm text-muted-foreground">{expert.description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex flex-col items-stretch gap-2">
        <Button onClick={handleBookConsultation} className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          {t('bookConsultation')}
        </Button>
        <a 
          href={expert.calendarLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-center text-muted-foreground hover:underline"
        >
          {t('viewCalendar')}
        </a>
      </CardFooter>
    </Card>
  );
}

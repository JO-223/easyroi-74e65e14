
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Consultant } from "@/types/consultation";
import { CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConsultantCardProps {
  consultant?: Consultant;
  isLoading?: boolean;
}

export function ConsultantCard({ consultant, isLoading = false }: ConsultantCardProps) {
  const t = useTranslation();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!consultant) return null;

  const initials = consultant.name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          {consultant.photoUrl ? (
            <AvatarImage src={consultant.photoUrl} alt={consultant.name} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{consultant.name}</h3>
          <p className="text-sm text-muted-foreground">{consultant.role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm">{consultant.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" asChild>
          <a href={consultant.bookingUrl} target="_blank" rel="noopener noreferrer">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t('bookConsultation')}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchEventReviews, voteReviewHelpful, deleteEventReview } from "@/services/eventReviewService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsUp, Flag, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/ui/empty-state";
import EventReviewDialog from "./EventReviewDialog";

interface EventReviewsListProps {
  eventId: string;
  showAddReviewButton?: boolean;
}

export default function EventReviewsList({
  eventId,
  showAddReviewButton = true
}: EventReviewsListProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  
  const { 
    data: reviews = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['eventReviews', eventId],
    queryFn: () => fetchEventReviews(eventId),
    enabled: !!eventId
  });
  
  const handleVoteHelpful = async (reviewId: string) => {
    if (!user) {
      toast({
        title: t('loginRequired'),
        description: t('pleaseLoginToVote'),
        variant: "default",
      });
      return;
    }
    
    try {
      await voteReviewHelpful(reviewId);
      refetch();
    } catch (error) {
      console.error('Error voting review helpful:', error);
      toast({
        title: t('errorVotingReviewHelpful'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;
    
    if (!confirm(t('confirmDeleteReview'))) return;
    
    try {
      await deleteEventReview(reviewId, user.id);
      toast({
        title: t('reviewDeleted'),
        description: t('reviewDeletedSuccessfully'),
      });
      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: t('errorDeletingReview'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    }
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
      />
    ));
  };
  
  const getUserName = (review: any) => {
    if (review.is_anonymous) {
      return t('anonymousUser');
    }
    return `${review.profiles.first_name} ${review.profiles.last_name}`;
  };
  
  const getAvatarFallback = (review: any) => {
    if (review.is_anonymous) {
      return 'A';
    }
    return `${review.profiles.first_name.charAt(0)}${review.profiles.last_name.charAt(0)}`;
  };
  
  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const count = reviews.filter(review => review.rating === i + 1).length;
    const percentage = reviews.length ? (count / reviews.length * 100) : 0;
    return { rating: i + 1, count, percentage };
  }).reverse();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('eventReviews')}</CardTitle>
            <CardDescription>
              {reviews.length 
                ? t('reviewsCount', { count: reviews.length }) 
                : t('noReviewsYet')}
            </CardDescription>
          </div>
          {showAddReviewButton && user && (
            <Button onClick={() => setIsReviewDialogOpen(true)}>
              {t('writeReview')}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<Star className="w-10 h-10 mb-2" />}
            title={t('noReviewsFound')}
            description={t('noReviewsFoundDescription')}
            actionLabel={showAddReviewButton && user ? t('beTheFirstToReview') : undefined}
            action={showAddReviewButton && user ? () => setIsReviewDialogOpen(true) : undefined}
          />
        ) : (
          <>
            <div className="flex md:gap-8 flex-col md:flex-row mb-6">
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="flex mt-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t('basedOnReviews', { count: reviews.length })}
                </div>
              </div>
              
              <div className="flex-1">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-2 mb-1">
                    <div className="w-20 text-sm">
                      {item.rating} {t('stars')}
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }} 
                      />
                    </div>
                    <div className="w-10 text-sm text-muted-foreground">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex space-x-4">
                  <Avatar className="h-10 w-10">
                    {!review.is_anonymous && review.profiles.avatar_url && (
                      <AvatarImage src={review.profiles.avatar_url} alt={getUserName(review)} />
                    )}
                    <AvatarFallback>{getAvatarFallback(review)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <div className="font-medium mr-2">{getUserName(review)}</div>
                      {!review.is_anonymous && review.profiles.level && (
                        <Badge variant="outline" className="mr-2">
                          {review.profiles.level}
                        </Badge>
                      )}
                      {review.is_verified_attendee && (
                        <Badge variant="secondary">
                          {t('verifiedAttendee')}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {review.review_title && (
                      <div className="font-medium">{review.review_title}</div>
                    )}
                    
                    {review.review_content && (
                      <div className="text-sm text-muted-foreground">
                        {review.review_content}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleVoteHelpful(review.id)}>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {t('helpful')} ({review.helpful_votes})
                      </Button>
                      
                      {user && review.user_id === user.id && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(review.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t('delete')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
      
      <EventReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        eventId={eventId}
        onSuccess={() => {
          setIsReviewDialogOpen(false);
          refetch();
        }}
      />
    </Card>
  );
}

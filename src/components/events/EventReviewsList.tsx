
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "@/services/eventReviewService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Star, Flag, ThumbsUp, AlertOctagon } from "lucide-react";
import { EventReview } from "@/types/eventReview";
import EventReviewDialog from "./EventReviewDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/hooks/useTranslation";

interface EventReviewsListProps {
  eventId: string;
}

export function EventReviewsList({ eventId }: EventReviewsListProps) {
  const { t } = useLanguage();
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  
  const {
    data: reviews = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["eventReviews", eventId],
    queryFn: () => fetchReviews(eventId),
    enabled: !!eventId,
  });

  const handleReviewSubmitted = () => {
    setShowAddReviewModal(false);
    refetch();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map(index => (
          <Card key={index} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{t('eventReviews')}</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowAddReviewModal(true)}
        >
          {t('writeReview')}
        </Button>
      </div>
      
      {reviews.length === 0 ? (
        <EmptyState
          variant="card"
          icon={<Star className="w-10 h-10 mb-2" />}
          title={t('noReviewsYet')}
          description={t('beTheFirstToReview')}
          actionLabel={t('writeReview')}
          action={() => setShowAddReviewModal(true)}
        />
      ) : (
        reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))
      )}
      
      <EventReviewDialog 
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        eventId={eventId}
        onSubmitSuccess={handleReviewSubmitted}
      />
    </div>
  );
}

interface ReviewItemProps {
  review: EventReview;
}

function ReviewItem({ review }: ReviewItemProps) {
  const { t } = useLanguage();
  const [isHelpful, setIsHelpful] = useState(false);
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'PP');
    } catch (e) {
      return dateStr;
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={review.user_avatar || ""} />
            <AvatarFallback>
              {review.is_anonymous
                ? "AN"
                : review.user_name?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">
              {review.is_anonymous ? t('anonymousUser') : review.user_name || t('unknownUser')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {renderStars(review.rating)}
          {review.is_verified_attendee && (
            <span className="ml-2 text-xs bg-green-50 text-green-700 py-1 px-2 rounded-full flex items-center">
              <AlertOctagon className="h-3 w-3 mr-1" />
              {t('verifiedAttendee')}
            </span>
          )}
        </div>
      </div>
      
      {review.review_title && (
        <h4 className="font-semibold mb-1">{review.review_title}</h4>
      )}
      {review.review_content && (
        <p className="text-sm mb-3">{review.review_content}</p>
      )}
      
      <div className="flex justify-between mt-3 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setIsHelpful(!isHelpful)}
        >
          <ThumbsUp
            className={`h-3 w-3 mr-1 ${isHelpful ? "text-easyroi-gold fill-easyroi-gold" : ""}`}
          />
          {t('helpful')} ({review.helpful_votes + (isHelpful ? 1 : 0)})
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <Flag className="h-3 w-3 mr-1" />
          {t('reportReview')}
        </Button>
      </div>
    </Card>
  );
}

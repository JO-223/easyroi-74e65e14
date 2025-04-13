
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Flag, Trash2, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface EventReviewsListProps {
  eventId: string;
}

export default function EventReviewsList({ eventId }: EventReviewsListProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  
  // Here we would fetch reviews from the API
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['eventReviews', eventId],
    queryFn: () => [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // For demo purposes, using static reviews
  const demoReviews = [
    {
      id: "1",
      user_id: "123",
      user_name: "John Smith",
      is_anonymous: false,
      is_verified_attendee: true,
      rating: 5,
      review_title: "Fantastic event!",
      review_content: "This was one of the best investment events I've attended. The speakers were knowledgeable and the networking opportunities were excellent.",
      created_at: "2023-10-15",
      helpful_votes: 12
    },
    {
      id: "2", 
      user_id: "456",
      user_name: "",
      is_anonymous: true,
      is_verified_attendee: true,
      rating: 4,
      review_title: "Very informative",
      review_content: "Good insights on the Dubai property market. Would have appreciated more time for Q&A though.",
      created_at: "2023-10-12",
      helpful_votes: 5
    }
  ];
  
  const handleVoteHelpful = (reviewId: string) => {
    if (!user) {
      toast({
        title: t('loginRequired'),
        description: t('pleaseLoginToVote'),
        variant: "destructive"
      });
      return;
    }
    
    // Would call API here to update helpful votes
    toast({
      title: "Vote registered",
      description: "Thank you for your feedback"
    });
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm(t('confirmDeleteReview'));
    if (!confirmed) return;
    
    try {
      // Would call API here to delete review
      
      toast({
        title: t('reviewDeleted'),
        description: t('reviewDeletedSuccessfully')
      });
      
    } catch (error) {
      toast({
        title: t('errorDeletingReview'),
        description: String(error),
        variant: "destructive"
      });
    }
  };
  
  const toggleExpandReview = (reviewId: string) => {
    if (expandedReviews.includes(reviewId)) {
      setExpandedReviews(expandedReviews.filter(id => id !== reviewId));
    } else {
      setExpandedReviews([...expandedReviews, reviewId]);
    }
  };
  
  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>;
  }
  
  // Using demo reviews instead of real data for now
  const displayReviews = demoReviews; 
  
  const renderUserName = (review: any) => {
    if (review.is_anonymous) {
      return t('anonymousUser');
    }
    return review.user_name;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('eventReviews')}</h3>
        <div className="text-sm text-muted-foreground">
          {displayReviews.length} {t('reviewsCount')}
          {displayReviews.length > 0 && (
            <span className="ml-2">
              ({calculateAverageRating(displayReviews)}/5.0 {t('basedOnReviews')})
            </span>
          )}
        </div>
      </div>
      
      {displayReviews.length > 0 ? (
        <>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= calculateAverageRating(displayReviews) 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm">
              {calculateAverageRating(displayReviews).toFixed(1)} {t('stars')}
            </span>
          </div>
          
          <div className="space-y-4">
            {displayReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <UserAvatar 
                      user={{ name: renderUserName(review) }}
                      className="h-10 w-10"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {renderUserName(review)}
                            {review.is_verified_attendee && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                {t('verifiedAttendee')}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <h4 className="font-medium">{review.review_title}</h4>
                      
                      <p className={`text-gray-600 ${
                        !expandedReviews.includes(review.id) && review.review_content.length > 200
                          ? "line-clamp-3"
                          : ""
                      }`}>
                        {review.review_content}
                      </p>
                      
                      {review.review_content.length > 200 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs" 
                          onClick={() => toggleExpandReview(review.id)}
                        >
                          {expandedReviews.includes(review.id) ? "Show less" : "Read more"}
                        </Button>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteHelpful(review.id)}
                          className="text-xs flex items-center gap-1"
                        >
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          {t('helpful')} ({review.helpful_votes})
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Flag className="h-3.5 w-3.5" />
                            <span className="sr-only">Report</span>
                          </Button>
                          
                          {user && user.id === review.user_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">{t('noReviewsYet')}</h3>
          <p className="text-muted-foreground">{t('noReviewsFoundDescription')}</p>
          <Button variant="outline" className="mt-4" onClick={() => {}}>
            {t('beTheFirstToReview')}
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate average rating
function calculateAverageRating(reviews: any[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

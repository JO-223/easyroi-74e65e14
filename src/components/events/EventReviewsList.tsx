
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EventReview } from "@/types/event";
import { UserAvatar } from "@/components/ui/user-avatar";

interface EventReviewsListProps {
  reviews: EventReview[];
  isLoading?: boolean;
}

export function EventReviewsList({ reviews, isLoading = false }: EventReviewsListProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: EventReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <UserAvatar 
              src={review.is_anonymous ? undefined : review.user_avatar} 
              name={review.is_anonymous ? "Anonymous" : review.user_name || "User"} 
            />
            <div>
              <p className="font-medium">
                {review.is_anonymous ? "Anonymous" : review.user_name || "User"}
              </p>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {review.is_verified_attendee && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Verified Attendee
            </Badge>
          )}
        </div>
        
        {review.review_title && (
          <h4 className="mt-3 font-medium">{review.review_title}</h4>
        )}
        
        {review.review_content && (
          <p className="mt-2 text-gray-600">{review.review_content}</p>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
          {new Date(review.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { submitEventReview } from "@/services/eventReviewService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface EventReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  review_title: z.string().optional(),
  review_content: z.string().optional(),
  rating: z.number().min(1, "Rating is required").max(5),
  is_anonymous: z.boolean().default(false)
});

export default function EventReviewDialog({
  isOpen,
  onClose,
  eventId,
  onSuccess
}: EventReviewDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review_title: "",
      review_content: "",
      rating: 0,
      is_anonymous: false
    }
  });
  
  const rating = form.watch('rating');
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      await submitEventReview(
        {
          event_id: eventId,
          review_title: values.review_title,
          review_content: values.review_content,
          rating: values.rating,
          is_anonymous: values.is_anonymous
        },
        user.id
      );
      
      toast({
        title: t('reviewSubmitted'),
        description: t('thankYouForYourReview'),
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: t('errorSubmittingReview'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('writeReview')}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t('rating')}</FormLabel>
                  <FormControl>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="p-0 focus:outline-none"
                          onMouseEnter={() => setHoveredRating(value)}
                          onMouseLeave={() => setHoveredRating(null)}
                          onClick={() => field.onChange(value)}
                        >
                          <Star
                            className={`h-8 w-8 mx-1 cursor-pointer ${
                              (hoveredRating !== null ? value <= hoveredRating : value <= rating)
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="review_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('reviewTitle')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterReviewTitle')} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="review_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('reviewContent')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('enterReviewContent')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('submitAnonymously')}</FormLabel>
                    <FormDescription>
                      {t('anonymousReviewDescription')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? t('submitting') : t('submitReview')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

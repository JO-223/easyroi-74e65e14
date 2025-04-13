
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { submitEventReview } from "@/services/eventReviewService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";
import { EventReviewFormData } from "@/types/eventReview";

interface EventReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSubmitSuccess: () => void;
}

const formSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  review_title: z.string().optional(),
  review_content: z.string().optional(),
  is_anonymous: z.boolean().default(false),
});

export default function EventReviewDialog({
  isOpen,
  onClose,
  eventId,
  onSubmitSuccess,
}: EventReviewDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      review_title: "",
      review_content: "",
      is_anonymous: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToVote"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: EventReviewFormData = {
        event_id: eventId,
        rating: values.rating,
        review_title: values.review_title,
        review_content: values.review_content,
        is_anonymous: values.is_anonymous,
      };

      await submitEventReview(reviewData, user.id);

      toast({
        title: t("thankYouForYourReview"),
        description: t("reviewSubmitted"),
      });
      
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: t("error"),
        description: t("errorSubmittingReview"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    form.setValue("rating", selectedRating);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("writeReview")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rating")}</FormLabel>
                  <div className="flex items-center space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-8 w-8 cursor-pointer ${
                          value <= (rating || field.value) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`}
                        onClick={() => handleRatingClick(value)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reviewTitle")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterReviewTitle")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reviewContent")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("enterReviewContent")}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("submitAnonymously")}</FormLabel>
                    <FormDescription>
                      {t("anonymousReviewDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || form.getValues().rating === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : t("submitReview")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

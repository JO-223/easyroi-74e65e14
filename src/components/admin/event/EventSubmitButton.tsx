
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Loader2 } from "lucide-react";

interface EventSubmitButtonProps {
  isSubmitting: boolean;
}

export function EventSubmitButton({ isSubmitting }: EventSubmitButtonProps) {
  const { t } = useLanguage();

  return (
    <Button 
      type="submit" 
      className="w-full md:w-auto"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('processing')}
        </>
      ) : (
        <>
          <CalendarCheck className="mr-2 h-4 w-4" />
          {t('addEvent')}
        </>
      )}
    </Button>
  );
}


import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

interface FieldTooltipProps {
  label: string;
  tooltip: string;
  tooltipKey?: string;
}

export function FieldTooltip({ label, tooltip, tooltipKey }: FieldTooltipProps) {
  const { t } = useLanguage();
  
  // If tooltipKey is provided, use it to get a nested translation
  const tooltipText = tooltipKey ? t('tooltip', tooltipKey) : tooltip;

  return (
    <div className="flex items-center gap-1">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger type="button">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

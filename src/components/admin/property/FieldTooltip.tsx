
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { TooltipKey } from "@/utils/translations/tooltip";

interface FieldTooltipProps {
  label: string;
  tooltip: string;
  tooltipKey?: string;
}

export function FieldTooltip({ label, tooltip, tooltipKey }: FieldTooltipProps) {
  const { t } = useLanguage();
  
  // Use the tooltip text directly
  const tooltipText = tooltip;

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


import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  completed: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No timeline events available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="flex">
          <div className="flex flex-col items-center">
            {item.completed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 text-gray-300" />
            )}
            
            {index < items.length - 1 && (
              <div 
                className={cn(
                  "w-0.5 grow my-1", 
                  item.completed ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
          
          <div className="ml-4 pb-5">
            <div className="flex items-baseline justify-between">
              <h4 className={cn(
                "font-medium", 
                item.completed ? "text-green-700" : "text-gray-700"
              )}>
                {item.title}
              </h4>
              <span className="text-xs text-muted-foreground ml-4">
                {item.date}
              </span>
            </div>
            
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

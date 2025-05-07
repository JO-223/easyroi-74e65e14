
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { HelpCategory } from "@/types/help";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HelpCategoryContentProps {
  category: HelpCategory;
}

export function HelpCategoryContent({ category }: HelpCategoryContentProps) {
  if (!category.articles || category.articles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No articles found for this category
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {category.articles.map((article) => (
        <AccordionItem key={article.id} value={article.id}>
          <AccordionTrigger className="text-left">
            {article.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{article.content}</p>
              
              {article.links && article.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.links.map((link, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="flex items-center gap-1"
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.text}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

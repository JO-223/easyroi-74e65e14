
import { HelpArticle } from "@/types/help";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface HelpSearchResultsProps {
  results: HelpArticle[];
  isSearching: boolean;
  searchQuery: string;
}

export function HelpSearchResults({ results, isSearching, searchQuery }: HelpSearchResultsProps) {
  const t = useTranslation();

  if (isSearching) {
    return <div className="py-4 text-center">Cercando...</div>;
  }

  if (searchQuery && results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">{t('noResultsFound')}</p>
      </div>
    );
  }

  if (!searchQuery || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 my-6">
      <h3 className="text-lg font-medium">Risultati per "{searchQuery}"</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((article) => (
          <Card key={article.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2 mb-4">
                {article.content}
              </CardDescription>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

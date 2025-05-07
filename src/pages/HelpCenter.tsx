
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { HelpCategoryTabs } from "@/components/help/HelpCategoryTabs";
import { HelpSearch } from "@/components/help/HelpSearch";
import { HelpSearchResults } from "@/components/help/HelpSearchResults";
import { fetchHelpCategories, searchHelpArticles } from "@/services/helpCenterService";
import { HelpArticle } from "@/types/help";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, HelpCircle, FileQuestion, FileText, BarChart } from "lucide-react";

const HelpCenter = () => {
  const t = useTranslation();
  const [categories, setCategories] = useState<Array<{
    id: string;
    label: any;
    icon: React.ReactNode;
  }>>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would load from the database
        // For now, let's add some mock categories
        setCategories([
          {
            id: "general",
            label: "faqCategories",
            icon: <HelpCircle className="h-4 w-4" />
          },
          {
            id: "payments",
            label: "payments",
            icon: <BarChart className="h-4 w-4" />
          },
          {
            id: "investments",
            label: "investments",
            icon: <FileText className="h-4 w-4" />
          },
          {
            id: "userAccounts",
            label: "userAccounts",
            icon: <FileQuestion className="h-4 w-4" />
          }
        ]);
        
        // Set default active category
        setActiveCategory("general");
      } catch (error) {
        console.error("Error loading help categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchHelpArticles(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching help articles:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DashboardLayout title={t('helpCenter')}>
      <div className="space-y-6">
        <p className="text-muted-foreground">{t('helpCenterDescription')}</p>

        <Card className="bg-muted/50 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5" />
              {t('needMoreHelp')}
            </CardTitle>
            <CardDescription>
              {t('contactSupport')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HelpSearch onSearch={handleSearch} />
          </CardContent>
        </Card>

        <HelpSearchResults 
          results={searchResults} 
          isSearching={isSearching} 
          searchQuery={searchQuery} 
        />

        {!searchQuery && (
          <HelpCategoryTabs 
            categories={categories} 
            isLoading={isLoading}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default HelpCenter;

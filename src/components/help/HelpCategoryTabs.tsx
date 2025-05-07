
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCategory } from "@/types/help";
import { useTranslation } from "@/hooks/useTranslation";
import { HelpCategoryContent } from "./HelpCategoryContent";
import { Skeleton } from "@/components/ui/skeleton";

interface HelpCategoryTabsProps {
  categories: HelpCategory[];
  isLoading: boolean;
}

export function HelpCategoryTabs({ categories, isLoading }: HelpCategoryTabsProps) {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{t('noResultsFound')}</div>;
  }

  return (
    <Tabs
      defaultValue={categories[0]?.id}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-8">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="text-sm md:text-base"
          >
            {t(category.title)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="space-y-4">
          <HelpCategoryContent category={category} />
        </TabsContent>
      ))}
    </Tabs>
  );
}


import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCategoryContent } from "./HelpCategoryContent";
import { HelpKey } from "@/utils/translations/help";
import { HelpCategory } from "@/types/help";
import { Skeleton } from "@/components/ui/skeleton";

interface HelpCategoryProps {
  id: string;
  label: HelpKey;
  icon: React.ReactNode;
}

interface HelpCategoryTabsProps {
  categories: HelpCategoryProps[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isLoading?: boolean;
}

export function HelpCategoryTabs({
  categories,
  activeCategory,
  setActiveCategory,
  isLoading = false,
}: HelpCategoryTabsProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <Tabs
      value={activeCategory}
      onValueChange={setActiveCategory}
      className="w-full"
    >
      <TabsList className="h-auto flex flex-nowrap overflow-x-auto scrollbar-hide mb-6 bg-transparent gap-2">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="px-4 py-2 data-[state=active]:bg-easyroi-gold/20"
          >
            <span className="flex items-center gap-2">
              {category.icon}
              <span className="whitespace-nowrap">{t(category.label)}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="pt-2">
          <HelpCategoryContent category={{ 
            id: category.id, 
            title: t(category.label), 
            articles: [] 
          }} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

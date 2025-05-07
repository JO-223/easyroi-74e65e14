
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { ConsultantsList } from "./ConsultantsList";
import { ExpertType } from "@/types/consultation";

export function ConsultationTabs() {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<ExpertType>("investment");

  return (
    <Tabs defaultValue="investment" value={activeTab} onValueChange={(value) => setActiveTab(value as ExpertType)} className="w-full">
      <div className="mb-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="investment">{t('investmentExperts')}</TabsTrigger>
          <TabsTrigger value="legal">{t('legalAssistance')}</TabsTrigger>
          <TabsTrigger value="tax">{t('taxConsulting')}</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="investment">
        <ConsultantsList type="investment" />
      </TabsContent>
      
      <TabsContent value="legal">
        <ConsultantsList type="legal" />
      </TabsContent>
      
      <TabsContent value="tax">
        <ConsultantsList type="tax" />
      </TabsContent>
    </Tabs>
  );
}

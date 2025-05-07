
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { InvestmentTable } from "./InvestmentTable";
import { Investment } from "@/types/investment";

interface InvestmentTabsProps {
  investments: Investment[];
}

export function InvestmentTabs({ investments }: InvestmentTabsProps) {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState("secondary");

  const secondaryInvestments = investments.filter(investment => investment.type === 'secondary');
  const offPlanInvestments = investments.filter(investment => investment.type === 'offPlan');
  const clubDealInvestments = investments.filter(investment => investment.type === 'clubDeal');

  return (
    <Tabs defaultValue="secondary" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="mb-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="secondary">{t('secondary')}</TabsTrigger>
          <TabsTrigger value="offPlan">{t('offPlan')}</TabsTrigger>
          <TabsTrigger value="clubDeal">{t('clubDeal')}</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="secondary">
        <InvestmentTable 
          investments={secondaryInvestments} 
          type="secondary" 
        />
      </TabsContent>
      
      <TabsContent value="offPlan">
        <InvestmentTable 
          investments={offPlanInvestments} 
          type="offPlan" 
        />
      </TabsContent>
      
      <TabsContent value="clubDeal">
        <InvestmentTable 
          investments={clubDealInvestments} 
          type="clubDeal" 
          showExtendedColumns={true}
        />
      </TabsContent>
    </Tabs>
  );
}

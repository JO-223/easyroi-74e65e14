
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { ExpertsList } from "./ExpertsList";
import { Expert } from "@/types/consultation";

export function ConsultationTabs() {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState("investment");

  // Mock data for experts in different categories
  const investmentExperts: Expert[] = [
    {
      id: "1",
      name: "Marco Rossi",
      role: t('investmentExpert'),
      description: t('investmentExpertDesc'),
      imageUrl: "/lovable-uploads/c6fb964a-ed49-478a-88c3-5d395e52f920.png",
      calendarLink: "https://calendly.com/example/investment-consultation"
    },
    {
      id: "2",
      name: "Sofia Bianchi",
      role: t('investmentAdvisor'),
      description: t('investmentAdvisorDesc'),
      imageUrl: "/lovable-uploads/8f62e7e7-e2ac-4ee6-bfee-3019052700d0.png",
      calendarLink: "https://calendly.com/example/investment-strategy"
    }
  ];
  
  const legalExperts: Expert[] = [
    {
      id: "3",
      name: "Giuseppe Verdi",
      role: t('legalAdvisor'),
      description: t('legalAdvisorDesc'),
      imageUrl: "/lovable-uploads/9496436e-cc5e-4188-9411-1dea4b718fc3.png",
      calendarLink: "https://calendly.com/example/legal-consultation"
    },
    {
      id: "4",
      name: "Giulia Romano",
      role: t('propertyLawyer'),
      description: t('propertyLawyerDesc'),
      imageUrl: "/lovable-uploads/f030c164-2df3-4c76-bc3d-6c506d59a005.png",
      calendarLink: "https://calendly.com/example/property-law"
    }
  ];
  
  const taxExperts: Expert[] = [
    {
      id: "5",
      name: "Lorenzo Ferrari",
      role: t('taxConsultant'),
      description: t('taxConsultantDesc'),
      imageUrl: "/lovable-uploads/c6fb964a-ed49-478a-88c3-5d395e52f920.png",
      calendarLink: "https://calendly.com/example/tax-planning"
    },
    {
      id: "6",
      name: "Elena Marino",
      role: t('internationalTaxExpert'),
      description: t('internationalTaxExpertDesc'),
      imageUrl: "/lovable-uploads/8f62e7e7-e2ac-4ee6-bfee-3019052700d0.png",
      calendarLink: "https://calendly.com/example/international-tax"
    }
  ];

  return (
    <Tabs defaultValue="investment" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="mb-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="investment">{t('investmentExperts')}</TabsTrigger>
          <TabsTrigger value="legal">{t('legalAssistance')}</TabsTrigger>
          <TabsTrigger value="tax">{t('taxConsultation')}</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="investment">
        <ExpertsList experts={investmentExperts} category="investment" />
      </TabsContent>
      
      <TabsContent value="legal">
        <ExpertsList experts={legalExperts} category="legal" />
      </TabsContent>
      
      <TabsContent value="tax">
        <ExpertsList experts={taxExperts} category="tax" />
      </TabsContent>
    </Tabs>
  );
}

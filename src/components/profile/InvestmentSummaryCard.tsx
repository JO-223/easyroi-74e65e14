
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/services/dashboard/dashboardService";
import { useLanguage } from "@/contexts/LanguageContext";

type SummaryItem = {
  label: string;
  value: string;
};

const InvestmentSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [investmentData, setInvestmentData] = useState({
    properties: "0",
    totalValue: "€0",
    averageROI: "0%",
    yearsInvesting: "0"
  });
  const { t } = useLanguage();

  useEffect(() => {
    async function loadInvestmentData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // Get user properties directly
        const { data: properties } = await supabase
          .from('properties')
          .select('price, roi_percentage')
          .eq('user_id', user.id);
        
        const propertyCount = properties?.length || 0;
        
        // Calculate total value from actual properties
        const totalInvestment = properties?.reduce((sum, property) => 
          sum + Number(property.price || 0), 0) || 0;
        
        // Calculate average ROI from actual properties
        let averageRoi = 0;
        if (properties && properties.length > 0) {
          averageRoi = properties.reduce((sum, property) => 
            sum + Number(property.roi_percentage || 0), 0) / properties.length;
        }
        
        // Get user join date to calculate years investing
        const { data: profileData } = await supabase
          .from('profiles')
          .select('join_date')
          .eq('id', user.id)
          .single();
        
        // Safely parse the join date
        let joinDate = new Date();
        if (profileData?.join_date) {
          joinDate = new Date(profileData.join_date as string);
        }
        
        const currentDate = new Date();
        const yearsInvesting = Math.max(
          Math.floor((currentDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)),
          1
        ); // Minimum 1 year
        
        // Update investment data in user_investments table
        if (totalInvestment > 0) {
          await supabase.rpc(
            'update_user_investment',
            {
              p_user_id: user.id,
              p_investment_amount: totalInvestment
            }
          );
        }
        
        setInvestmentData({
          properties: propertyCount.toString(),
          totalValue: formatCurrency(totalInvestment),
          averageROI: `${averageRoi.toFixed(1)}%`,
          yearsInvesting: yearsInvesting.toString()
        });
      } catch (error) {
        console.error("Error loading investment summary:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInvestmentData();
  }, []);

  const investmentSummary = [
    { label: t('totalProperties'), value: investmentData.properties },
    { label: t('portfolioValue'), value: investmentData.totalValue },
    { label: t('averageROI'), value: investmentData.averageROI },
    { label: t('yearsInvesting'), value: investmentData.yearsInvesting }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('investmentSummary')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-easyroi-navy" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investmentSummary')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {investmentSummary.map((item) => (
            <div key={item.label} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => window.location.href = '/dashboard/properties'}>
          <Building2 className="mr-2 h-4 w-4" /> {t('viewAllProperties')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;

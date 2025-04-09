
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

  useEffect(() => {
    async function loadInvestmentData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // Get user properties count
        const { data: propertyData } = await supabase
          .from('user_properties')
          .select('count')
          .eq('user_id', user.id)
          .single();
        
        // Get user investment total
        const { data: investmentData } = await supabase
          .from('user_investments')
          .select('total_investment')
          .eq('user_id', user.id)
          .single();
        
        // Get user ROI
        const { data: roiData } = await supabase
          .from('user_roi')
          .select('average_roi')
          .eq('user_id', user.id)
          .single();
        
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
        
        setInvestmentData({
          properties: propertyData?.count?.toString() || "0",
          totalValue: formatCurrency(Number(investmentData?.total_investment || 0)),
          averageROI: `${roiData?.average_roi || 0}%`,
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
    { label: "Total Properties", value: investmentData.properties },
    { label: "Portfolio Value", value: investmentData.totalValue },
    { label: "Average ROI", value: investmentData.averageROI },
    { label: "Years Investing", value: investmentData.yearsInvesting }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
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
        <CardTitle>Investment Summary</CardTitle>
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
          <Building2 className="mr-2 h-4 w-4" /> View All Properties
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;

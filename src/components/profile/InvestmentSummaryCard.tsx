
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { BadgeLevel } from "@/components/ui/badge-level";
import { supabase } from "@/integrations/supabase/client";
import { UserInvestment } from "@/types/property";
import { calculateRequiredForNextLevel } from "@/services/investmentService";
import { Progress } from "@/components/ui/progress";

type SummaryItemProps = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

const SummaryItem = ({ label, value, className = "" }: SummaryItemProps) => (
  <div className={`text-center p-3 bg-gray-50 rounded-lg ${className}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <div className="text-xl font-bold mt-1">{value}</div>
  </div>
);

const InvestmentSummary = () => {
  const [investment, setInvestment] = useState<UserInvestment | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('user_investments')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching investment:", error);
          } else if (data) {
            setInvestment({
              id: data.id,
              user_id: data.user_id,
              total_investment: data.total_investment,
              last_updated: data.last_updated
            });
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestmentData();
  }, []);
  
  // Calculate next level information
  const nextLevelInfo = investment 
    ? calculateRequiredForNextLevel(investment.total_investment) 
    : { nextLevel: 'silver', required: 500000 };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!investment) return 0;
    
    const { nextLevel, required } = nextLevelInfo;
    if (!nextLevel) return 100; // Already at max level
    
    let currentLevelMin = 0;
    
    // Determine base level for current investment
    if (investment.total_investment > 5000000) currentLevelMin = 5000000;
    else if (investment.total_investment > 2500000) currentLevelMin = 2500000;
    else if (investment.total_investment > 1000000) currentLevelMin = 1000000;
    else if (investment.total_investment > 500000) currentLevelMin = 500000;
    
    // Calculate progress to next level
    const nextLevelThreshold = currentLevelMin + required;
    const progress = ((investment.total_investment - currentLevelMin) / (nextLevelThreshold - currentLevelMin)) * 100;
    
    return progress;
  };

  const investmentSummary = [
    { 
      label: "Total Investment", 
      value: loading 
        ? "Loading..." 
        : investment
          ? `€${investment.total_investment.toLocaleString('it-IT')}`
          : "€0"
    },
    { 
      label: "Investor Level", 
      value: loading 
        ? "Loading..." 
        : investment
          ? <BadgeLevel 
              level={
                investment.total_investment > 20000000 ? 'cosmic' :
                investment.total_investment > 5000000 ? 'diamond' :
                investment.total_investment > 2500000 ? 'platinum' :
                investment.total_investment > 1000000 ? 'gold' :
                investment.total_investment > 500000 ? 'silver' :
                'bronze'
              } 
            />
          : <BadgeLevel level="bronze" />
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Investment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {investmentSummary.map((item) => (
            <SummaryItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
        
        {!loading && nextLevelInfo.nextLevel && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Current Level</span>
              <span>Next: <span className="font-medium capitalize">{nextLevelInfo.nextLevel}</span></span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <p className="text-sm text-gray-500 mt-2 text-center">
              €{nextLevelInfo.required.toLocaleString('it-IT')} needed for next level
            </p>
          </div>
        )}
        
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Building2 className="mr-2 h-4 w-4" /> View All Properties
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;

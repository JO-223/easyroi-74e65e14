
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

type SummaryItemProps = {
  label: string;
  value: string;
};

const InvestmentSummary = () => {
  const investmentSummary = [
    { label: "Total Properties", value: "6" },
    { label: "Portfolio Value", value: "€2,450,000" },
    { label: "Average ROI", value: "7.4%" },
    { label: "Years Investing", value: "3" },
  ];

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
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Building2 className="mr-2 h-4 w-4" /> View All Properties
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;

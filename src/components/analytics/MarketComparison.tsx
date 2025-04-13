
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MarketComparisonData {
  value: number;
  status: 'above' | 'below';
}

interface MarketComparisonProps {
  data: MarketComparisonData;
}

export const MarketComparison = ({ data }: MarketComparisonProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('marketComparison')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <p className="text-lg font-medium mb-2">
            {t('yourPortfolioIs')}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant={data.status === 'above' ? 'default' : 'secondary'} className="text-xl py-2 px-4">
              {data.status === 'above' ? (
                <ArrowUp className="mr-1 h-5 w-5" />
              ) : (
                <ArrowDown className="mr-1 h-5 w-5" />
              )}
              {data.value}%
            </Badge>
            <span className="text-xl font-semibold">
              {data.status === 'above' ? t('aboveMarket') : t('belowMarket')}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground max-w-md text-center">
          <p>
            {data.status === 'above' 
              ? t('portfolioOutperformingMarket') 
              : t('portfolioUnderperformingMarket')
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

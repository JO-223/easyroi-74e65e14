
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export function MarketComparison() {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div>This is a placeholder for the Market Comparison component</div>
      </CardContent>
    </Card>
  );
}

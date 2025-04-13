
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const LEVEL_THRESHOLDS = {
  starter: 0,
  bronze: 300000,
  silver: 750000,
  gold: 1500000,
  ruby: 3000000,
  emerald: 6000000,
  platinum: 10000000,
  diamond: 20000000,
};

type LevelKey = keyof typeof LEVEL_THRESHOLDS;

export function UserLevelCard() {
  const { t } = useLanguage();
  const { userLevel, isLoading: isLoadingLevel } = useUserLevel();
  
  const { data: investmentData, isLoading: isLoadingInvestment } = useQuery({
    queryKey: ['userInvestment'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalInvestment: 0 };
      
      const { data, error } = await supabase
        .from('user_investments')
        .select('total_investment')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user investment:', error);
        return { totalInvestment: 0 };
      }
      
      return { totalInvestment: data?.total_investment || 0 };
    },
  });
  
  const isLoading = isLoadingLevel || isLoadingInvestment;
  const totalInvestment = investmentData?.totalInvestment || 0;
  
  const getCurrentLevel = () => {
    if (!userLevel) return 'starter' as LevelKey;
    return userLevel as LevelKey;
  };
  
  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const levels = Object.keys(LEVEL_THRESHOLDS) as LevelKey[];
    const currentIndex = levels.indexOf(currentLevel);
    
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    
    return null;
  };
  
  const nextLevel = getNextLevel();
  const currentLevel = getCurrentLevel();
  
  const calculateProgress = () => {
    if (!nextLevel) return 100;
    
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
    const nextThreshold = LEVEL_THRESHOLDS[nextLevel];
    const range = nextThreshold - currentThreshold;
    const progress = ((totalInvestment - currentThreshold) / range) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}k`;
    }
    return `€${value}`;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investorLevel')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <UserBadge level={currentLevel} size="lg" />
          <span className="text-sm font-medium">
            {formatCurrency(totalInvestment)}
          </span>
        </div>
        
        {nextLevel && (
          <>
            <Progress 
              value={calculateProgress()} 
              className="h-2 mb-2" 
            />
            
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{formatCurrency(LEVEL_THRESHOLDS[currentLevel])}</span>
              <div className="flex items-center gap-1">
                <span>{t('nextLevel')}:</span>
                <UserBadge 
                  level={nextLevel} 
                  size="sm" 
                  showIcon={false}
                  className="ml-1" 
                />
                <span>({formatCurrency(LEVEL_THRESHOLDS[nextLevel])})</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

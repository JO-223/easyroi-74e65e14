
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeLevel } from "@/components/ui/badge-level";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";

interface UserLevelCardProps {
  className?: string;
}

const levelThresholds = {
  starter: 0,
  bronze: 300000,
  silver: 750000,
  gold: 1500000,
  ruby: 3000000,
  emerald: 6000000,
  platinum: 10000000,
  diamond: 20000000,
};

export const UserLevelCard = ({ className }: UserLevelCardProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [level, setLevel] = useState<string>("bronze");
  const [nextLevel, setNextLevel] = useState<string>("silver");
  const [progress, setProgress] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);

  useEffect(() => {
    const fetchUserLevel = async () => {
      if (!user) return;

      try {
        // Fetch user profile to get current level
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("level")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user's total investment directly from properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('price')
          .eq('user_id', user.id);

        if (propertiesError) throw propertiesError;

        // Calculate total investment from properties
        const total = propertiesData?.reduce((sum, property) => 
          sum + Number(property.price || 0), 0) || 0;
        
        setTotalInvestment(total);
        
        // Use type assertion to handle the unknown type
        const currentLevel = (profileData?.level as string) || "bronze";
        setLevel(currentLevel);

        // Determine next level
        const levels = Object.keys(levelThresholds);
        const currentIndex = levels.indexOf(currentLevel);
        const nextLevelKey = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : levels[currentIndex];
        setNextLevel(nextLevelKey);

        // Calculate progress
        const currentThreshold = levelThresholds[currentLevel as keyof typeof levelThresholds] || 0;
        const nextThreshold = levelThresholds[nextLevelKey as keyof typeof levelThresholds] || levelThresholds.diamond;

        if (currentIndex < levels.length - 1) {
          const progressPercent = ((total - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
          setProgress(Math.min(Math.max(progressPercent, 0), 100));
        } else {
          setProgress(100); // Max level reached
        }
      } catch (error) {
        console.error("Error fetching user level data:", error);
      }
    };

    fetchUserLevel();
  }, [user]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('investorLevel')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <BadgeLevel level={level as any} />
            <Link
              to="/dashboard/investor-levels"
              className="text-xs text-blue-500 hover:underline"
            >
              {t('viewAllLevels')}
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{level}</span>
              <span>{nextLevel}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="pt-2">
            <div className="text-sm font-medium">{t('totalInvestment')}</div>
            <div className="text-2xl font-bold">{formatCurrency(totalInvestment)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

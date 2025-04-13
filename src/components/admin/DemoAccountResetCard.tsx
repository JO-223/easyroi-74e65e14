
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, RefreshCw } from "lucide-react";
import { useDemoAccountReset, checkDemoPlatinumAccount } from "@/services/admin/demoAccountService";

export const DemoAccountResetCard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { resetDemoAccount } = useDemoAccountReset();
  const [isLoading, setIsLoading] = useState(false);
  const [demoUserExists, setDemoUserExists] = useState<boolean | null>(null);
  
  // Verifica se l'utente demo esiste quando il componente viene caricato
  React.useEffect(() => {
    const checkDemoUser = async () => {
      const result = await checkDemoPlatinumAccount();
      setDemoUserExists(result.exists);
    };
    
    checkDemoUser();
  }, []);
  
  const handleResetDemoAccount = async () => {
    try {
      setIsLoading(true);
      await resetDemoAccount();
    } catch (error) {
      console.error("Error resetting demo account:", error);
      toast({
        title: t('error'),
        description: t('errorResettingDemoAccount'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-easyroi-gold" />
          {t('demoAccountManagement')}
        </CardTitle>
        <CardDescription>
          {t('demoAccountDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">{t('status')}</p>
              <p className="text-lg font-semibold">
                {demoUserExists === null ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('checking')}
                  </span>
                ) : demoUserExists ? (
                  <span className="text-green-600">{t('active')}</span>
                ) : (
                  <span className="text-amber-600">{t('notConfigured')}</span>
                )}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">{t('accountType')}</p>
              <p className="text-lg font-semibold">{t('platinumInvestor')}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-700 mb-1">{t('note')}</h3>
            <p className="text-sm text-blue-600">
              {t('demoAccountNote')}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-gray-500">
          {t('lastReset')}: {new Date().toLocaleDateString()}
        </div>
        <Button 
          onClick={handleResetDemoAccount}
          disabled={isLoading || !demoUserExists}
          className="bg-easyroi-navy hover:bg-easyroi-navy/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('resetting')}
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('resetDemoAccount')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

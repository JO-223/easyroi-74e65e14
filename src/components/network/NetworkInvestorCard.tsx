
import React from "react";
import { MessageCircle, UserPlus, UserMinus, AlertCircle, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeLevel } from "@/components/ui/badge-level";
import { NetworkInvestor } from "@/services/network/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface NetworkInvestorCardProps {
  investor: NetworkInvestor;
  onConnect: (investorId: string, investorName: string) => void;
  onDisconnect: (investorId: string, investorName: string) => void;
  onMessage: (investorId: string, investorName: string) => void;
}

export function NetworkInvestorCard({ 
  investor, 
  onConnect, 
  onDisconnect, 
  onMessage 
}: NetworkInvestorCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card key={investor.id} className="overflow-hidden">
      <div className="flex justify-end p-3">
        <BadgeLevel level={investor.level as any} />
      </div>
      <CardHeader className="pt-0">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
            <img
              src={investor.avatar_url || '/placeholder.svg'}
              alt={investor.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{investor.name}</CardTitle>
            <CardDescription>{investor.role || t('investor')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {investor.location && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{investor.location}</span>
            </div>
          )}
          <div className="mt-3">
            <p className="text-sm text-gray-600">{investor.bio || t('noBioAvailable')}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={() => onMessage(investor.id, investor.name)}
        >
          <MessageCircle className="mr-2 h-4 w-4" /> {t('message')}
        </Button>
        {investor.connection_status === 'connected' ? (
          <Button 
            variant="outline"
            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDisconnect(investor.id, investor.name)}
          >
            <UserMinus className="mr-2 h-4 w-4" /> {t('disconnect')}
          </Button>
        ) : investor.connection_status === 'pending' ? (
          <Button 
            disabled
            className="flex-1 bg-slate-100 text-slate-500"
          >
            <AlertCircle className="mr-2 h-4 w-4" /> {t('pending')}
          </Button>
        ) : (
          <Button 
            className="flex-1 bg-easyroi-navy hover:bg-easyroi-navy/90" 
            onClick={() => onConnect(investor.id, investor.name)}
          >
            <UserPlus className="mr-2 h-4 w-4" /> {t('connect')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

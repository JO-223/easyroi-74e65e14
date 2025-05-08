
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

type Alert = {
  id: string;
  title: string;
  message: string;
  propertyId?: string;
  read: boolean;
  createdAt: string;
};

export function AlertsDropdown() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Mock alerts data
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'New Investment Opportunity',
      message: 'New luxury property available in Milan',
      propertyId: 'abc123',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Price Drop Alert',
      message: 'Price reduced by 5% on Dubai Marina property',
      propertyId: 'def456',
      read: false,
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ]);

  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  const handleAlertClick = (propertyId?: string) => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AlertTriangle className="h-5 w-5 text-easyroi-navy" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">{t('investmentAlerts')}</h3>
          {unreadCount > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              {unreadCount} {t('new')}
            </Badge>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-auto">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <DropdownMenuItem 
                key={alert.id}
                className={`px-4 py-3 cursor-pointer flex items-start ${!alert.read ? 'bg-amber-50' : ''}`}
                onClick={() => handleAlertClick(alert.propertyId)}
              >
                <div className="mr-3 mt-1">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Home className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${!alert.read ? 'text-amber-800' : 'text-black'}`}>
                    {alert.title}
                  </p>
                  <p className="text-xs text-black mt-0.5">{alert.message}</p>
                  <p className="text-xs text-black mt-1">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-black mt-2" />
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-black text-sm">
                {t('noAlerts')}
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t p-2">
          <Button 
            variant="link" 
            size="sm" 
            className="w-full justify-center text-amber-600"
            onClick={() => navigate('/alerts')}
          >
            {t('viewAllAlerts')}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

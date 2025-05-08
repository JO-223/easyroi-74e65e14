
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight, MessageSquare, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'connection' | 'system';
  read: boolean;
  createdAt: string;
};

export function NotificationDropdown() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Mock notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New message',
      message: 'You received a new message from Marco Rossi',
      type: 'message',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Connection request',
      message: 'Laura Bianchi wants to connect with you',
      type: 'connection',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: '3',
      title: 'System notification',
      message: 'Your account has been upgraded to Gold level',
      type: 'system',
      read: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    }
  ]);

  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'connection':
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-easyroi-navy" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-easyroi-gold">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">{t('notifications')}</h3>
          {unreadCount > 0 && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {unreadCount} {t('new')}
            </Badge>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <DropdownMenuItem 
                key={notification.id}
                className={`px-4 py-3 cursor-pointer flex items-start border border-transparent ${
                  !notification.read ? 'bg-blue-50' : ''
                } hover:border-amber-500 hover:bg-transparent focus:bg-transparent focus:border-amber-500 transition-colors`}
              >
                <div className="mr-3 mt-1">
                  <div className={`h-8 w-8 rounded-full ${
                    notification.type === 'message' ? 'bg-blue-100' : 
                    notification.type === 'connection' ? 'bg-green-100' : 'bg-gray-100'
                  } flex items-center justify-center`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-800'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 mt-2" />
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500 text-sm">
                {t('noNotifications')}
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t p-2">
          <Button 
            variant="link" 
            size="sm" 
            className="w-full justify-center text-easyroi-navy"
            onClick={() => navigate('/notifications')}
          >
            {t('viewAllNotifications')}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

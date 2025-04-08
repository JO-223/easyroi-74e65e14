
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNotifications, markNotificationsAsRead } from "@/services/network";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const notificationData = await getNotifications();
      setNotifications(notificationData);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    const unreadNotificationIds = notifications
      .filter(notification => !notification.read)
      .map(notification => notification.id);

    if (unreadNotificationIds.length === 0) return;

    try {
      const success = await markNotificationsAsRead(unreadNotificationIds);
      
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({
            ...notification,
            read: true
          }))
        );
        
        toast({
          title: t('notificationsMarkedAsRead'),
          description: t('allNotificationsMarkedAsRead')
        });
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast({
        title: t('error'),
        description: t('errorMarkingNotificationsAsRead'),
        variant: "destructive"
      });
    }
  };

  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "connection_request":
        return "👋";
      case "connection_accepted":
        return "✅";
      case "new_message":
        return "💬";
      default:
        return "📣";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={t('notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white" 
              variant="outline"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>{t('notifications')}</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={handleMarkAsRead}
            >
              {t('markAllAsRead')}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {t('noNotifications')}
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="cursor-default">
                  <div className={`p-2 w-full ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex gap-2 items-start">
                      <div className="text-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatNotificationTime(notification.created_at)}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

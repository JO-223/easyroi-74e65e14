
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Calendar, Construction, Home, LogOut, Settings, UserCircle, Users } from 'lucide-react';
import { BadgeLevel } from '@/components/ui/badge-level';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface UserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  level?: string | null;
}

interface SidebarNavProps {
  userData?: UserProfileData;
}

export function SidebarNav({ userData }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const items = [
    {
      title: t('dashboard'),
      href: '/dashboard',
      icon: Home
    }, 
    {
      title: t('properties'),
      href: '/dashboard/properties',
      icon: Building2
    }, 
    {
      title: t('development'),
      href: '/dashboard/development',
      icon: Construction
    }, 
    {
      title: t('analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3
    }, 
    {
      title: t('events'),
      href: '/dashboard/events',
      icon: Calendar
    }, 
    {
      title: t('network'),
      href: '/dashboard/network',
      icon: Users
    }, 
    {
      title: t('profile'),
      href: '/dashboard/profile',
      icon: UserCircle
    }, 
    {
      title: t('settings'),
      href: '/dashboard/settings',
      icon: Settings
    }
  ];
  
  const initials = userData && userData.firstName && userData.lastName 
    ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
    : "U";
    
  const displayName = userData && userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : "User";
    
  const email = userData?.email || "";

  return (
    <div className="flex flex-col h-full text-sidebar-foreground bg-easyroi-navy">
      <div className="px-3 py-2">
        <div className="bg-sidebar-accent/50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-easyroi-gold flex items-center justify-center">
              <span className="font-bold text-easyroi-navy">{initials}</span>
            </div>
            <div>
              <p className="font-medium leading-none text-white">{displayName}</p>
              <p className="text-xs leading-none text-gray-300 mt-1">{email}</p>
            </div>
          </div>
          <div className="mt-3">
            <BadgeLevel level={userData?.level as any || "bronze"} />
          </div>
        </div>
      </div>
      <nav className="space-y-1 px-3 flex-1">
        {items.map(item => {
          // Check if current path starts with item.href to highlight nested routes
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              to={item.href} 
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors", 
                isActive 
                  ? "bg-sidebar-accent text-easyroi-gold" 
                  : "text-sidebar-foreground hover:text-easyroi-gold hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md text-white">
          <span>{t('language')}</span>
          <LanguageSwitcher variant="minimal" className="text-white hover:bg-sidebar-accent/50" />
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:text-easyroi-gold hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}

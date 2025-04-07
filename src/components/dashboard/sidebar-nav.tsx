
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Calendar, Home, Settings, UserCircle, Users } from 'lucide-react';
import { BadgeLevel } from '@/components/ui/badge-level';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';

export function SidebarNav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const items = [
    {
      title: t('dashboard'),
      href: '/dashboard',
      icon: Home,
    },
    {
      title: t('properties'),
      href: '/dashboard/properties',
      icon: Building2,
    },
    {
      title: t('analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      title: t('events'),
      href: '/dashboard/events',
      icon: Calendar,
    },
    {
      title: t('network'),
      href: '/dashboard/network',
      icon: Users,
    },
    {
      title: t('profile'),
      href: '/dashboard/profile',
      icon: UserCircle,
    },
    {
      title: t('settings'),
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];
  
  return (
    <div className="flex flex-col h-full">
      <div className="py-2">
        <div className="px-3 py-2">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" 
              alt="EasyROI Logo" 
              className="h-10" 
            />
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="bg-sidebar-accent/50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-easyroi-gold flex items-center justify-center">
              <span className="font-bold text-easyroi-navy">JD</span>
            </div>
            <div>
              <p className="font-medium leading-none text-white">John Doe</p>
              <p className="text-xs leading-none text-gray-300 mt-1">john@example.com</p>
            </div>
          </div>
          <div className="mt-3">
            <BadgeLevel level="gold" />
          </div>
        </div>
      </div>
      <nav className="space-y-1 px-3 flex-1">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
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
          )
        })}
      </nav>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md text-white">
          <span>{t('language')}</span>
          <LanguageSwitcher variant="minimal" className="text-white hover:bg-sidebar-accent/50" />
        </div>
        <Link
          to="/logout"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:text-easyroi-gold hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <span>{t('logout')}</span>
        </Link>
      </div>
    </div>
  );
}

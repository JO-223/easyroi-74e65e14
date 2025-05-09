
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Calendar, Construction, Home, LogOut, Shield, UserCircle, Award, FileSpreadsheet } from 'lucide-react';
import { BadgeLevel } from '@/components/ui/badge-level';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminRole } from "@/hooks/use-admin-role";
import { NavItem } from '@/types';
import { InvestorKey } from "@/utils/translations/investor";
import { useTranslation } from "@/hooks/useTranslation";

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
  const t = useTranslation();
  const { isAdmin } = useAdminRole();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const items: NavItem[] = [
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
      title: 'Off-Plan',
      href: '/dashboard/development',
      icon: Construction
    }, 
    {
      title: 'Cashflow Tracker',
      href: '/dashboard/cashflow',
      icon: FileSpreadsheet
    },
    {
      title: t('events'),
      href: '/dashboard/events',
      icon: Calendar
    },
    {
      title: t('investorLevels' as InvestorKey),
      href: '/dashboard/investor-levels',
      icon: Award
    },
    {
      title: t('consultations'),
      href: '/dashboard/consultations',
      icon: UserCircle
    },
    {
      title: t('profile'),
      href: '/dashboard/profile',
      icon: UserCircle
    }
    // Settings page removed from navigation
  ];

  // Add admin panel link if user is admin
  if (isAdmin) {
    items.push({
      title: t('adminPanel'),
      href: '/admin',
      icon: Shield,
      adminOnly: true
    });
  }
  
  // Show skeleton during loading
  if (!userData || !userData.firstName) {
    return (
      <div className="flex flex-col h-full text-sidebar-foreground bg-easyroi-navy">
        <div className="px-3 py-2">
          <div className="bg-sidebar-accent/50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="mt-3">
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
        {/* Skeleton nav items */}
        <nav className="space-y-1 px-3 flex-1">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md my-1" />
          ))}
        </nav>
      </div>
    );
  }
  
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
              <p className="text-xs leading-none text-gray-300 mt-1 truncate max-w-32">{email}</p>
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
          
          // Add a special style for admin links
          const isAdminLink = item.adminOnly;
          
          return (
            <Link 
              key={item.href} 
              to={item.href} 
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors", 
                isActive 
                  ? "bg-sidebar-accent text-easyroi-gold" 
                  : "text-sidebar-foreground hover:text-easyroi-gold hover:bg-sidebar-accent/50",
                isAdminLink && "border border-easyroi-gold/40 bg-sidebar-accent/30"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isAdminLink && "text-easyroi-gold")} />
              <span className="truncate">{item.title}</span>
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

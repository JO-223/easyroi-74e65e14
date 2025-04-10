
import { useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, Settings, UserCircle, Building, BarChart3, HandCoins, 
  CalendarDays, Users, MessagesSquare, BriefcaseBusiness, ShieldAlert, TestTube
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavItem } from "@/types";
import { useAdminRole } from "@/hooks/use-admin-role";

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  level: string | null;
  id?: string;
}

interface SidebarNavProps {
  userData?: UserProfileData;
}

export function SidebarNav({ userData }: SidebarNavProps) {
  const { isOpen, toggleSidebar } = useSidebar();
  const { session, signOut } = useAuth();
  const { t } = useLanguage();
  const { isAdmin } = useAdminRole();

  const navItems: NavItem[] = [
    {
      title: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('properties'),
      href: '/properties',
      icon: Building,
    },
    {
      title: t('investments'),
      href: '/investments',
      icon: HandCoins,
    },
    {
      title: t('portfolio'),
      href: '/portfolio',
      icon: BarChart3,
    },
    {
      title: t('events'),
      href: '/events',
      icon: CalendarDays,
    },
    {
      title: t('network'),
      href: '/network',
      icon: Users,
    },
    {
      title: t('messages'),
      href: '/messages',
      icon: MessagesSquare,
    },
    {
      title: t('projects'),
      href: '/projects',
      icon: BriefcaseBusiness,
    },
    
    // Admin items
    ...(isAdmin ? [
      {
        title: t('adminPanel'),
        href: '/admin/dashboard',
        icon: ShieldAlert,
        adminOnly: true,
      },
      {
        title: t('adminFunctionTester'),
        href: '/admin/tester',
        icon: TestTube,
        adminOnly: true,
      }
    ] : []),
    
    {
      title: t('settings'),
      href: '/settings',
      icon: Settings,
    },
  ];
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        <Avatar className="h-12 w-12 mx-auto">
          <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.user_metadata?.full_name} />
          <AvatarFallback>{userData?.firstName?.charAt(0) || session?.user?.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="text-center mt-2 font-medium">{userData?.firstName} {userData?.lastName}</p>
        <p className="text-center text-sm text-muted-foreground">{userData?.email || session?.user?.email}</p>
      </div>
      <Separator />
      <nav className="flex flex-col flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

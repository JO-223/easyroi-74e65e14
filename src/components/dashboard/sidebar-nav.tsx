
import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Calendar,
  ConstructionIcon,
  Home,
  Network,
  Settings,
  UserCircle,
  Wallet
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarBadge } from "./sidebar-badge";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    level: string | null;
    id: string;
  };
}

export function SidebarNav({ userData }: SidebarNavProps) {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  
  return (
    <div className="h-full flex flex-col">
      <div className="space-y-1 py-4 flex-grow">
        <NavItem to="/dashboard" icon={Home} text={t('dashboard')} />
        <NavItem to="/dashboard/properties" icon={Building2} text={t('properties')} />
        <NavItem to="/dashboard/development" icon={ConstructionIcon} text={t('development')} />
        <NavItem to="/dashboard/analytics" icon={BarChart3} text={t('analytics')} />
        <NavItem to="/dashboard/cashflow" icon={Wallet} text={t('cashflowTracker')} />
        <NavItem to="/dashboard/events" icon={Calendar} text={t('events')} />
        <NavItem to="/dashboard/network" icon={Network} text={t('network')} />

        <div className="px-3 py-2">
          <div className="h-[2px] bg-gray-100"></div>
        </div>

        <NavItem to="/dashboard/profile" icon={UserCircle} text={t('profile')}>
          {userData.level && <SidebarBadge level={userData.level as any} />}
        </NavItem>
        <NavItem to="/dashboard/settings" icon={Settings} text={t('settings')} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full bg-white hover:bg-gray-100"
          onClick={() => signOut()}
        >
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  text: string;
  children?: React.ReactNode;
}

function NavItem({ to, icon: Icon, text, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        } group flex items-center justify-between px-3 py-2 text-sm font-medium`
      }
    >
      <div className="flex items-center">
        <Icon className="mr-2 h-5 w-5" />
        <span>{text}</span>
      </div>
      {children}
    </NavLink>
  );
}

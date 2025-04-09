
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useTranslation } from "@/hooks/useTranslation";
import { SidebarNav } from "./sidebar-nav";
import { BadgeLevel } from "../ui/badge-level";

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  level: string | null;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userData?: UserProfileData;
}

export function DashboardHeader({
  title,
  subtitle,
  userData
}: DashboardHeaderProps) {
  const t = useTranslation();
  
  return (
    <div className="flex flex-col space-y-0 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center p-4 md:p-6 border-b shadow-sm rounded-none bg-slate-50">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <div className="p-6">
                <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
              </div>
              <SidebarNav userData={userData} />
            </SheetContent>
          </Sheet>
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:hidden">
          <NotificationDropdown />
          <LanguageSwitcher />
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-4">
        {userData?.level && (
          <div className="mr-2">
            <BadgeLevel level={userData.level as any} />
          </div>
        )}
        <NotificationDropdown />
        <LanguageSwitcher />
      </div>
    </div>
  );
}

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarNav } from "./sidebar-nav";
interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}
export function DashboardHeader({
  title,
  subtitle
}: DashboardHeaderProps) {
  const {
    t
  } = useLanguage();
  return <div className="flex flex-col space-y-0 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center p-4 md:p-6 border-b shadow-sm bg-easyroi-navy rounded-none">
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
              <SidebarNav />
            </SheetContent>
          </Sheet>
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-50">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:hidden">
          <NotificationDropdown />
          <LanguageSwitcher />
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-3">
        <NotificationDropdown />
        <LanguageSwitcher />
      </div>
    </div>;
}
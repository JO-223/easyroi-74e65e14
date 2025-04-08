
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

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center p-4 md:p-6 border-b bg-white shadow-sm">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <LanguageSwitcher />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('menu')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="py-4">
              <SidebarNav />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

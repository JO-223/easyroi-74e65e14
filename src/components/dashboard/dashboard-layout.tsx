
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarNav } from "./sidebar-nav";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:block w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-easyroi-navy">{t('easyROI')}</h2>
          </div>
          <SidebarNav />
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <DashboardHeader title={title} subtitle={subtitle} />
          
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

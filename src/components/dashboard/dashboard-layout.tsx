import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarNav } from "./sidebar-nav";
import { DashboardHeader } from "./DashboardHeader";
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}
export function DashboardLayout({
  children,
  title,
  subtitle
}: DashboardLayoutProps) {
  const {
    t
  } = useLanguage();
  return <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:block w-64 bg-sidebar min-h-screen">
          <div className="p-6 bg-easyroi-navy">
            <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
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
    </div>;
}
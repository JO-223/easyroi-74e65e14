
import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  headerAction?: ReactNode; // Add headerAction as an optional prop
}

export function DashboardLayout({ children, title, subtitle, headerAction }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title={title} subtitle={subtitle} action={headerAction} />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

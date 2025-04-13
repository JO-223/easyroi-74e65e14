
import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode; // This is equivalent to the 'action' prop
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {action && (
            <div>{action}</div>
          )}
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

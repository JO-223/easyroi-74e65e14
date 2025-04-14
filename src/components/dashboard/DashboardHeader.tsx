
import React from 'react';
import { BadgeLevel } from '@/components/ui/badge-level';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userData?: {
    firstName?: string;
    lastName?: string;
    level?: string | null;
  };
  children?: React.ReactNode;
}

export function DashboardHeader({ 
  title, 
  subtitle,
  userData,
  children
}: DashboardHeaderProps) {
  const initials = userData && userData.firstName && userData.lastName 
    ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
    : "U";
    
  const displayName = userData && userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : "User";
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {children}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-sm md:text-base text-gray-500">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {userData ? (
            <>
              <div className="hidden sm:flex items-center space-x-2">
                <BadgeLevel level={userData?.level as any || "bronze"} />
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-easyroi-gold flex items-center justify-center">
                  <span className="font-bold text-easyroi-navy text-sm">{initials}</span>
                </div>
                <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

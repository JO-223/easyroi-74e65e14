
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarNav } from "./sidebar-nav";
import { DashboardHeader } from "./DashboardHeader";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  level: string | null;
}

export function DashboardLayout({
  children,
  title,
  subtitle
}: DashboardLayoutProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    level: null
  });
  
  useEffect(() => {
    // Check authentication and load user data
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, level')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfileData({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || "",
            level: data.level
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    }
    
    loadUserData();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:block w-64 bg-sidebar min-h-screen">
          <div className="p-6 bg-easyroi-navy">
            <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
          </div>
          <SidebarNav userData={profileData} />
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <DashboardHeader 
            title={title} 
            subtitle={subtitle} 
            userData={profileData}
          />
          
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

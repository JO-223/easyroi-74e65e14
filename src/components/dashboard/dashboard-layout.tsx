
import React, { useEffect, useState, useContext, createContext } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarNav } from "./sidebar-nav";
import { DashboardHeader } from "./DashboardHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  level: string | null;
  id: string;
}

interface UserProfileContextType {
  profileData: UserProfileData;
  isLoading: boolean;
}

// Create a context for user profile data
const UserProfileContext = createContext<UserProfileContextType>({
  profileData: {
    firstName: "",
    lastName: "",
    email: "",
    level: null,
    id: ""
  },
  isLoading: true
});

// Custom hook to access user profile data
export function useUserProfile() {
  return useContext(UserProfileContext);
}

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
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    level: null,
    id: ""
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Load user profile data (only once)
    async function loadUserData() {
      if (!user) return;
      
      try {
        console.log("DashboardLayout: Loading profile data for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, level')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfileData({
            firstName: data.first_name as string || "",
            lastName: data.last_name as string || "",
            email: data.email as string || "",
            level: data.level as string | null,
            id: user.id
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      loadUserData();
    }
  }, [user]);
  
  // Create the context value with profile data
  const contextValue: UserProfileContextType = {
    profileData,
    isLoading
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar for larger screens */}
          <div className="hidden lg:block w-64 bg-sidebar min-h-screen">
            <div className="p-6 bg-easyroi-navy">
              <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
            </div>
            <SidebarNav closeSidebar={handleCloseSidebar} />
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <DashboardHeader 
              title={title} 
              subtitle={subtitle} 
              userData={profileData}
            >
              {/* Mobile sidebar toggle button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 lg:hidden bg-easyroi-navy">
                  <div className="p-6 bg-easyroi-navy">
                    <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
                  </div>
                  <SidebarNav closeSidebar={handleCloseSidebar} />
                </SheetContent>
              </Sheet>
            </DashboardHeader>
            
            <main className="p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </UserProfileContext.Provider>
  );
}

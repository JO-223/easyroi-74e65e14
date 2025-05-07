
import {
  BarChart4,
  Building,
  Calendar,
  CreditCard,
  DollarSign,
  HardHat,
  Home,
  LifeBuoy,
  Network,
  Settings,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { SidebarBadge } from "./sidebar-badge";
import { Button } from "../ui/button";
import { useAdminRole } from "@/hooks/use-admin-role";
import { Badge } from "../ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { TranslationKey } from "@/utils/translationUtils";

// Define sidebar navigation items
export const sidebarNavItems = [
  {
    title: "dashboard" as TranslationKey,
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "properties" as TranslationKey,
    href: "/dashboard/properties",
    icon: Building,
  },
  {
    title: "investments" as TranslationKey,
    href: "/dashboard/investments",
    icon: DollarSign,
  },
  {
    title: "development" as TranslationKey,
    href: "/dashboard/development",
    icon: HardHat,
  },
  {
    title: "analytics" as TranslationKey,
    href: "/dashboard/analytics",
    icon: BarChart4,
  },
  {
    title: "cashflowTracker" as TranslationKey,
    href: "/dashboard/cashflow",
    icon: CreditCard,
  },
  {
    title: "events" as TranslationKey,
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "network" as TranslationKey,
    href: "/dashboard/network",
    icon: Users,
    badge: true,
  },
  {
    title: "consultations" as TranslationKey,
    href: "/dashboard/consultations",
    icon: Network,
  },
  {
    title: "helpCenter" as TranslationKey,
    href: "/dashboard/help",
    icon: LifeBuoy,
  },
];

// Admin sidebar navigation items
export const adminSidebarItems = [
  {
    title: "adminDashboard" as TranslationKey,
    href: "/admin",
    icon: Settings,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  closeSidebar?: () => void;
}

export function SidebarNav({ className, closeSidebar, ...props }: SidebarNavProps) {
  const { user } = useAuth();
  const t = useTranslation();
  const location = useLocation();
  const { isAdmin } = useAdminRole();
  const isMobile = useIsMobile();

  // Function to handle navigation click on mobile
  const handleNavClick = () => {
    if (isMobile && closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {sidebarNavItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant="ghost"
          className={cn(
            "justify-start gap-2 px-3",
            location.pathname === item.href && "bg-accent text-accent-foreground",
            location.pathname.startsWith(item.href) && 
            item.href !== "/dashboard" && 
            "bg-accent/50 text-accent-foreground"
          )}
        >
          <NavLink to={item.href} className="flex items-center" onClick={handleNavClick}>
            <item.icon className="mr-2 h-4 w-4" />
            {t(item.title)}
            {item.badge && <SidebarBadge />}
            {item.href === "/dashboard/consultations" && (
              <Badge variant="outline" className="ml-auto text-xs py-0">New</Badge>
            )}
          </NavLink>
        </Button>
      ))}

      {isAdmin && (
        <div className="relative mt-6 pt-6 before:absolute before:top-0 before:left-2 before:right-2 before:h-px before:bg-border">
          {adminSidebarItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "justify-start gap-2 px-3",
                location.pathname === item.href && "bg-accent text-accent-foreground",
                location.pathname.startsWith(item.href) && 
                item.href !== "/dashboard" && 
                "bg-accent/50 text-accent-foreground"
              )}
            >
              <NavLink to={item.href} className="flex items-center" onClick={handleNavClick}>
                <item.icon className="mr-2 h-4 w-4" />
                {t(item.title)}
              </NavLink>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

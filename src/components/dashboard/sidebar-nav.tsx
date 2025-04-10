import {
  Home,
  LayoutDashboard,
  Settings,
  PlusCircle,
  Construction
} from "lucide-react"

import { NavItem } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAdminRole } from "@/hooks/use-admin-role"

interface SidebarNavProps {
  items: NavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const { t } = useLanguage();
  const { isAdmin } = useAdminRole();

  const links = [
    {
      title: t('dashboard'),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('properties'),
      href: "/properties",
      icon: Home,
    },
    {
      title: t('developmentProjects'),
      href: "/development",
      icon: Construction,
    },
    {
      title: t('analytics'),
      href: "/analytics",
      icon: Settings,
    },
    isAdmin && {
      title: t('addProperty'),
      href: '/admin/add-property',
      icon: PlusCircle,
    }
  ].filter(Boolean) as NavItem[];

  return (
    <div className="flex flex-col space-y-6">
      {links.map((link) => (
        <a
          key={link.title}
          href={link.href}
          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground"
        >
          <link.icon className="h-4 w-4" />
          <span>{link.title}</span>
        </a>
      ))}
    </div>
  )
}

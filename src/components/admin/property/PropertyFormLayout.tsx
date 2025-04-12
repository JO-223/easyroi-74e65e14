
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFormLayoutProps {
  children: ReactNode;
  title: string;
  isLoading: boolean;
}

export function PropertyFormLayout({ children, title, isLoading }: PropertyFormLayoutProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 rounded-lg border">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

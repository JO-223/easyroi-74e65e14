
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const languageFlags: Record<Language, { flag: string; name: string }> = {
  english: { flag: "🇬🇧", name: "English" },
  italian: { flag: "🇮🇹", name: "Italiano" },
  spanish: { flag: "🇪🇸", name: "Español" },
  german: { flag: "🇩🇪", name: "Deutsch" },
};

interface LanguageSwitcherProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function LanguageSwitcher({ variant = "default", className = "" }: LanguageSwitcherProps) {
  const { displaySettings, updateDisplaySettings, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const currentLanguage = languageFlags[displaySettings.language as Language];

  const handleLanguageChange = (language: Language) => {
    updateDisplaySettings({ language });
    setOpen(false);
    
    toast({
      title: t('language'),
      description: language === 'english' 
        ? "Language changed to English" 
        : language === 'italian' 
        ? "Lingua cambiata in Italiano" 
        : language === 'spanish' 
        ? "Idioma cambiado a Español" 
        : "Sprache auf Deutsch geändert",
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`flex items-center gap-2 px-2 ${className}`}
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          {variant === "default" && <span>{currentLanguage.name}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {Object.entries(languageFlags).map(([lang, { flag, name }]) => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => handleLanguageChange(lang as Language)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{flag}</span>
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

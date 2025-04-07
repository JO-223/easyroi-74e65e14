
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language, useLanguage } from "@/contexts/LanguageContext";

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
  const { displaySettings, updateDisplaySettings } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentLanguage = languageFlags[displaySettings.language];

  const handleLanguageChange = (language: Language) => {
    updateDisplaySettings({ language });
    setOpen(false);
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

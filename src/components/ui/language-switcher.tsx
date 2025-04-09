
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
  en: { flag: "🇬🇧", name: "English" },
  it: { flag: "🇮🇹", name: "Italiano" },
  es: { flag: "🇪🇸", name: "Español" },
  de: { flag: "🇩🇪", name: "Deutsch" },
};

interface LanguageSwitcherProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function LanguageSwitcher({ variant = "default", className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Safety check to ensure the language is valid before accessing languageFlags
  const safeLanguage = Object.keys(languageFlags).includes(language) ? language : "en";
  const currentLanguage = languageFlags[safeLanguage];

  const handleLanguageChange = (selectedLang: Language) => {
    setLanguage(selectedLang);
    setOpen(false);
    
    const messages = {
      'en': "Language changed to English",
      'it': "Lingua cambiata in Italiano",
      'es': "Idioma cambiado a Español",
      'de': "Sprache auf Deutsch geändert"
    };
    
    toast({
      title: t('language'),
      description: messages[selectedLang]
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

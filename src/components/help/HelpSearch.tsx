
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface HelpSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function HelpSearch({ onSearch, className = "" }: HelpSearchProps) {
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={t('searchHelp')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-24"
      />
      <div className="absolute right-1 top-1 flex items-center">
        {searchQuery && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" size="sm" variant="secondary" className="ml-1">
          <Search className="h-4 w-4 mr-2" />
          {t('search')}
        </Button>
      </div>
    </form>
  );
}

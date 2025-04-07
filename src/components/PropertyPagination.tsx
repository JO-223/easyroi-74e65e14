
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PropertyPagination({ currentPage, totalPages, onPageChange }: PropertyPaginationProps) {
  const { t } = useLanguage();
  
  // Generate page numbers to display (show current page, 2 before and 2 after when possible)
  const getPageNumbers = () => {
    const pages = [];
    const leftBound = Math.max(1, currentPage - 2);
    const rightBound = Math.min(totalPages, currentPage + 2);
    
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className="bg-white/5 text-white hover:bg-white/10 cursor-pointer"
            />
          </PaginationItem>
        )}
        
        {getPageNumbers().map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              className={`cursor-pointer ${
                page === currentPage 
                  ? 'bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className="bg-white/5 text-white hover:bg-white/10 cursor-pointer"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

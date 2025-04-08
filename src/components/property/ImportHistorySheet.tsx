
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { History, ScrollText } from "lucide-react";
import { DataImport } from "@/types/property";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function ImportHistorySheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [imports, setImports] = useState<DataImport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchImportHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_imports')
        .select('*')
        .order('import_date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setImports(data as DataImport[]);
    } catch (error) {
      console.error("Error fetching import history:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchImportHistory();
    }
  }, [isOpen]);
  
  function getStatusBadgeClass(status: string | null): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'processing':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'failed':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => setIsOpen(true)}
        >
          <History size={16} />
          Import History
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Import History
          </SheetTitle>
          <SheetDescription>
            Recent property imports and their status.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : imports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No import history found
            </div>
          ) : (
            <Table>
              <TableCaption>Recent property imports</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imports.map((importItem) => (
                  <TableRow key={importItem.id}>
                    <TableCell>{importItem.source}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(importItem.status)}>
                        {importItem.status || 'unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {importItem.records_processed ? 
                        `${importItem.records_processed} total` : 
                        '—'}
                    </TableCell>
                    <TableCell>
                      {importItem.import_date ? 
                        formatDistanceToNow(new Date(importItem.import_date), { addSuffix: true }) : 
                        '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

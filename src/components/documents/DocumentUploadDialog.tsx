
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { uploadPropertyDocument } from "@/services/propertyDocumentService";
import { documentTypeOptions } from "@/types/propertyDocument";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const formSchema = z.object({
  document_name: z.string().min(1, "Document name is required"),
  document_type: z.string().min(1, "Document type is required"),
  file: z.any()
    .refine((file) => file instanceof File, "File is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB"),
  description: z.string().optional(),
  is_confidential: z.boolean().default(false)
});

export default function DocumentUploadDialog({
  isOpen,
  onClose,
  propertyId,
  onSuccess
}: DocumentUploadDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_name: "",
      document_type: "",
      description: "",
      is_confidential: false
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("file", file);
      
      // Set document_name to file name if empty
      if (!form.getValues("document_name")) {
        const fileName = file.name.split('.')[0]; // Remove extension
        form.setValue("document_name", fileName);
      }
    }
  };
  
  const clearFile = () => {
    setSelectedFile(null);
    form.setValue("file", undefined);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return;
    
    setIsUploading(true);
    try {
      const result = await uploadPropertyDocument(
        {
          property_id: propertyId,
          document_name: values.document_name,
          document_type: values.document_type,
          file: values.file as File,
          description: values.description,
          is_confidential: values.is_confidential
        },
        user.id
      );
      
      if (result) {
        toast({
          title: t('documentUploaded'),
          description: t('documentUploadedSuccessfully'),
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: t('errorUploadingDocument'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('uploadPropertyDocument')}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="document_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('documentName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterDocumentName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('documentType')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectDocumentType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>{t('document')}</FormLabel>
                  <FormControl>
                    {!selectedFile ? (
                      <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="w-6 h-6 mb-2" />
                          <span>{t('selectFile')}</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span className="text-sm truncate">{selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </FormControl>
                  <FormDescription>
                    {t('maxFileSize', { size: '10MB' })}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('enterDescription')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_confidential"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('markAsConfidential')}</FormLabel>
                    <FormDescription>
                      {t('confidentialDocumentDescription')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUploading}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? t('uploading') : t('upload')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

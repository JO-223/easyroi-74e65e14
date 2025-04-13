
export interface PropertyDocument {
  id: string;
  property_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  is_confidential: boolean;
  uploaded_by: string;
  upload_date: string;
  last_accessed?: string;
  description?: string;
  created_at?: string;
  file?: File; // for upload operations only
}

export interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess?: () => void;
}

export type DocumentType = 'contract' | 'deed' | 'floorplan' | 'report' | 'financial' | 'other';

export interface DocumentTypesOption {
  value: DocumentType;
  label: string;
  icon?: React.ReactNode;
}


export interface PropertyDocument {
  id: string;
  property_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  description?: string;
  is_confidential: boolean;
  uploaded_by: string;
  upload_date: string;
  last_accessed?: string;
}

export interface PropertyDocumentFormData {
  property_id: string;
  document_name: string;
  document_type: string;
  file: File;
  description?: string;
  is_confidential: boolean;
}

export type DocumentType = 'contract' | 'deed' | 'invoice' | 'report' | 'certificate' | 'other';

export const documentTypeOptions = [
  { label: 'Contract', value: 'contract' },
  { label: 'Deed', value: 'deed' },
  { label: 'Invoice', value: 'invoice' },
  { label: 'Report', value: 'report' },
  { label: 'Certificate', value: 'certificate' },
  { label: 'Other', value: 'other' }
];

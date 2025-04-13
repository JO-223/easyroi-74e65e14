
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
}

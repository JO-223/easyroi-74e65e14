
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument } from '@/types/document';

interface DocumentUploadParams {
  property_id: string;
  uploaded_by: string;
  document_name: string;
  document_type: string;
  file: File;
  description: string;
  is_confidential: boolean;
}

export async function fetchPropertyDocuments(propertyId: string): Promise<PropertyDocument[]> {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data as PropertyDocument[];
  } catch (error) {
    console.error('Error fetching property documents:', error);
    throw error;
  }
}

export async function uploadPropertyDocument(params: DocumentUploadParams): Promise<PropertyDocument> {
  try {
    // Upload file to storage
    const fileExt = params.file.name.split('.').pop();
    const filePath = `property_documents/${params.property_id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, params.file);
      
    if (uploadError) throw uploadError;
    
    // Create document entry in database
    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: params.property_id,
        document_name: params.document_name,
        document_type: params.document_type,
        description: params.description,
        is_confidential: params.is_confidential,
        file_path: filePath,
        file_size: params.file.size,
        mime_type: params.file.type,
        uploaded_by: params.uploaded_by,
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as PropertyDocument;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

export async function deletePropertyDocument(documentId: string): Promise<void> {
  try {
    // Get document info to get the file path
    const { data: document, error: fetchError } = await supabase
      .from('property_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Delete from storage
    if (document?.file_path) {
      const { error: deleteFileError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);
        
      if (deleteFileError) {
        console.error('Error deleting file from storage:', deleteFileError);
        // Continue with deletion from DB even if storage deletion fails
      }
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', documentId);
      
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

export async function downloadFile(path: string, fileName: string): Promise<void> {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(path);
      
    if (error) throw error;
    
    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

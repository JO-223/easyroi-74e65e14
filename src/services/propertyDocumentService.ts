import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument } from '@/types/document';

/**
 * Fetch all documents for a specific property
 */
export const fetchPropertyDocuments = async (propertyId: string): Promise<PropertyDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Fix the type casting issue
    return (data as unknown) as PropertyDocument[];
  } catch (error) {
    console.error('Error fetching property documents:', error);
    return [];
  }
};

/**
 * Upload a new document for a property
 */
export const uploadPropertyDocument = async (document: Omit<PropertyDocument, 'id' | 'created_at'>): Promise<PropertyDocument | null> => {
  try {
    // 1. Upload file to storage
    const file = document.file;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `property-documents/${document.property_id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // 2. Get file URL
    const { data: fileUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    if (!fileUrlData) throw new Error('Failed to get file URL');
    
    // 3. Create document record in database
    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: document.property_id,
        document_name: document.document_name,
        document_type: document.document_type,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        description: document.description,
        is_confidential: document.is_confidential,
        uploaded_by: document.uploaded_by
      })
      .select()
      .single();
      
    if (error) throw error;
    // Fix the type casting
    return (data as unknown) as PropertyDocument;
  } catch (error) {
    console.error('Error uploading property document:', error);
    return null;
  }
};

/**
 * Get a download/access URL for a document
 */
export const getDocumentAccessUrl = async (documentId: string): Promise<string> => {
  try {
    // 1. Get document record to find the file path
    const { data, error } = await supabase
      .from('property_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
      
    if (error) throw error;
    
    // 2. Generate and return download URL
    const filePath = data.file_path as string;
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    if (!urlData) throw new Error('Failed to get URL');
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error getting document access URL:', error);
    throw error;
  }
};

/**
 * Delete a property document
 */
export const deletePropertyDocument = async (documentId: string): Promise<boolean> => {
  try {
    // 1. Get document record to find the file path
    const { data, error } = await supabase
      .from('property_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
      
    if (error) throw error;
    
    // 2. Delete file from storage
    const filePath = data.file_path as string;
    const { error: deleteStorageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);
      
    if (deleteStorageError) {
      console.error('Error deleting file from storage:', deleteStorageError);
    }
    
    // 3. Delete record from database
    const { error: deleteRecordError } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', documentId);
      
    if (deleteRecordError) throw deleteRecordError;
    
    return true;
  } catch (error) {
    console.error('Error deleting property document:', error);
    return false;
  }
};

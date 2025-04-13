
import { supabase } from "@/integrations/supabase/client";
import { PropertyDocument, PropertyDocumentFormData } from "@/types/propertyDocument";
import { useToast } from "@/hooks/use-toast";

export async function fetchPropertyDocuments(propertyId: string) {
  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .eq('property_id', propertyId)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching property documents:', error);
    throw error;
  }

  return data as PropertyDocument[];
}

export async function fetchUserDocuments(userId: string) {
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('id')
    .eq('user_id', userId);

  if (propertiesError) {
    console.error('Error fetching user properties:', propertiesError);
    throw propertiesError;
  }

  if (!properties || properties.length === 0) {
    return [];
  }

  const propertyIds = properties.map(p => p.id);
  
  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .in('property_id', propertyIds)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }

  return data as PropertyDocument[];
}

export async function uploadPropertyDocument(formData: PropertyDocumentFormData, userId: string) {
  const { toast } = useToast();
  
  try {
    // First, create a unique filename
    const fileExt = formData.file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `documents/${formData.property_id}/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('property-documents')
      .upload(filePath, formData.file);

    if (uploadError) {
      console.error('Error uploading document:', uploadError);
      toast({
        title: 'Error uploading document',
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    // Create document record in database
    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: formData.property_id,
        document_name: formData.document_name,
        document_type: formData.document_type,
        file_path: filePath,
        file_size: formData.file.size,
        mime_type: formData.file.type,
        description: formData.description || null,
        is_confidential: formData.is_confidential,
        uploaded_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating document record:', error);
      toast({
        title: 'Error saving document information',
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data as PropertyDocument;
  } catch (error) {
    console.error('Unexpected error in uploadPropertyDocument:', error);
    toast({
      title: 'Unexpected error',
      description: 'An unexpected error occurred during document upload.',
      variant: "destructive",
    });
    return null;
  }
}

export async function deletePropertyDocument(documentId: string) {
  // First get the document to get the file path
  const { data: document, error: fetchError } = await supabase
    .from('property_documents')
    .select('file_path')
    .eq('id', documentId)
    .single();

  if (fetchError) {
    console.error('Error fetching document for deletion:', fetchError);
    throw fetchError;
  }

  // Remove the file from storage
  const { error: storageError } = await supabase.storage
    .from('property-documents')
    .remove([document.file_path]);

  if (storageError) {
    console.error('Error removing document from storage:', storageError);
    throw storageError;
  }

  // Remove the database record
  const { error: deleteError } = await supabase
    .from('property_documents')
    .delete()
    .eq('id', documentId);

  if (deleteError) {
    console.error('Error deleting document record:', deleteError);
    throw deleteError;
  }

  return true;
}

export async function getDocumentAccessUrl(documentId: string): Promise<string> {
  // Update last_accessed timestamp
  const { data, error: updateError } = await supabase
    .from('property_documents')
    .update({ last_accessed: new Date().toISOString() })
    .eq('id', documentId)
    .select('file_path')
    .single();

  if (updateError) {
    console.error('Error updating last_accessed:', updateError);
    throw updateError;
  }

  // Get signed URL for the file
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('property-documents')
    .createSignedUrl(data.file_path, 60); // 60 seconds expiry

  if (signedUrlError) {
    console.error('Error getting signed URL:', signedUrlError);
    throw signedUrlError;
  }

  return signedUrlData.signedUrl;
}

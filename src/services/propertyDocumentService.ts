
import { supabase } from "@/integrations/supabase/client";

export interface PropertyDocument {
  id: string;
  property_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_confidential: boolean;
  description?: string;
  uploaded_by: string;
  upload_date: string;
  last_accessed?: string;
  created_at?: string;
}

export const fetchPropertyDocuments = async (propertyId: string): Promise<PropertyDocument[]> => {
  const { data, error } = await supabase
    .from("property_documents")
    .select("*")
    .eq("property_id", propertyId)
    .order("upload_date", { ascending: false });

  if (error) {
    console.error("Error fetching property documents:", error);
    throw new Error(error.message);
  }

  // Add proper type casting
  return data as unknown as PropertyDocument[];
};

export const uploadPropertyDocument = async (
  documentData: Omit<PropertyDocument, "id" | "created_at"> & { file: File }
): Promise<PropertyDocument> => {
  try {
    const { file, ...docMetadata } = documentData;
    
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `property_documents/${docMetadata.property_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }

    // 2. Create document record in the database
    const { data, error: insertError } = await supabase
      .from("property_documents")
      .insert({
        ...docMetadata,
        file_path: filePath,
        upload_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error creating document record: ${insertError.message}`);
    }

    return data as unknown as PropertyDocument;
  } catch (error) {
    console.error("Error in uploadPropertyDocument:", error);
    throw error;
  }
};

export const getDocumentAccessUrl = async (documentPath: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(documentPath as string, 60 * 60); // 1 hour expiry

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error generating document access URL:", error);
    throw error;
  }
};

export const deletePropertyDocument = async (documentId: string, documentPath: string): Promise<void> => {
  try {
    // 1. Delete document from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([documentPath as string]);

    if (storageError) {
      throw new Error(`Error deleting document file: ${storageError.message}`);
    }

    // 2. Delete document record from database
    const { error: dbError } = await supabase
      .from("property_documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      throw new Error(`Error deleting document record: ${dbError.message}`);
    }
  } catch (error) {
    console.error("Error in deletePropertyDocument:", error);
    throw error;
  }
};

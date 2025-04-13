
import { supabase } from "@/integrations/supabase/client";
import { PropertyDocument } from "@/types/document";

export interface UploadDocumentParams {
  property_id: string;
  userId: string;
  fileName: string;
  documentType: string;
  file: File;
  description?: string;
  isConfidential: boolean;
}

export async function fetchPropertyDocuments(propertyId: string): Promise<PropertyDocument[]> {
  const { data, error } = await supabase
    .from("property_documents")
    .select("*")
    .eq("property_id", propertyId)
    .order("upload_date", { ascending: false });

  if (error) {
    console.error("Error fetching property documents:", error);
    throw new Error(error.message);
  }

  return data as PropertyDocument[];
}

export async function uploadPropertyDocument(params: UploadDocumentParams): Promise<PropertyDocument> {
  const { property_id, userId, fileName, documentType, file, description, isConfidential } = params;
  
  // Upload file to storage
  const fileExt = file.name.split(".").pop();
  const filePath = `properties/${property_id}/documents/${Date.now()}_${fileName.replace(/\s+/g, "_")}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading document file:", uploadError);
    throw new Error(uploadError.message);
  }

  // Create document record
  const { data: documentData, error: documentError } = await supabase
    .from("property_documents")
    .insert({
      property_id,
      document_name: fileName,
      document_type: documentType,
      file_path: filePath,
      mime_type: file.type,
      file_size: file.size,
      is_confidential: isConfidential,
      uploaded_by: userId,
      upload_date: new Date().toISOString(),
      description: description || null,
    })
    .select("*")
    .single();

  if (documentError) {
    console.error("Error creating document record:", documentError);
    throw new Error(documentError.message);
  }

  return documentData as PropertyDocument;
}

export async function getDocumentAccessUrl(documentId: string): Promise<string> {
  const { data, error } = await supabase
    .from("property_documents")
    .select("file_path")
    .eq("id", documentId)
    .single();

  if (error) {
    console.error("Error fetching document path:", error);
    throw new Error(error.message);
  }

  const { data: urlData, error: urlError } = await supabase.storage
    .from("documents")
    .createSignedUrl(data.file_path, 3600); // 1 hour expiry

  if (urlError) {
    console.error("Error creating signed URL:", urlError);
    throw new Error(urlError.message);
  }

  return urlData.signedUrl;
}

export async function deletePropertyDocument(documentId: string): Promise<void> {
  const { data, error } = await supabase
    .from("property_documents")
    .delete()
    .eq("id", documentId)
    .select("file_path")
    .single();

  if (error) {
    console.error("Error deleting document record:", error);
    throw new Error(error.message);
  }

  // Delete file from storage
  if (data?.file_path) {
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([data.file_path]);

    if (storageError) {
      console.error("Warning: Could not delete file from storage:", storageError);
      // We don't throw here since the database record is already deleted
    }
  }
}

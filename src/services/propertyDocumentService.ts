
import { supabase } from "@/integrations/supabase/client";
import { PropertyDocument } from "@/types/document";

export const fetchPropertyDocuments = async (propertyId: string): Promise<PropertyDocument[]> => {
  try {
    const { data, error } = await supabase
      .from("property_documents")
      .select("*")
      .eq("property_id", propertyId)
      .order("upload_date", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      throw new Error(error.message);
    }

    // Add proper type casting
    return data as PropertyDocument[];
  } catch (error) {
    console.error("Error in fetchPropertyDocuments:", error);
    throw error;
  }
};

export const uploadPropertyDocument = async (
  documentData: Omit<PropertyDocument, "id" | "created_at"> & { file: File }
): Promise<PropertyDocument> => {
  try {
    const { file, ...docData } = documentData;
    
    // Upload file to storage
    const filePath = `documents/${docData.property_id}/${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("property-documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading document file:", uploadError);
      throw new Error(uploadError.message);
    }

    // Get public URL
    const { data: publicUrlData } = await supabase.storage
      .from("property-documents")
      .getPublicUrl(filePath);

    // Create document record
    const { data, error } = await supabase
      .from("property_documents")
      .insert({
        ...docData,
        file_path: publicUrlData!.publicUrl,
        upload_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating document record:", error);
      throw new Error(error.message);
    }

    // Add proper type casting
    return data as PropertyDocument;
  } catch (error) {
    console.error("Error in uploadPropertyDocument:", error);
    throw error;
  }
};

export const deletePropertyDocument = async (documentId: string): Promise<void> => {
  try {
    // First get the document to find the file path
    const { data: document, error: getError } = await supabase
      .from("property_documents")
      .select("file_path")
      .eq("id", documentId)
      .single();

    if (getError) {
      console.error("Error fetching document for deletion:", getError);
      throw new Error(getError.message);
    }

    // Extract the storage path from the URL
    const storagePath = document.file_path.split("/").slice(-3).join("/");
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from("property-documents")
      .remove([storagePath]);

    if (storageError) {
      console.error("Error deleting document file:", storageError);
      // Continue to delete the record even if file deletion fails
    }

    // Delete the record from the database
    const { error } = await supabase
      .from("property_documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      console.error("Error deleting document record:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deletePropertyDocument:", error);
    throw error;
  }
};

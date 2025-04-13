
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
      console.error("Error fetching property documents:", error);
      throw new Error(error.message);
    }

    return (data as unknown) as PropertyDocument[];
  } catch (error) {
    console.error("Error in fetchPropertyDocuments:", error);
    throw error;
  }
};

export const uploadPropertyDocument = async (document: Omit<PropertyDocument, "id" | "created_at"> & { file: File }): Promise<PropertyDocument> => {
  try {
    // First upload the file to storage
    const fileExt = document.file.name.split('.').pop();
    const filePath = `property-documents/${document.property_id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, document.file);

    if (uploadError) {
      console.error("Error uploading document file:", uploadError);
      throw new Error(uploadError.message);
    }

    // Now save the document metadata to the database
    const { data, error } = await supabase
      .from("property_documents")
      .insert({
        property_id: document.property_id,
        document_name: document.document_name,
        document_type: document.document_type,
        file_path: filePath,
        mime_type: document.file.type,
        file_size: document.file.size,
        is_confidential: document.is_confidential,
        uploaded_by: document.uploaded_by,
        description: document.description
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting document metadata:", error);
      throw new Error(error.message);
    }

    return (data as unknown) as PropertyDocument;
  } catch (error) {
    console.error("Error in uploadPropertyDocument:", error);
    throw error;
  }
};

// Add the getDocumentAccessUrl function
export const getDocumentAccessUrl = async (filePath: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour

    if (error) {
      console.error("Error creating signed URL:", error);
      throw new Error(error.message);
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error in getDocumentAccessUrl:", error);
    throw error;
  }
};

export const deletePropertyDocument = async (documentId: string): Promise<void> => {
  try {
    // First get the document to find its file path
    const { data: document, error: fetchError } = await supabase
      .from("property_documents")
      .select("file_path")
      .eq("id", documentId)
      .single();

    if (fetchError) {
      console.error("Error fetching document to delete:", fetchError);
      throw new Error(fetchError.message);
    }

    // Convert to string to ensure it's a string
    const filePath = String(document?.file_path || '');

    // Delete the file from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting document file:", storageError);
        // Continue anyway to delete the database entry
      }
    }

    // Delete the metadata from the database
    const { error: dbError } = await supabase
      .from("property_documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      console.error("Error deleting document metadata:", dbError);
      throw new Error(dbError.message);
    }

  } catch (error) {
    console.error("Error in deletePropertyDocument:", error);
    throw error;
  }
};

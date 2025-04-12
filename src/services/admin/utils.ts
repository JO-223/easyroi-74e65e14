
// Ensure that the response data is of the expected type
export function ensureTypedResponse<T>(data: unknown): T[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data as T[];
}

// Interface for RPC response
export interface RpcResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

// Function to check the success of an RPC operation and handle it appropriately
export function handleRpcResponse(response: RpcResponse): RpcResponse {
  // Log response for debugging
  console.log("Handling RPC response:", response);
  
  // Ensure the response has the required fields
  if (!response || typeof response !== 'object') {
    return {
      success: false, 
      message: "Invalid response format"
    };
  }
  
  return {
    success: response.success === true,
    message: response.message || "Unknown status",
    ...response
  };
}

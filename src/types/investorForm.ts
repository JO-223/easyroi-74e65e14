
import { z } from "zod";

// Basic schema for the investor form
export const investorFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

// Type definition for the form data
export type InvestorFormData = z.infer<typeof investorFormSchema>;

// Type definition for the form submission response
export interface InvestorSubmissionResponse {
  success: boolean;
  message: string;
  userId?: string;
}

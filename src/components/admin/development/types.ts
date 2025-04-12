
import * as z from "zod";

export const developmentProjectFormSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Description is required (min 10 characters)"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zone: z.string().min(1, "Zone is required"),
  expectedCompletion: z.string().min(1, "Expected completion date is required"),
  constructionStage: z.string().min(1, "Construction stage is required"),
  progressPercentage: z.number().min(0).max(100, "Must be between 0 and 100"),
  totalUnits: z.number().min(1, "Total units must be at least 1"),
  availableUnits: z.number().min(0, "Available units must be at least 0"),
  minInvestment: z.number().optional(),
  expectedRoi: z.number().optional(),
  investorLevel: z.string().default("bronze"),
  imageUrl: z.string().optional(),
});

export type AdminDevelopmentProjectFormValues = z.infer<typeof developmentProjectFormSchema>;

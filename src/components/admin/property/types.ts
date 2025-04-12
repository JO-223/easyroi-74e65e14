
// Form schema types for property forms
import { z } from "zod";

const AVAILABLE_COUNTRIES = ["Italy", "UAE", "Thailand", "Switzerland"];
const OCCUPATION_STATUS_OPTIONS = ["rented", "occupied", "vacant", "partially_occupied"];
const STATUS_OPTIONS = ["active", "pending", "residential"];
const LISTING_STATUS_OPTIONS = ["for_sale", "negotiable", "not_listed"];
const CURRENCY_OPTIONS = ["EUR", "USD", "AED"];

export const propertyFormSchema = z.object({
  userId: z.string().min(1, "Investor is required"),
  name: z.string().min(2, "Property name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.enum(AVAILABLE_COUNTRIES as [string, ...string[]]),
  zone: z.string().min(1, "Zone is required"),
  typeId: z.string().min(1, "Property type is required"),
  price: z.number().min(1, "Price is required"),
  currency: z.enum(CURRENCY_OPTIONS as [string, ...string[]]),
  sizeSqm: z.number().min(1, "Size is required"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or greater"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or greater"),
  occupationStatus: z.enum(OCCUPATION_STATUS_OPTIONS as [string, ...string[]]),
  status: z.enum(STATUS_OPTIONS as [string, ...string[]]),
  listingStatus: z.enum(LISTING_STATUS_OPTIONS as [string, ...string[]]),
  roiPercentage: z.number().optional(),
  serviceCharges: z.number().optional()
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

// Constants
export const AVAILABLE_COUNTRIES_LIST = AVAILABLE_COUNTRIES;
export const OCCUPATION_STATUS_LIST = OCCUPATION_STATUS_OPTIONS;
export const STATUS_LIST = STATUS_OPTIONS;
export const LISTING_STATUS_LIST = LISTING_STATUS_OPTIONS;
export const CURRENCY_LIST = CURRENCY_OPTIONS;


import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required (min 10 characters)"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  eventType: z.string().min(1, "Event type is required"),
  maxAttendees: z.number().optional(),
  propertyId: z.string().optional(),
  projectId: z.string().optional(),
  imageUrl: z.string().optional(),
  isOnline: z.boolean().default(false),
  requiredBadges: z.array(z.string()).optional(),
});

export type AdminEventFormValues = z.infer<typeof eventFormSchema>;

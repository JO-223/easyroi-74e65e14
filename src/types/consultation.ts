
export type ExpertType = "investment" | "legal" | "tax";

export interface Consultant {
  id: string;
  name: string;
  role: string;
  description: string;
  type: ExpertType;
  photoUrl?: string;
  bookingUrl: string;
}

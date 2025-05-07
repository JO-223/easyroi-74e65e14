
import { useState, useEffect } from "react";
import { Consultant, ExpertType } from "@/types/consultation";
import { fetchConsultants } from "@/services/consultationService";

export function useConsultants(type: ExpertType) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConsultants = async () => {
      setIsLoading(true);
      try {
        const data = await fetchConsultants(type);
        setConsultants(data);
      } catch (error) {
        console.error("Error loading consultants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultants();
  }, [type]);

  return { consultants, isLoading };
}


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileVisibility } from "@/services/network/types";

export type ProfileData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  join_date: string;
  level: string | null;
  avatar_url: string | null;
  visibility: ProfileVisibility;
};

export type ProfileInterest = { name: string };

export const useProfileData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [interests, setInterests] = useState<ProfileInterest[]>([]);
  const [availableInterests, setAvailableInterests] = useState<{id: string, name: string}[]>([]);

  const [profile, setProfile] = useState<ProfileData>({
    id: "",
    first_name: null,
    last_name: null,
    email: "",
    phone: null,
    location: null,
    bio: null,
    join_date: "",
    level: null,
    avatar_url: null,
    visibility: "public"
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user logged in");
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, visibility')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const { data: userInterests, error: interestsError } = await supabase
        .from('profile_interests')
        .select('interests(name)')
        .eq('profile_id', user.id);
      
      if (interestsError) throw interestsError;
      
      const { data: allInterests, error: allInterestsError } = await supabase
        .from('interests')
        .select('id, name');
      
      if (allInterestsError) throw allInterestsError;
      
      if (profileData) {
        const joinDate = profileData.join_date 
          ? new Date(profileData.join_date as string) 
          : new Date();
        const joinMonth = joinDate.toLocaleString('default', { month: 'long' });
        const joinYear = joinDate.getFullYear();
        
        setProfile({
          ...profileData as any, // Type assertion needed here
          join_date: `Member since ${joinMonth} ${joinYear}`,
          visibility: (profileData.visibility as ProfileVisibility) || 'public'
        });
      }
      
      if (userInterests) {
        const typedInterests = userInterests.map((item: any) => ({ 
          name: item.interests?.name as string || ''
        }));
        setInterests(typedInterests);
      }
      
      if (allInterests) {
        const typedAvailableInterests = allInterests.map((item: any) => ({ 
          id: item.id as string || '', 
          name: item.name as string || '' 
        }));
        setAvailableInterests(typedAvailableInterests);
      }
      
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast({
        title: "An error occurred",
        description: "Could not load profile information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    setProfile,
    isLoading,
    interests,
    availableInterests,
    setInterests
  };
};

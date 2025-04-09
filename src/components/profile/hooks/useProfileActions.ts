
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileData, ProfileInterest } from "./useProfileData";

export const useProfileActions = (
  profile: ProfileData,
  interests: ProfileInterest[],
  setInterests: React.Dispatch<React.SetStateAction<ProfileInterest[]>>
) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio
        })
        .eq('id', profile.id);
      
      if (updateError) throw updateError;
      
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "An error occurred",
        description: "Could not update profile information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = async (interestId: string) => {
    try {
      const { error } = await supabase
        .from('profile_interests')
        .insert({
          profile_id: profile.id,
          interest_id: interestId
        });
      
      if (error) throw error;
      
      const { data: userInterests, error: fetchError } = await supabase
        .from('profile_interests')
        .select('interests(name)')
        .eq('profile_id', profile.id);
      
      if (fetchError) throw fetchError;
      
      if (userInterests) {
        setInterests(userInterests.map((item: any) => ({ name: item.interests.name })));
      }
      
    } catch (error) {
      console.error("Error adding interest:", error);
      toast({
        title: "An error occurred",
        description: "Could not add interest",
        variant: "destructive"
      });
    }
  };

  const removeInterest = async (interestName: string) => {
    try {
      const { data: interestData } = await supabase
        .from('interests')
        .select('id')
        .eq('name', interestName)
        .single();
      
      if (!interestData) return;
      
      const { error } = await supabase
        .from('profile_interests')
        .delete()
        .eq('profile_id', profile.id)
        .eq('interest_id', interestData.id);
      
      if (error) throw error;
      
      setInterests(interests.filter(i => i.name !== interestName));
      
    } catch (error) {
      console.error("Error removing interest:", error);
      toast({
        title: "An error occurred",
        description: "Could not remove interest", 
        variant: "destructive"
      });
    }
  };

  return {
    isEditing,
    setIsEditing,
    isSaving,
    handleSaveProfile,
    addInterest,
    removeInterest
  };
};

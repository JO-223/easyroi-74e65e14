
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileVisibility } from "@/services/network/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileMainCard } from "./ProfileMainCard";
import { SecurityPrivacyCard } from "./SecurityPrivacyCard";
import InvestmentSummary from "./InvestmentSummaryCard";
import RecentActivityCard from "./RecentActivityCard";

type ProfileData = {
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

type ProfileInterest = { name: string };

export const UserProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    const getProfile = async () => {
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

    getProfile();
  }, [toast]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
        <span className="ml-2 text-lg text-easyroi-navy">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProfileMainCard
          profile={profile}
          isEditing={isEditing}
          isSaving={isSaving}
          setProfile={setProfile}
          interests={interests}
          availableInterests={availableInterests}
          handleSaveProfile={handleSaveProfile}
          setIsEditing={setIsEditing}
          addInterest={addInterest}
          removeInterest={removeInterest}
        />
        
        <SecurityPrivacyCard />
      </div>
      
      <div>
        <InvestmentSummary />
        <RecentActivityCard />
      </div>
    </div>
  );
};

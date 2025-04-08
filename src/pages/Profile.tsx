
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";
import { ProfileMainCard } from "@/components/profile/ProfileMainCard";
import { SecurityPrivacyCard } from "@/components/profile/SecurityPrivacyCard";
import InvestmentSummary from "@/components/profile/InvestmentSummaryCard";
import RecentActivityCard from "@/components/profile/RecentActivityCard";
import { ProfileVisibility } from "@/services/networkService";

type InvestorLevel = Database['public']['Tables']['profiles']['Row']['level'];
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

const Profile = () => {
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
          const joinDate = new Date(profileData.join_date);
          const joinMonth = joinDate.toLocaleString('default', { month: 'long' });
          const joinYear = joinDate.getFullYear();
          
          setProfile({
            ...profileData,
            join_date: `Member since ${joinMonth} ${joinYear}`,
            // Ensure visibility is one of the allowed values or default to 'public'
            visibility: (profileData.visibility as ProfileVisibility) || 'public'
          });
        }
        
        if (userInterests) {
          setInterests(userInterests.map((item: any) => ({ name: item.interests.name })));
        }
        
        if (allInterests) {
          setAvailableInterests(allInterests);
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
      <DashboardLayout title="My Profile" subtitle="View and edit your profile information">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
          <span className="ml-2 text-lg text-easyroi-navy">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile" subtitle="View and edit your profile information">
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
    </DashboardLayout>
  );
};

export default Profile;

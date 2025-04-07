
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calendar, Edit, Loader2, MapPin, Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Database } from "@/integrations/supabase/types";

type InvestorLevel = Database['public']['Tables']['profiles']['Row']['level'];
type ProfileData = Database['public']['Tables']['profiles']['Row'] & {
  join_date: string;
};
type ProfileInterest = { name: string };

const Profile = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
    avatar_url: null
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
          .select('*')
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
            join_date: `${t('memberSince')} ${joinMonth} ${joinYear}`
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
          title: t('errorOccurred'),
          description: t('errorLoadingProfile'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [toast, t]);

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
        title: t('profileUpdated'),
        description: t('profileInfoSaved')
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t('errorOccurred'),
        description: t('errorUpdatingProfile'),
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
        title: t('errorOccurred'),
        description: t('errorAddingInterest'),
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
        title: t('errorOccurred'),
        description: t('errorRemovingInterest'),
        variant: "destructive"
      });
    }
  };

  const investmentSummary = [
    { label: t('totalProperties'), value: "6" },
    { label: t('portfolioValue'), value: "€2,450,000" },
    { label: t('averageROI'), value: "7.4%" },
    { label: t('yearsInvesting'), value: "3" },
  ];

  const recentActivity = [
    {
      type: "property-view",
      description: t('viewedProperty'),
      date: t('daysAgo', { days: 2 })
    },
    {
      type: "event-rsvp",
      description: t('rsvpEvent'),
      date: t('daysAgo', { days: 5 })
    },
    {
      type: "document-download",
      description: t('downloadedReport'),
      date: t('weeksAgo', { weeks: 1 })
    },
    {
      type: "property-favorite",
      description: t('addedFavorite'),
      date: t('weeksAgo', { weeks: 2 })
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title={t('myProfile')} subtitle={t('profileSubtitle')}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
          <span className="ml-2 text-lg text-easyroi-navy">{t('loadingProfile')}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('myProfile')} subtitle={t('profileSubtitle')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{t('profileInformation')}</CardTitle>
                  <CardDescription>{t('profileDescription')}</CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isSaving}
                  className={isEditing ? "bg-easyroi-navy hover:bg-easyroi-navy/90" : ""}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('saving')}
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t('saveChanges')}
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('editProfile')}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                  <BadgeLevel level={profile?.level as InvestorLevel} className="mb-2" />
                  <p className="text-sm text-center text-gray-500">{profile?.join_date}</p>
                  
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      {t('changePhoto')}
                    </Button>
                  )}
                </div>
                
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">{t('firstName')}</label>
                      {isEditing ? (
                        <Input 
                          value={profile.first_name || ''} 
                          onChange={(e) => setProfile({...profile, first_name: e.target.value})} 
                        />
                      ) : (
                        <p className="mt-1">{profile.first_name || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t('lastName')}</label>
                      {isEditing ? (
                        <Input 
                          value={profile.last_name || ''} 
                          onChange={(e) => setProfile({...profile, last_name: e.target.value})} 
                        />
                      ) : (
                        <p className="mt-1">{profile.last_name || '-'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">{t('email')}</label>
                      {isEditing ? (
                        <Input 
                          value={profile.email} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})} 
                        />
                      ) : (
                        <p className="mt-1">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t('phone')}</label>
                      {isEditing ? (
                        <Input 
                          value={profile.phone || ''} 
                          onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                        />
                      ) : (
                        <p className="mt-1">{profile.phone || '-'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-sm font-medium">{t('location')}</label>
                    {isEditing ? (
                      <Input 
                        value={profile.location || ''} 
                        onChange={(e) => setProfile({...profile, location: e.target.value})} 
                      />
                    ) : (
                      <p className="mt-1 flex items-center">
                        {profile.location ? (
                          <>
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {profile.location}
                          </>
                        ) : '-'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">{t('bio')}</label>
                    {isEditing ? (
                      <Textarea 
                        value={profile.bio || ''} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 text-sm">{profile.bio || '-'}</p>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4">
                      <label className="text-sm font-medium">{t('investmentInterests')}</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {interests.map(interest => (
                          <Badge 
                            key={interest.name} 
                            variant="outline"
                            className="px-3 py-1 gap-1"
                          >
                            {interest.name}
                            <button 
                              className="ml-1 text-gray-500 hover:text-red-500"
                              onClick={() => removeInterest(interest.name)}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <div className="relative">
                          <select 
                            className="appearance-none border rounded-md px-3 py-1 text-sm"
                            onChange={(e) => {
                              if (e.target.value) {
                                addInterest(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            value=""
                          >
                            <option value="">{t('addInterest')}</option>
                            {availableInterests
                              .filter(ai => !interests.some(i => i.name === ai.name))
                              .map(interest => (
                                <option key={interest.id} value={interest.id}>
                                  {interest.name}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('securityPrivacy')}</CardTitle>
              <CardDescription>{t('securityPrivacyDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" /> 
                    {t('passwordSettings')}
                  </h4>
                  <Button variant="outline" size="sm">{t('changePassword')}</Button>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">{t('notificationPreferences')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>{t('emailNotifications')}</span>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>{t('smsNotifications')}</span>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>{t('appNotifications')}</span>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('investmentSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {investmentSummary.map((item) => (
                  <div key={item.label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-xl font-bold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Building2 className="mr-2 h-4 w-4" /> {t('viewAllProperties')}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start pb-3 border-b last:border-0 last:pb-0">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

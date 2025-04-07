
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calendar, Edit, MapPin, Save, Shield, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Sample user profile data
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+39 123 456 7890",
    location: "Milan, Italy",
    bio: "Experienced real estate investor with focus on luxury properties across Europe and the Middle East. Passionate about architectural preservation and sustainable development.",
    joinDate: "Member since February 2023",
    level: "gold",
    interests: ["Luxury Residential", "Commercial", "Historic Properties"],
    notifications: {
      email: true,
      sms: false,
      app: true
    }
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const investmentSummary = [
    { label: "Total Properties", value: "6" },
    { label: "Portfolio Value", value: "€2,450,000" },
    { label: "Average ROI", value: "7.4%" },
    { label: "Years Investing", value: "3" },
  ];

  const recentActivity = [
    {
      type: "property-view",
      description: "Viewed Villa Toscana property details",
      date: "2 days ago"
    },
    {
      type: "event-rsvp",
      description: "RSVP'd to Dubai Property Showcase",
      date: "5 days ago"
    },
    {
      type: "document-download",
      description: "Downloaded Q1 Investment Report",
      date: "1 week ago"
    },
    {
      type: "property-favorite",
      description: "Added Marina Apartments to favorites",
      date: "2 weeks ago"
    },
  ];

  return (
    <DashboardLayout title="My Profile" subtitle="Manage your investor profile and account settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className={isEditing ? "bg-easyroi-navy hover:bg-easyroi-navy/90" : ""}
                >
                  {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                  <BadgeLevel level={profile.level} className="mb-2" />
                  <p className="text-sm text-center text-gray-500">{profile.joinDate}</p>
                  
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Change Photo
                    </Button>
                  )}
                </div>
                
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      {isEditing ? (
                        <Input value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
                      ) : (
                        <p className="mt-1">{profile.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      {isEditing ? (
                        <Input value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
                      ) : (
                        <p className="mt-1">{profile.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      {isEditing ? (
                        <Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                      ) : (
                        <p className="mt-1">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      {isEditing ? (
                        <Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                      ) : (
                        <p className="mt-1">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-sm font-medium">Location</label>
                    {isEditing ? (
                      <Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
                    ) : (
                      <p className="mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {profile.location}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    {isEditing ? (
                      <Textarea 
                        value={profile.bio} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 text-sm">{profile.bio}</p>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4">
                      <label className="text-sm font-medium">Investment Interests</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.interests.map(interest => (
                          <Badge key={interest} variant="outline">{interest}</Badge>
                        ))}
                        <Button variant="outline" size="sm" className="h-6">+ Add</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>Manage your account security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" /> 
                    Password Settings
                  </h4>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Notification Preferences</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Email Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={profile.notifications.email}
                        onChange={() => setProfile({...profile, notifications: {...profile.notifications, email: !profile.notifications.email}})}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>SMS Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={profile.notifications.sms}
                        onChange={() => setProfile({...profile, notifications: {...profile.notifications, sms: !profile.notifications.sms}})}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>App Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={profile.notifications.app}
                        onChange={() => setProfile({...profile, notifications: {...profile.notifications, app: !profile.notifications.app}})}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Sidebar - Summary & Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
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
                <Building2 className="mr-2 h-4 w-4" /> View All Properties
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
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

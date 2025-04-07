
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

type ProfileData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
};

type ProfileFormProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  interests: { name: string }[];
  availableInterests: { id: string, name: string }[];
  addInterest: (interestId: string) => void;
  removeInterest: (interestName: string) => void;
};

export const ProfileForm = ({
  profile,
  isEditing,
  setProfile,
  interests,
  availableInterests,
  addInterest,
  removeInterest
}: ProfileFormProps) => {
  return (
    <div className="md:w-2/3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
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
          <label className="text-sm font-medium">Last Name</label>
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
          <label className="text-sm font-medium">Email</label>
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
          <label className="text-sm font-medium">Phone</label>
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
        <label className="text-sm font-medium">Location</label>
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
        <label className="text-sm font-medium">Bio</label>
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
          <label className="text-sm font-medium">Investment Interests</label>
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
                <option value="">Add Interest</option>
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
  );
};

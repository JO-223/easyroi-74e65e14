
import React from "react";
import { Badge } from "@/components/ui/badge";

type ProfileInterestsProps = {
  interests: { name: string }[];
  availableInterests: { id: string, name: string }[];
  addInterest: (interestId: string) => Promise<void>;
  removeInterest: (interestName: string) => Promise<void>;
};

export const ProfileInterests = ({
  interests,
  availableInterests,
  addInterest,
  removeInterest
}: ProfileInterestsProps) => {
  return (
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
  );
};

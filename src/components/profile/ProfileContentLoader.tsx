
import React from "react";
import { Loader2 } from "lucide-react";

export const ProfileContentLoader = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
      <span className="ml-2 text-lg text-easyroi-navy">Loading profile...</span>
    </div>
  );
};

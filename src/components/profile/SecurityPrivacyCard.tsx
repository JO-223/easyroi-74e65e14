
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export const SecurityPrivacyCard = () => {
  return (
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
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span>SMS Notifications</span>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span>App Notifications</span>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

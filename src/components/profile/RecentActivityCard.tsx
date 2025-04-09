
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Calendar, FileDown, Heart, Eye, Loader2 } from "lucide-react";
import { fetchUserRecentActivities, formatActivityDate, UserActivity } from "@/services/user/userActivityService";

const RecentActivityCard = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      const data = await fetchUserRecentActivities();
      setActivities(data);
      setIsLoading(false);
    };
    
    loadActivities();
  }, []);

  // Helper function to get appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property-view':
        return <Eye className="h-5 w-5 text-gray-500" />;
      case 'document-download':
        return <FileDown className="h-5 w-5 text-gray-500" />;
      case 'property-favorite':
        return <Heart className="h-5 w-5 text-gray-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-center text-gray-500">
          No recent activities found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start pb-3 border-b last:border-0 last:pb-0">
              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                {getActivityIcon(activity.activity_type)}
              </div>
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatActivityDate(activity.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;

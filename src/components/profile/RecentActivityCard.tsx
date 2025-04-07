
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Calendar } from "lucide-react";

type ActivityItem = {
  type: string;
  description: string;
  date: string;
};

const RecentActivityCard = () => {
  const recentActivity = [
    {
      type: "property-view",
      description: "Viewed Villa Serena property details",
      date: "2 days ago"
    },
    {
      type: "event-rsvp",
      description: "RSVP'd to Investment Workshop",
      date: "5 days ago"
    },
    {
      type: "document-download",
      description: "Downloaded Q2 Investment Report",
      date: "1 week ago"
    },
    {
      type: "property-favorite",
      description: "Added Marina Heights to favorites",
      date: "2 weeks ago"
    },
  ];

  return (
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
  );
};

export default RecentActivityCard;

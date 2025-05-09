
import { ClubDeal } from "@/types/clubDeal";

export async function getClubDeals(): Promise<ClubDeal[]> {
  // In a real app, this would fetch from Supabase
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockClubDeals);
    }, 800);
  });
}

export async function getClubDealById(id: string): Promise<ClubDeal | null> {
  // In a real app, this would fetch from Supabase
  return new Promise((resolve) => {
    setTimeout(() => {
      const deal = mockClubDeals.find(deal => deal.id === id);
      resolve(deal || null);
    }, 500);
  });
}

// Mock data
const mockClubDeals: ClubDeal[] = [
  {
    id: "cd1",
    name: "Palm Jumeirah Residences",
    location: {
      city: "Dubai",
      country: "UAE",
      address: "Palm Jumeirah",
      latitude: 25.1124,
      longitude: 55.1390
    },
    description: "Exclusive beachfront apartments with stunning sea views",
    price: 3500000,
    roi_percentage: 8.5,
    type: {
      id: "d7a92651-0c7e-4432-9ea0-90f16f2a6038",
      name: "Club Deal"
    },
    status: "Active",
    minInvestment: 250000,
    totalInvestors: 14,
    requiredInvestorLevel: "bronze",
    totalShares: 100,
    availableShares: 35,
    projectCompletion: 80,
    estimatedCompletion: "2023-12-31",
    documents: [
      {
        id: "doc1",
        title: "Investment Brochure",
        description: "Detailed overview of the investment opportunity",
        url: "#",
        fileType: "pdf"
      },
      {
        id: "doc2",
        title: "Financial Projections",
        description: "5-year ROI analysis and cash flow projections",
        url: "#",
        fileType: "excel"
      }
    ],
    images: [
      {
        id: "img1",
        url: "/lovable-uploads/8f62e7e7-e2ac-4ee6-bfee-3019052700d0.png",
        is_primary: true
      }
    ],
    amenities: [
      { id: "am1", name: "Private Beach", icon: "umbrella" },
      { id: "am2", name: "Infinity Pool", icon: "droplet" },
      { id: "am3", name: "Spa & Gym", icon: "dumbbell" },
      { id: "am4", name: "Concierge", icon: "bell" }
    ]
  },
  {
    id: "cd2",
    name: "Downtown Business Center",
    location: {
      city: "Dubai",
      country: "UAE",
      address: "Downtown Dubai",
      latitude: 25.2048,
      longitude: 55.2708
    },
    description: "Prime office spaces in Dubai's business district",
    price: 5200000,
    roi_percentage: 7.2,
    type: {
      id: "d7a92651-0c7e-4432-9ea0-90f16f2a6038",
      name: "Club Deal"
    },
    status: "Active",
    minInvestment: 500000,
    totalInvestors: 10,
    requiredInvestorLevel: "silver",
    totalShares: 100,
    availableShares: 20,
    projectCompletion: 100,
    estimatedCompletion: "2023-03-15",
    documents: [
      {
        id: "doc3",
        title: "Market Analysis",
        description: "Commercial real estate trends in Dubai",
        url: "#",
        fileType: "pdf"
      }
    ],
    images: [
      {
        id: "img2",
        url: "/lovable-uploads/9496436e-cc5e-4188-9411-1dea4b718fc3.png",
        is_primary: true
      }
    ],
    amenities: [
      { id: "am5", name: "24/7 Security", icon: "shield" },
      { id: "am6", name: "Smart Building", icon: "wifi" },
      { id: "am7", name: "Conference Rooms", icon: "users" },
      { id: "am8", name: "Parking", icon: "car" }
    ]
  },
  {
    id: "cd3",
    name: "Marina Towers",
    location: {
      city: "Dubai",
      country: "UAE",
      address: "Dubai Marina",
      latitude: 25.0650,
      longitude: 55.1376
    },
    description: "Luxury apartments with waterfront views",
    price: 4800000,
    roi_percentage: 6.8,
    type: {
      id: "d7a92651-0c7e-4432-9ea0-90f16f2a6038",
      name: "Club Deal"
    },
    status: "Coming Soon",
    minInvestment: 350000,
    totalInvestors: 0,
    requiredInvestorLevel: "bronze",
    totalShares: 100,
    availableShares: 100,
    projectCompletion: 45,
    estimatedCompletion: "2024-08-20",
    documents: [
      {
        id: "doc4",
        title: "Project Timeline",
        description: "Construction and investment milestones",
        url: "#",
        fileType: "pdf"
      }
    ],
    images: [
      {
        id: "img3",
        url: "/lovable-uploads/c6fb964a-ed49-478a-88c3-5d395e52f920.png",
        is_primary: true
      }
    ],
    amenities: [
      { id: "am9", name: "Marina Access", icon: "anchor" },
      { id: "am10", name: "Infinity Pool", icon: "droplet" },
      { id: "am11", name: "Fitness Center", icon: "dumbbell" },
      { id: "am12", name: "Residents Lounge", icon: "coffee" }
    ]
  }
];

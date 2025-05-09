
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
      zone: "Waterfront"
    },
    description: "Exclusive beachfront apartments with stunning sea views",
    totalPrice: 3500000,
    currentValue: 3800000,
    expectedRentalROI: 8.5,
    expectedTotalROI: 12.3,
    type: {
      id: "d7a92651-0c7e-4432-9ea0-90f16f2a6038",
      name: "Club Deal"
    },
    status: "funding_in_progress",
    minInvestment: 250000,
    investorsCount: 14,
    investorLevel: "bronze",
    totalShares: 100,
    availableShares: 35,
    projectCompletion: 80,
    estimatedCompletion: "2023-12-31",
    fundingTarget: 3500000,
    fundingCurrent: 2275000,
    fundingDeadline: "2023-10-31",
    documents: [
      {
        id: "doc1",
        title: "Investment Brochure",
        description: "Detailed overview of the investment opportunity",
        url: "#",
        fileType: "pdf",
        uploadDate: "2023-05-15",
        isRestricted: false
      },
      {
        id: "doc2",
        title: "Financial Projections",
        description: "5-year ROI analysis and cash flow projections",
        url: "#",
        fileType: "excel",
        uploadDate: "2023-05-20",
        isRestricted: true
      }
    ],
    images: [
      {
        id: "img1",
        url: "/lovable-uploads/8f62e7e7-e2ac-4ee6-bfee-3019052700d0.png",
        is_primary: true
      }
    ],
    timeline: [
      {
        id: "t1",
        title: "Property Selection",
        date: "2023-05-01",
        description: "Selection of property based on market analysis",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t2",
        title: "Due Diligence",
        date: "2023-06-15",
        description: "Legal and financial verification",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t3",
        title: "Funding Start",
        date: "2023-07-01",
        description: "Opening of investment round",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t4",
        title: "Property Purchase",
        date: "2023-11-30",
        description: "Finalization of property acquisition",
        completed: false,
        phase: "acquisition"
      },
      {
        id: "t5",
        title: "Rental Start",
        date: "2024-01-15",
        description: "Begin rental operations",
        completed: false,
        phase: "rental"
      },
      {
        id: "t6",
        title: "First Dividend",
        date: "2024-04-15",
        description: "First quarterly dividend payment",
        completed: false,
        phase: "rental"
      },
      {
        id: "t7",
        title: "Market Evaluation",
        date: "2025-01-15",
        description: "Assessment of property value and market conditions",
        completed: false,
        phase: "exit"
      },
      {
        id: "t8",
        title: "Sale Process",
        date: "2025-06-15",
        description: "Property listing and sale process",
        completed: false,
        phase: "exit"
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
      zone: "Business District"
    },
    description: "Prime office spaces in Dubai's business district",
    totalPrice: 5200000,
    currentValue: 5300000,
    expectedRentalROI: 7.2,
    expectedTotalROI: 10.5,
    type: {
      id: "d7a92651-0c7e-4432-9ea0-90f16f2a6038",
      name: "Club Deal"
    },
    status: "property_acquired",
    minInvestment: 500000,
    investorsCount: 10,
    investorLevel: "silver",
    totalShares: 100,
    availableShares: 20,
    projectCompletion: 100,
    estimatedCompletion: "2023-03-15",
    fundingTarget: 5200000,
    fundingCurrent: 5200000,
    fundingDeadline: "2023-01-15",
    purchaseDate: "2023-02-10",
    documents: [
      {
        id: "doc3",
        title: "Market Analysis",
        description: "Commercial real estate trends in Dubai",
        url: "#",
        fileType: "pdf",
        uploadDate: "2023-01-20",
        isRestricted: false
      }
    ],
    images: [
      {
        id: "img2",
        url: "/lovable-uploads/9496436e-cc5e-4188-9411-1dea4b718fc3.png",
        is_primary: true
      }
    ],
    timeline: [
      {
        id: "t9",
        title: "Property Selection",
        date: "2022-09-01",
        description: "Selection of property based on market analysis",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t10",
        title: "Due Diligence",
        date: "2022-10-15",
        description: "Legal and financial verification",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t11",
        title: "Funding Completed",
        date: "2023-01-15",
        description: "All investment funds secured",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t12",
        title: "Property Purchase",
        date: "2023-02-10",
        description: "Finalization of property acquisition",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t13",
        title: "Rental Operations",
        date: "2023-03-01",
        description: "Begin rental operations",
        completed: true,
        phase: "rental"
      },
      {
        id: "t14",
        title: "First Dividend",
        date: "2023-06-15",
        description: "First quarterly dividend payment",
        completed: false,
        phase: "rental"
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
      zone: "Marina"
    },
    description: "Luxury apartments with waterfront views",
    totalPrice: 4800000,
    currentValue: 3800000,
    expectedRentalROI: 6.8,
    expectedTotalROI: 9.5,
    type: {
      id: "d7a92651-0c7e-4432-9ea0-90f16f2a6038",
      name: "Club Deal"
    },
    status: "funding_in_progress",
    minInvestment: 350000,
    investorsCount: 0,
    investorLevel: "bronze",
    totalShares: 100,
    availableShares: 100,
    projectCompletion: 45,
    estimatedCompletion: "2024-08-20",
    fundingTarget: 4800000,
    fundingCurrent: 1920000,
    fundingDeadline: "2024-02-20",
    documents: [
      {
        id: "doc4",
        title: "Project Timeline",
        description: "Construction and investment milestones",
        url: "#",
        fileType: "pdf",
        uploadDate: "2023-08-10",
        isRestricted: false
      }
    ],
    images: [
      {
        id: "img3",
        url: "/lovable-uploads/c6fb964a-ed49-478a-88c3-5d395e52f920.png",
        is_primary: true
      }
    ],
    timeline: [
      {
        id: "t15",
        title: "Property Selection",
        date: "2023-07-01",
        description: "Selection of property based on market analysis",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t16",
        title: "Due Diligence",
        date: "2023-08-15",
        description: "Legal and financial verification",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t17",
        title: "Funding Start",
        date: "2023-09-01",
        description: "Opening of investment round",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t18",
        title: "Property Purchase",
        date: "2024-03-30",
        description: "Finalization of property acquisition",
        completed: false,
        phase: "acquisition"
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

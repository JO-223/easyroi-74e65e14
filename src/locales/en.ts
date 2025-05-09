import { GeneralKey } from "@/utils/translations/general";
import { PropertyKey } from "@/utils/translations/property";
import { AdminKey } from "@/utils/translations/admin";
import { DashboardKey } from "@/utils/translations/dashboard";
import { SettingsKey } from "@/utils/translations/settings";
import { DevelopmentKey } from "@/utils/translations/development";
import { AnalyticsKey } from "@/utils/translations/analytics";
import { EventsKey } from "@/utils/translations/events";
import { NetworkKey } from "@/utils/translations/network";
import { ProfileKey } from "@/utils/translations/profile";
import { LandingKey } from "@/utils/translations/landing";
import { AboutKey } from "@/utils/translations/about";
import { ContactKey } from "@/utils/translations/contact";
import { AuthKey } from "@/utils/translations/auth";
import { UIKey } from "@/utils/translations/ui";
import { MiscKey } from "@/utils/translations/misc";
import { TooltipKey } from "@/utils/translations/tooltip";
import { InvestorKey } from "@/utils/translations/investor";
import { LegalKey } from "@/utils/translations/legal";
import { ConsultationKey } from "@/utils/translations/consultation";
import { ClubDealKey } from "@/utils/translations/clubDeal";

export type TranslationKey =
  | GeneralKey
  | PropertyKey
  | AdminKey
  | DashboardKey
  | SettingsKey
  | DevelopmentKey
  | AnalyticsKey
  | EventsKey
  | NetworkKey
  | ProfileKey
  | LandingKey
  | AboutKey
  | ContactKey
  | AuthKey
  | UIKey
  | MiscKey
  | TooltipKey
  | InvestorKey
  | LegalKey
  | ConsultationKey
  | ClubDealKey;

export const en: { [key in TranslationKey]: string } = {
  // General
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  cancel: "Cancel",
  confirm: "Confirm",
  loading: "Loading...",
  success: "Success!",
  error: "Error!",
  tbd: "TBD",
  today: "Today",
  yes: "Yes",
  no: "No",
  logout: "Logout",
  overview: "Overview",
  filter: "Filter",
  reset: "Reset",
  search: "Search",
  menu: "Menu",
  language: "Language",
  close: "Close",
  next: "Next",
  back: "Back",
  submit: "Submit",
  details: "Details",
  information: "Information",
  // Property
  property: "Property",
  properties: "Properties",
  addProperty: "Add Property",
  propertyName: "Property Name",
  propertyType: "Property Type",
  propertyLocation: "Property Location",
  propertyAddress: "Property Address",
  propertyZone: "Property Zone",
  propertyCity: "Property City",
  propertyCountry: "Property Country",
  propertyPrice: "Property Price",
  propertySize: "Property Size (sqm)",
  propertyBedrooms: "Property Bedrooms",
  propertyBathrooms: "Property Bathrooms",
  propertyDescription: "Property Description",
  propertyAmenities: "Property Amenities",
  propertyImage: "Property Image",
  propertyStatus: "Property Status",
  propertyCreated: "Property Created",
  propertyUpdated: "Property Updated",
  propertyDetails: "Property Details",
  propertyNotFound: "Property Not Found",
  propertyTypeStudio: "Studio",
  propertyTypeApartment: "Apartment",
  propertyTypeHouse: "House",
  propertyTypeVilla: "Villa",
  propertyTypeLand: "Land",
  propertyStatusAvailable: "Available",
  propertyStatusOccupied: "Occupied",
  propertyStatusUnderMaintenance: "Under Maintenance",
  propertyAddressPlaceholder: "Enter address",
  propertyZonePlaceholder: "Enter zone",
  propertyCityPlaceholder: "Enter city",
  propertyCountryPlaceholder: "Enter country",
  propertyPricePlaceholder: "Enter price",
  propertySizePlaceholder: "Enter size in square meters",
  propertyBedroomsPlaceholder: "Enter number of bedrooms",
  propertyBathroomsPlaceholder: "Enter number of bathrooms",
  propertyImagePlaceholder: "Upload image",
  noPropertiesFound: "No properties found",
  tryDifferentFilters: "Try different filters",
  minPrice: "Min Price",
  maxPrice: "Max Price",
  investmentLevel: "Investment Level",
  allLevels: "All Levels",
  propertyForSale: "Property for Sale",
  estimatedRentalYield: "Estimated Rental Yield",
  enterLocation: "Enter Location",
  estimatedTotalROI: "Estimated Total ROI",
  estimatedRentalROI: "Estimated Rental ROI",
  dealStatus: "Deal Status",
  all: "All",
  fundingInProgress: "Funding in Progress",
  propertyAcquired: "Property Acquired",
  inRental: "In Rental",
  readyForSale: "Ready for Sale",
  completedDeal: "Completed Deal",
  minInvestment: "Min. Investment",
  investorsParticipating: "Investors Participating",
  projectDetails: "Project Details",
  noProjectsFound: "No projects found",
  // Admin
  adminDashboard: "Admin Dashboard",
  adminProperties: "Properties",
  adminUsers: "Users",
  adminSettings: "Settings",
  adminTitle: "Admin",
  add: "Add",
  editProperty: "Edit Property",
  addPropertyType: "Add Property Type",
  editPropertyType: "Edit Property Type",
  propertyTypeName: "Property Type Name",
  propertyTypeDescription: "Property Type Description",
  propertyTypeId: "Property Type ID",
  propertyTypes: "Property Types",
  noPropertyTypesFound: "No property types found",
  addTestData: "Add Test Data",
  testDataAddedSuccessfully: "Test data added successfully!",
  addPropertyForUser: "Add Property for User",
  selectUser: "Select User",
  propertyPriceCurrency: "Property Price Currency",
  propertyListingStatus: "Property Listing Status",
  propertyListingStatusOptions: "For Rent, For Sale, Sold",
  propertyListingStatusForRent: "For Rent",
  propertyListingStatusForSale: "For Sale",
  propertyListingStatusSold: "Sold",
  propertyServiceCharges: "Property Service Charges",
  propertyOwnership: "Property Ownership",
  propertyOwnershipPercentage: "Property Ownership Percentage",
  propertyOwnershipPlaceholder: "Enter percentage of ownership",
  propertyListingStatusPlaceholder: "Select listing status",
  propertyServiceChargesPlaceholder: "Enter service charges",
  propertyPriceCurrencyPlaceholder: "Select currency",
  propertyInvestorLevel: "Property Investor Level",
  propertyInvestorLevelPlaceholder: "Select investor level",
  propertyMinInvestment: "Property Minimum Investment",
  propertyMinInvestmentPlaceholder: "Enter minimum investment",
  propertyExpectedTotalROI: "Property Expected Total ROI",
  propertyExpectedTotalROIPlaceholder: "Enter expected total ROI",
  propertyAddForSale: "Add Property for Sale",
  // Dashboard
  dashboard: "Dashboard",
  welcome: "Welcome",
  totalProperties: "Total Properties",
  totalInvestment: "Total Investment",
  rentalIncome: "Rental Income",
  propertyValue: "Property Value",
  marketTrends: "Market Trends",
  investmentPortfolio: "Investment Portfolio",
  recentActivities: "Recent Activities",
  viewAll: "View All",
  myProperties: "My Properties",
  investNow: "Invest Now",
  // Settings
  settings: "Settings",
  accountSettings: "Account Settings",
  profileSettings: "Profile Settings",
  notificationSettings: "Notification Settings",
  securitySettings: "Security Settings",
  updatePassword: "Update Password",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  passwordRequirements:
    "Password must be at least 8 characters long and contain a number.",
  passwordMismatch: "Passwords do not match.",
  passwordUpdatedSuccessfully: "Password updated successfully!",
  profileUpdatedSuccessfully: "Profile updated successfully!",
  // Development
  developmentProjects: "Development Projects",
  exploreDevelopmentProjects: "Explore our latest development projects",
  developmentName: "Development Name",
  developmentLocation: "Development Location",
  developmentDescription: "Development Description",
  expectedCompletion: "Expected Completion",
  constructionStage: "Construction Stage",
  progressPercentage: "Progress Percentage",
  totalUnits: "Total Units",
  availableUnits: "Available Units",
  developmentDetails: "Development Details",
  developmentProject: "Development Project",
  noDevelopmentProjectsFound: "No development projects found",
  // Analytics
  analyticsDashboard: "Analytics Dashboard",
  investmentOverview: "Investment Overview",
  marketAnalysis: "Market Analysis",
  performanceMetrics: "Performance Metrics",
  // Events
  events: "Events",
  upcomingEvents: "Upcoming Events",
  pastEvents: "Past Events",
  eventTitle: "Event Title",
  eventDescription: "Event Description",
  eventDate: "Event Date",
  eventTime: "Event Time",
  eventLocation: "Event Location",
  eventType: "Event Type",
  eventDetails: "Event Details",
  noEventsFound: "No events found",
  eventRegistration: "Event Registration",
  maxAttendees: "Max Attendees",
  currentAttendees: "Current Attendees",
  eventRegistrationSuccess: "You have successfully registered for this event!",
  free: "Free",
  onlineEvent: "Online Event",
  inPersonEvent: "In-Person Event",
  // Network
  network: "Network",
  findProfessionals: "Find Professionals",
  realEstateAgents: "Real Estate Agents",
  propertyManagers: "Property Managers",
  financialAdvisors: "Financial Advisors",
  networkDescription:
    "Connect with trusted professionals in the real estate industry.",
  // Profile
  profile: "Profile",
  myProfile: "My Profile",
  editProfile: "Edit Profile",
  viewProfile: "View Profile",
  profileDetails: "Profile Details",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phoneNumber: "Phone Number",
  updateProfile: "Update Profile",
  // Landing
  heroTitle: "Invest in Your Future with Lovable",
  heroSubtitle:
    "Discover a new way to invest in real estate. Secure, transparent, and profitable.",
  getStarted: "Get Started",
  learnMore: "Learn More",
  // About
  aboutUs: "About Us",
  ourMission: "Our Mission",
  ourVision: "Our Vision",
  ourValues: "Our Values",
  // Contact
  contactUs: "Contact Us",
  sendMessage: "Send Message",
  yourName: "Your Name",
  yourEmail: "Your Email",
  yourMessage: "Your Message",
  // Auth
  login: "Login",
  register: "Register",
  emailPlaceholder: "Enter your email",
  passwordPlaceholder: "Enter your password",
  namePlaceholder: "Enter your name",
  registerSuccess: "Registration successful!",
  loginSuccess: "Login successful!",
  logoutSuccess: "Logout successful!",
  // UI
  themes: "Themes",
  light: "Light",
  dark: "Dark",
  system: "System",
  // Misc
  pageNotFound: "Page Not Found",
  unauthorized: "Unauthorized",
  // Tooltip
  tooltipEdit: "Edit",
  tooltipDelete: "Delete",
  // Investor
  investorDashboard: "Investor Dashboard",
  investmentOpportunities: "Investment Opportunities",
  investmentPerformance: "Investment Performance",
  exploreInvestments: "Explore Investments",
  // Legal
  termsOfService: "Terms of Service",
  privacyPolicy: "Privacy Policy",
  cookiePolicy: "Cookie Policy",
  // Consultation
  bookConsultation: "Book a Consultation",
  consultationType: "Consultation Type",
  preferredDate: "Preferred Date",
  preferredTime: "Preferred Time",
  consultationNotes: "Additional Notes",
  // Club Deal
  clubDeal: "Club Deal",
  exploreClubDeals: "Explore Club Deals",
  fundingTarget: "Funding Target",
  fundingProgress: "Funding Progress",
  fundingDeadline: "Funding Deadline",
  daysRemaining: "Days Remaining",
  estimatedRentalDuration: "Estimated Rental Duration",
  joinClubDeal: "Join Club Deal",
  downloadBusinessPlan: "Download Business Plan",
  contactDealManager: "Contact Deal Manager",
  dealDocuments: "Deal Documents",
  dealTimeline: "Deal Timeline",
  acquisitionPhase: "Acquisition Phase",
  rentalPhase: "Rental Phase",
  exitPhase: "Exit Phase",
  currentPropertyValue: "Current Property Value",
  totalPrice: "Total Price",
  purchaseDate: "Purchase Date",
  please: "Please",
  toViewDocuments: "to view documents",
  onlyShowingClubDealProperties: "Only showing properties with 'Club Deal' type",
};

/**
 * FORM CONSTANTS & DEFAULT STATE (40+ Fields)
 * Organized across 8 logical sections.
 */

export const INITIAL_FORM_VALUES = {
  // Section 1: Basic Information
  title: "",
  listingType: "Sale", // 'Sale' | 'Rent'
  propertyType: "Apartment", // 'Apartment' | 'Villa' | 'Penthouse' | 'Plot' | 'Commercial'
  purpose: "Self-Occupancy",
  status: "Ready to Move",
  description: "",

  // Section 2: Location
  address: "",
  unitNo: "",
  locality: "",
  city: "Gurugram",
  state: "Haryana",
  pincode: "",
  landmark: "",
  country: "India",

  // Section 3: Property Details
  bedrooms: "3",
  bathrooms: "3",
  balconies: "2",
  floorNo: "5",
  totalFloors: "15",
  carpetArea: "",
  superBuiltUpArea: "",
  plotArea: "",
  roadWidth: "",
  boundaryWall: false,
  propertyAge: "0-1 year",
  facing: "East",

  // Section 4: Valuation & Price
  expectedPrice: "",
  isNegotiable: true,
  maintenanceCharges: "",
  maintenanceFrequency: "Monthly",
  securityDeposit: "",
  bookingAmount: "",
  leaseDuration: "11 Months",

  // Section 5: Curated Amenities
  amenities: ["Lift", "Parking", "Security", "Power backup"],

  // Section 6: Furnishing & Inventory
  furnishingStatus: "Semi-Furnished", // 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished'
  bedsCount: 0,
  wardrobesCount: 2,
  fansCount: 4,
  lightsCount: 10,
  acCount: 2,
  geyserCount: 2,
  modularKitchen: true,

  // Section 7: Owner / Contact
  ownerName: "Yatharth",
  ownerPhone: "9810123456",
  ownerEmail: "yatharth@habitex.in",
  contactMethod: "Phone & WhatsApp",

  // Section 8: Photographs
  images: []
};

export const AMENITIES_LIST = [
  "Lift",
  "Parking",
  "Security",
  "Power backup",
  "Gym",
  "Swimming pool",
  "Garden",
  "Clubhouse",
  "CCTV",
  "Internet / Wi-Fi",
  "Air conditioning",
  "Piped Gas",
  "Intercom",
  "Fire fighting systems",
  "Rainwater harvesting",
  "Visitor parking"
];

export const PROPERTY_TYPES_OPTIONS = [
  { value: "Apartment", label: "Apartment" },
  { value: "Villa", label: "Villa" },
  { value: "Penthouse", label: "Penthouse" },
  { value: "Plot", label: "Plot" },
  { value: "Commercial", label: "Commercial" }
];

export const CITIES_LIST = [
  "Gurugram",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chandigarh",
  "Delhi",
  "Noida",
  "Chennai"
];

export const FACING_OPTIONS = [
  "East",
  "North",
  "North-East",
  "North-West",
  "South",
  "South-East",
  "South-West",
  "West"
];

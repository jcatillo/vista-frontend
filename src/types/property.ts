// types.ts

// --- Enums & Constants (Matched from Pydantic Validators) ---

export type PropertyType =
  | "House"
  | "Condo"
  | "Apartment"
  | "Lot"
  | "Commercial";
export type ListingType = "For Sale" | "For Rent" | "For Lease";
export type FurnishingStatus =
  | "Fully furnished"
  | "Semi-furnished"
  | "Unfurnished";
export type PropertyCondition =
  | "New"
  | "Well-maintained"
  | "Renovated"
  | "Needs repair";
export type PropertyStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected";

export const PROPERTY_TYPES: PropertyType[] = [
  "House",
  "Condo",
  "Apartment",
  "Lot",
  "Commercial",
];
export const LISTING_TYPES: ListingType[] = [
  "For Sale",
  "For Rent",
  "For Lease",
];

// --- Sub-Models ---

export interface NearbyEstablishment {
  name: string;
  distance: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  filename: string;
  imageType: "regular" | "panoramic";
}

// --- Main Domain Model (Matches Pydantic 'class Property') ---
// This is what the GET /properties/{id} endpoint returns.

export interface Property {
  // Basic Information
  id: string;
  propertyId: string;
  name: string;
  propertyType: PropertyType;
  listingType: ListingType;
  address: string;

  // Location
  latitude?: number | null;
  longitude?: number | null;

  // Pricing
  price: number;
  priceNegotiable: boolean;

  // Property Specifications
  bedrooms?: number | null;
  bathrooms?: number | null;
  floorArea?: number | null;
  lotArea?: number | null;

  // Parking
  parkingAvailable: boolean;
  parkingSlots?: number | null;
  parking: {
    available: boolean;
    slots?: number;
  };

  // Building Details
  floorLevel?: string | null;
  storeys?: number | null;
  furnishing?: FurnishingStatus | null;
  condition?: PropertyCondition | null;
  yearBuilt?: number | null;

  // Property Description
  description?: string | null;

  // Features & Amenities
  amenities: string[];
  interiorFeatures: string[];
  buildingAmenities: string[];
  utilities: string[];

  // Nearby Establishments
  nearbySchools: NearbyEstablishment[];
  nearbyHospitals: NearbyEstablishment[];
  nearbyMalls: NearbyEstablishment[];
  nearbyTransport: NearbyEstablishment[];
  nearbyOffices: NearbyEstablishment[];
  nearbyEstablishments?: {
    schools: Array<{ distance: string; name: string }>;
    hospitals: Array<{ distance: string; name: string }>;
    malls: Array<{ distance: string; name: string }>;
    publicTransport: Array<{ distance: string; name: string }>;
    offices: Array<{ distance: string; name: string }>;
  };

  // Legal & Financial
  ownershipStatus?: string | null;
  taxStatus?: string | null;
  associationDues?: number | null;

  // Terms & Policies
  terms: string[];
  availabilityDate?: string | null; // ISO Date String
  minimumLeasePeriod?: string | null;
  petPolicy?: string | null;
  smokingPolicy?: string | null;

  // Agent Information
  agentName?: string | null;
  agentPhone?: string | null;
  agentEmail?: string | null;
  agentExperience?: number | null;
  agentBio?: string | null;
  contactInfo: {
    agentName: string;
    phone: string;
    email: string;
  };
  agent?: {
    id: string;
    name: string;
    title: string;
    image: string;
    phone: string;
    email: string;
    experience: string;
    rating: number;
    reviews: number;
    bio: string;
  };

  // Developer Information
  hasDeveloper: boolean;
  developerName?: string | null;
  developerWebsite?: string | null;
  developerPhone?: string | null;
  developerEmail?: string | null;
  developerYears?: number | null;
  developerBio?: string | null;
  developer: {
    name: string;
    website?: string;
    phone?: string;
    email?: string;
    years?: number;
    bio?: string;
  };

  // Ratings
  ratings: {
    overall: number;
    cleanliness: number;
    location: number;
    value: number;
  };

  // Metadata
  status: PropertyStatus;
  createdAt: string; // ISO String from datetime
  updatedAt: string; // ISO String from datetime
  createdBy: string;
  views: number;
  inquiries: number;
  listingDate: string;

  // Images
  images: PropertyImage[];
  regularImageCount: number;
  panoramicImageCount: number;
  panoramicImages?: Array<{
    url: string;
    title?: string;
    description?: string;
  }>;
  image?: PropertyImage | null; // Main thumbnail
}

// --- Form Input Interface ---
// Matches the API form data structure from the curl example

export interface PropertyFormInput {
  // Basic Information
  name: string;
  propertyType: PropertyType;
  listingType: ListingType;
  address: string;
  latitude?: string;
  longitude?: string;

  // Pricing
  price: string;
  priceNegotiable: boolean;

  // Images
  regularImages: File[];
  panoramicImages: File[];
  image?: File;

  // Property Specifications
  bedrooms?: string;
  bathrooms?: string;
  floorArea?: string;
  lotArea?: string;

  // Parking
  parkingAvailable: boolean;
  parkingSlots?: string;

  // Building Details
  floorLevel?: string;
  storeys?: string;
  furnishing?: FurnishingStatus;
  condition?: PropertyCondition;
  yearBuilt?: string;

  // Property Description
  description?: string;

  // Features & Amenities
  amenities: string[];
  interiorFeatures: string[];
  buildingAmenities: string[];
  utilities: string[];

  // Nearby
  nearbySchools: NearbyEstablishment[];
  nearbyHospitals: NearbyEstablishment[];
  nearbyMalls: NearbyEstablishment[];
  nearbyTransport: NearbyEstablishment[];
  nearbyOffices: NearbyEstablishment[];

  // Legal & Financial
  ownershipStatus?: string;
  taxStatus?: string;
  associationDues?: string;

  // Terms & Policies
  terms: string[];
  availabilityDate?: string;
  minimumLeasePeriod?: string;
  petPolicy?: string;
  smokingPolicy?: string;

  // Agent Information
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentExperience?: string;
  agentBio?: string;

  // Developer Information
  hasDeveloper?: boolean;
  developerName?: string;
  developerWebsite?: string;
  developerPhone?: string;
  developerEmail?: string;
  developerYears?: string;
  developerBio?: string;

  // Images
  mainImage?: File;

  // System fields
  status?: PropertyStatus;
  user_id: string;
}

// --- Seller Dashboard Interfaces ---

// Seller Property Item Interface
export interface SellerPropertyItem {
  id: string;
  propertyId: string;
  name: string;
  address: string;
  image: string | null; // URL to thumbnail image
  status: "draft" | "pending_review" | "published" | "rejected";
  views: number; // Total property view count
  inquiries: number; // Total inquiry count for this property
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  createdAt: string; // ISO date string
}

// API Response Interface
export interface SellerPropertiesResponse {
  success: boolean;
  properties: SellerPropertyItem[];
  total: number;
  error?: {
    code: string;
    message: string;
  };
}

export interface PropertyImage {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string | null;
  imageType: "regular" | "panoramic";
  label?: string | null; // Room/area type label for the image
}

export interface NearbyPlace {
  name: string;
  distance: string;
}

export interface Property {
  propertyId: string;
  name: string;
  address: string;
  price: number;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  lotArea: number;
  description: string;
  image: PropertyImage;
  images: PropertyImage[];
  status: string;
  availabilityDate?: string;
  furnishing?: string;
  parkingSlots?: number;
  parkingAvailable?: boolean;
  yearBuilt?: number;
  priceNegotiable?: boolean;
  storeys?: number;
  floorLevel?: number | null;
  condition?: string;

  // Amenities & Features
  amenities?: string[];
  buildingAmenities?: string[];
  interiorFeatures?: string[];
  utilities?: string[];

  // Terms & Policies
  terms?: string[];
  petPolicy?: string;
  smokingPolicy?: string;
  minimumLeasePeriod?: string;

  // Financial
  associationDues?: number;
  taxStatus?: string;
  ownershipStatus?: string;

  // Agent Info
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentBio?: string;
  agentExperience?: number;

  // Developer Info
  hasDeveloper?: boolean;
  developerName?: string;
  developerPhone?: string;
  developerEmail?: string;
  developerWebsite?: string;
  developerBio?: string;
  developerYears?: number;

  // Location
  latitude?: number;
  longitude?: number;
  nearbySchools?: NearbyPlace[];
  nearbyMalls?: NearbyPlace[];
  nearbyHospitals?: NearbyPlace[];
  nearbyOffices?: NearbyPlace[];
  nearbyTransport?: NearbyPlace[];

  // Metadata
  regularImageCount?: number;
  panoramicImageCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Lightweight payload interfaces for buyer side optimization

export interface PropertyCardPayload {
  propertyId: string;
  name: string;
  address: string;
  price: number;
  priceNegotiable?: boolean;
  listingType: string;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  propertyType: string;
  furnishing?: string;
  imageUrl: string;
  imageLabel?: string | null; // Label for the main image
}

export interface PropertyDetailsPayload {
  propertyId: string;
  name: string;
  listingType: string;
  propertyType: string;
  status?: string;
  address: string;
  price: number;
  priceNegotiable?: boolean;
  associationDues?: number;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  parkingSlots?: number;
  description?: string;
  furnishing?: string;
  condition?: string;
  lotArea?: number;
  yearBuilt?: number;
  storeys?: number;
  interiorFeatures: string[];
  amenities: string[];
  buildingAmenities: string[];
  images: PropertyImagePayload[];
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentExperience?: number;
  nearbySchools?: NearbyPlace[];
  nearbyMalls?: NearbyPlace[];
  nearbyHospitals?: NearbyPlace[];
  nearbyOffices?: NearbyPlace[];
  nearbyTransport?: NearbyPlace[];
}

export interface PropertyImagePayload {
  id: string;
  url: string;
  imageType: string;
  label?: string | null; // Room/area type label for the image
}

// API Query and Response interfaces

export interface PropertyCardsQuery {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface PropertyCardsResponse {
  success: boolean;
  properties: PropertyCardPayload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: {
    message: string;
  };
}

export interface PropertyDetailsResponse {
  success: boolean;
  property: PropertyDetailsPayload;
  error?: {
    message: string;
  };
}

export interface PropertySearchRequest {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

export interface PropertySearchResponse {
  success: boolean;
  properties: PropertyCardPayload[];
  total: number;
  error?: {
    message: string;
  };
}

export interface BuyerPropertiesViewQuery {
  user_id?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

export interface BuyerPropertiesViewResponse {
  success: boolean;
  properties: PropertyCardPayload[];
  total: number;
  filters: {
    location?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
  };
  error?: {
    message: string;
  };
}

export interface DeletePropertyResponse {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

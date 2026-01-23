export interface PropertyImage {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string | null;
  imageType: "regular" | "panoramic";
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
  yearBuilt?: number;
  priceNegotiable?: boolean;
}

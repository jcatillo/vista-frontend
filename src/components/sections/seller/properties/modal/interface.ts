export const ROOM_TYPES = [
  "Living Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom",
  "Bathroom",
  "Dining Room",
  "Home Office",
  "Balcony/Terrace",
  "Garden/Yard",
  "Garage",
  "Hallway",
  "Staircase",
  "Basement",
  "Attic",
  "Laundry Room",
  "Storage Room",
  "Other",
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

export interface PropertyFormData {
  name: string;
  propertyType: "House" | "Condo" | "Apartment" | "Lot" | "Commercial" | "";
  listingType: "For Sale" | "For Rent" | "For Lease" | "";
  address: string;
  latitude: string;
  longitude: string;
  price: string;
  priceNegotiable: boolean;
  regularImages: Array<{ file: File; label: RoomType | "" }>;
  panoramicImages: Array<{ file: File; label: RoomType | "" }>;
  selectedThumbnailIndex: number | null; // Index of selected thumbnail from regularImages
  bedrooms: string;
  bathrooms: string;
  floorArea: string;
  lotArea: string;
  parkingAvailable: boolean;
  parkingSlots: string;
  floorLevel: string;
  storeys: string;
  furnishing: "Fully furnished" | "Semi-furnished" | "Unfurnished" | "";
  condition: "New" | "Well-maintained" | "Renovated" | "Needs repair" | "";
  yearBuilt: string;
  description: string;
  amenities: string[];
  interiorFeatures: string[];
  buildingAmenities: string[];
  utilities: string[];
  nearbySchools: Array<{ name: string; distance: string }>;
  nearbyHospitals: Array<{ name: string; distance: string }>;
  nearbyMalls: Array<{ name: string; distance: string }>;
  nearbyTransport: Array<{ name: string; distance: string }>;
  nearbyOffices: Array<{ name: string; distance: string }>;
  ownershipStatus: string;
  taxStatus: string;
  associationDues: string;
  terms: string[];
  availabilityDate: string;
  minimumLeasePeriod: string;
  petPolicy: string;
  smokingPolicy: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentExperience: string;
  agentBio: string;
  hasDeveloper: boolean;
  developerName: string;
  developerWebsite: string;
  developerPhone: string;
  developerEmail: string;
  developerYears: string;
  developerBio: string;
}

export interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: PropertyFormData) => void | Promise<void>;
}

export interface StepProps {
  formData: PropertyFormData;
  onUpdate: (field: keyof PropertyFormData, value: any) => void;
  onArrayToggle: (field: keyof PropertyFormData, item: string) => void;
  onFileUpload: (
    field: "regularImages" | "panoramicImages",
    files: FileList | null
  ) => void;
  onRemoveImage: (
    field: "regularImages" | "panoramicImages",
    index: number
  ) => void;
  onUpdateImageLabel: (
    field: "regularImages" | "panoramicImages",
    index: number,
    label: string
  ) => void;
  onSelectThumbnail: (index: number | null) => void;
  validationErrors: Record<string, string>;
}

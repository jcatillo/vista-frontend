export interface Property {
  id: string;
  name: string;
  propertyType: "House" | "Condo" | "Apartment" | "Lot" | "Commercial";
  listingType: "For Sale" | "For Rent" | "For Lease";
  address: string;
  latitude: number;
  longitude: number;
  price: string;
  priceNegotiable: boolean;
  status: "Active" | "Pending" | "Sold";
  views: number;
  inquiries: number;
  image: string;
  images: string[];
  panoramicImages?: Array<{ url: string; title?: string; description?: string }>;
  bedrooms: number;
  bathrooms: number;
  floorArea: string; // sqm
  lotArea?: string; // sqm
  parking: { available: boolean; slots: number };
  floorLevel?: string; // for condos
  storeys?: number; // number of stories/floors
  furnishing: "Fully furnished" | "Semi-furnished" | "Unfurnished";
  condition: "New" | "Well-maintained" | "Renovated" | "Needs repair";
  yearBuilt: number;
  description: string;
  amenities: string[];
  interiorFeatures: string[];
  buildingAmenities: string[];
  utilities: string[];
  nearbyEstablishments: {
    schools: Array<{ distance: string; name: string }>;
    hospitals: Array<{ distance: string; name: string }>;
    malls: Array<{ distance: string; name: string }>;
    publicTransport: Array<{ distance: string; name: string }>;
    offices: Array<{ distance: string; name: string }>;
  };
  ownershipStatus: string;
  taxStatus: string;
  associationDues?: string;
  terms: string[];
  availabilityDate: string;
  minimumLeasePeriod?: string;
  petPolicy: string;
  smokingPolicy: string;
  contactInfo: {
    agentName: string;
    phone: string;
    email: string;
  };
  agent: {
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
  developer?: {
    id: string;
    name: string;
    image: string;
    website?: string;
    phone: string;
    email: string;
    yearsInBusiness: number;
    rating: number;
    reviews: number;
    bio: string;
  };
  ratings: {
    overallRating: number;
    totalReviews: number;
    breakdown: {
      cleanliness: number;
      accuracy: number;
      communication: number;
      location: number;
      value: number;
    };
  };
  listingDate: string;
}

export const propertyDatabase: Record<string, Property> = {
  "1": {
    id: "1",
    name: "Modern Beachfront Villa",
    propertyType: "House",
    listingType: "For Sale",
    address: "123 Coastal Drive, Miami, FL 33139",
    latitude: 25.791,
    longitude: -80.13,
    price: "₱4,500,000",
    priceNegotiable: true,
    status: "Active",
    views: 1203,
    inquiries: 28,
    image:
      "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9a485d94ffe2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    panoramicImages: [
      { 
        url: "https://vista-resources.s3.ap-southeast-2.amazonaws.com/CSP-S+UCMN+LOGO+(1).jpg",
        title: "Ocean View Panorama",
        description: "360° view of the pristine beachfront"
      },
      { 
        url: "https://vista-resources.s3.ap-southeast-2.amazonaws.com/CSP-S+UCMN+LOGO+(1).jpg",
        title: "Living Room Vista",
        description: "Panoramic view from the main living area"
      },
    ],
    bedrooms: 4,
    bathrooms: 3,
    floorArea: "3,500 sqm",
    lotArea: "5,000 sqm",
    parking: { available: true, slots: 3 },
    floorLevel: "Ground",
    storeys: 2,
    furnishing: "Fully furnished",
    condition: "Well-maintained",
    yearBuilt: 2015,
    description:
      "Stunning beachfront villa with modern architecture and premium finishes. Features panoramic ocean views, private beach access, and state-of-the-art smart home technology.",
    amenities: [
      "Private Beach Access",
      "Swimming Pool",
      "Hot Tub",
      "Smart Home System",
      "Wine Cellar",
      "Home Theater",
      "Fitness Center",
      "Outdoor Kitchen",
    ],
    interiorFeatures: [
      "Air-conditioning",
      "Built-in cabinets",
      "Balcony",
      "Kitchen appliances",
    ],
    buildingAmenities: [
      "Swimming pool",
      "Gym",
      "Security (24/7 guard, CCTV)",
      "Garden",
    ],
    utilities: ["Water", "Electricity", "Internet readiness"],
    nearbyEstablishments: {
      schools: [{ distance: "2", name: "St. James International School" }],
      hospitals: [{ distance: "1.5", name: "Miami Medical Center" }],
      malls: [{ distance: "3", name: "Aventura Mall" }],
      publicTransport: [{ distance: "0.5", name: "Bus terminal" }],
      offices: [{ distance: "4", name: "Downtown Miami" }],
    },
    ownershipStatus: "Titled",
    taxStatus: "Updated",
    associationDues: "₱2,500/month",
    terms: ["Cash", "Bank financing"],
    availabilityDate: "2024-02-01",
    petPolicy: "Allowed (2 pets max)",
    smokingPolicy: "Allowed in designated areas",
    contactInfo: {
      agentName: "John Smith",
      phone: "+1-305-555-0123",
      email: "john.smith@realestate.com",
    },
    agent: {
      id: "agent-seller",
      name: "Johnson Smith",
      title: "Property Seller",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      phone: "+1-555-123-4567",
      email: "johnson.smith@realestate.com",
      experience: "10 years",
      rating: 4.8,
      reviews: 156,
      bio: "Dedicated property seller with excellent market knowledge and customer service.",
    },
    developer: {
      id: "dev-1",
      name: "Coastal Developments LLC",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
      website: "www.coastaldevelopments.com",
      phone: "+1-305-555-5000",
      email: "info@coastaldevelopments.com",
      yearsInBusiness: 25,
      rating: 4.7,
      reviews: 152,
      bio: "Award-winning developer specializing in premium coastal residential properties.",
    },
    ratings: {
      overallRating: 4.8,
      totalReviews: 128,
      breakdown: {
        cleanliness: 4.9,
        accuracy: 4.8,
        communication: 4.7,
        location: 4.9,
        value: 4.6,
      },
    },
    listingDate: "2024-01-15",
  },
  "2": {
    id: "2",
    name: "Downtown Luxury Apartment",
    propertyType: "Condo",
    listingType: "For Rent",
    address: "456 Urban Boulevard, NYC, NY 10001",
    latitude: 40.7505,
    longitude: -73.9972,
    price: "₱45,000/month",
    priceNegotiable: false,
    status: "Active",
    views: 856,
    inquiries: 15,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9a485d94ffe2?w=800&h=600&fit=crop",
    ],
    bedrooms: 3,
    bathrooms: 2,
    floorArea: "2,200 sqm",
    parking: { available: true, slots: 1 },
    floorLevel: "25th",
    storeys: 1,
    furnishing: "Semi-furnished",
    condition: "Renovated",
    yearBuilt: 2018,
    description:
      "Luxury apartment in the heart of Manhattan with breathtaking city views. Modern design, premium appliances, and access to world-class amenities.",
    amenities: [
      "Doorman",
      "Gym",
      "Concierge",
      "Rooftop Terrace",
      "Laundry",
      "Storage",
    ],
    interiorFeatures: [
      "Air-conditioning",
      "Balcony",
      "Kitchen appliances",
    ],
    buildingAmenities: [
      "Elevator",
      "Gym",
      "Security (24/7 guard, CCTV)",
      "Rooftop Terrace",
    ],
    utilities: ["Water", "Electricity", "Internet readiness"],
    nearbyEstablishments: {
      schools: [{ distance: "1", name: "Columbia University" }],
      hospitals: [{ distance: "0.8", name: "NY Presbyterian Hospital" }],
      malls: [{ distance: "0.5", name: "Macy's Herald Square" }],
      publicTransport: [{ distance: "0.2", name: "Subway Station" }],
      offices: [{ distance: "0.3", name: "Financial District" }],
    },
    ownershipStatus: "Titled",
    taxStatus: "Updated",
    associationDues: "₱3,500/month",
    terms: ["Monthly rent"],
    availabilityDate: "2024-01-25",
    minimumLeasePeriod: "1 year",
    petPolicy: "Not allowed",
    smokingPolicy: "Not allowed",
    contactInfo: {
      agentName: "Sarah Johnson",
      phone: "+1-212-555-0456",
      email: "sarah.johnson@realestate.com",
    },
    agent: {
      id: "agent-seller",
      name: "Johnson Smith",
      title: "Property Seller",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      phone: "+1-555-123-4567",
      email: "johnson.smith@realestate.com",
      experience: "10 years",
      rating: 4.8,
      reviews: 156,
      bio: "Dedicated property seller with excellent market knowledge and customer service.",
    },
    developer: {
      id: "dev-2",
      name: "Manhattan Modern Estates",
      image: "https://images.unsplash.com/photo-1486328299237-641852862500?w=200&h=200&fit=crop",
      website: "www.manhattanmodern.com",
      phone: "+1-212-555-6000",
      email: "info@manhattanmodern.com",
      yearsInBusiness: 18,
      rating: 4.6,
      reviews: 87,
      bio: "Leading developer of contemporary luxury residential spaces in Manhattan.",
    },
    ratings: {
      overallRating: 4.9,
      totalReviews: 256,
      breakdown: {
        cleanliness: 4.9,
        accuracy: 4.9,
        communication: 4.8,
        location: 5.0,
        value: 4.7,
      },
    },
    listingDate: "2024-02-10",
  },
  "3": {
    id: "3",
    name: "Suburban Family Home",
    propertyType: "House",
    listingType: "For Sale",
    address: "789 Oak Street, Austin, TX 78701",
    latitude: 30.2672,
    longitude: -97.7431,
    price: "₱2,200,000",
    priceNegotiable: true,
    status: "Pending",
    views: 342,
    inquiries: 7,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9a485d94ffe2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    bedrooms: 4,
    bathrooms: 2.5,
    floorArea: "2,800 sqm",
    lotArea: "4,500 sqm",
    parking: { available: true, slots: 2 },
    floorLevel: "Ground",
    storeys: 2,
    furnishing: "Unfurnished",
    condition: "Well-maintained",
    yearBuilt: 2012,
    description:
      "Spacious family home in a quiet suburban neighborhood. Perfect for families with great schools nearby and community parks.",
    amenities: ["Large Yard", "Garage", "Patio", "Garden"],
    interiorFeatures: [
      "Air-conditioning",
      "Built-in cabinets",
      "Kitchen appliances",
    ],
    buildingAmenities: ["Playground", "Garden", "Community Center"],
    utilities: ["Water", "Electricity", "Internet readiness"],
    nearbyEstablishments: {
      schools: [{ distance: "0.5", name: "Austin Elementary School" }],
      hospitals: [{ distance: "2", name: "Dell Seton Medical Center" }],
      malls: [{ distance: "3", name: "The Domain" }],
      publicTransport: [{ distance: "1", name: "Bus stop" }],
      offices: [{ distance: "5", name: "Tech Corridor" }],
    },
    ownershipStatus: "Titled",
    taxStatus: "Updated",
    terms: ["Cash", "Bank financing", "Installment"],
    availabilityDate: "2024-03-01",
    petPolicy: "Allowed",
    smokingPolicy: "Not allowed",
    contactInfo: {
      agentName: "Mike Davis",
      phone: "+1-512-555-0789",
      email: "mike.davis@realestate.com",
    },
    agent: {
      id: "agent-seller",
      name: "Johnson Smith",
      title: "Property Seller",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      phone: "+1-555-123-4567",
      email: "johnson.smith@realestate.com",
      experience: "10 years",
      rating: 4.8,
      reviews: 156,
      bio: "Dedicated property seller with excellent market knowledge and customer service.",
    },
    ratings: {
      overallRating: 4.7,
      totalReviews: 94,
      breakdown: {
        cleanliness: 4.8,
        accuracy: 4.7,
        communication: 4.6,
        location: 4.8,
        value: 4.5,
      },
    },
    listingDate: "2024-01-20",
  },
};

export const allProperties = Object.values(propertyDatabase);

import { MarketplaceSearch } from "../../features/buyer/components/MarketplaceSearch";
import { PropertyCard } from "../../features/buyer/components/PropertyCard";
import type { Property } from "../../features/buyer/types/property.types";

// NOTE: In a real app, this would come from an API hook like useProperties()
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Seaside Condo",
    location: "Lapu-Lapu City",
    pricePerNight: 3127,
    rating: 4.91,
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Condo",
    distance: "2 km away",
  },
  {
    id: "2",
    title: "Urban Loft",
    location: "Mandaue City",
    pricePerNight: 2650,
    rating: 4.85,
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Condo",
    distance: "5 km away",
  },
  {
    id: "3",
    title: "Modern Studio",
    location: "Cebu IT Park",
    pricePerNight: 3926,
    rating: 5.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: false,
    category: "Condo",
    distance: "Central",
  },
  {
    id: "4",
    title: "Garden Villa",
    location: "Busay",
    pricePerNight: 4500,
    rating: 4.98,
    imageUrls: [
      "https://images.unsplash.com/photo-1512918760383-eda2723ad6d3?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Entire Home",
    distance: "10 km away",
  },
  {
    id: "5",
    title: "Garden Villa",
    location: "Busay",
    pricePerNight: 4500,
    rating: 4.98,
    imageUrls: [
      "https://images.unsplash.com/photo-1512918760383-eda2723ad6d3?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Entire Home",
    distance: "10 km away",
  },
  {
    id: "6",
    title: "Garden Villa",
    location: "Busay",
    pricePerNight: 4500,
    rating: 4.98,
    imageUrls: [
      "https://images.unsplash.com/photo-1512918760383-eda2723ad6d3?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Entire Home",
    distance: "10 km away",
  },
  {
    id: "7",
    title: "Garden Villa",
    location: "Busay",
    pricePerNight: 4500,
    rating: 4.98,
    imageUrls: [
      "https://images.unsplash.com/photo-1512918760383-eda2723ad6d3?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Entire Home",
    distance: "10 km away",
  },
  {
    id: "8",
    title: "Garden Villa",
    location: "Busay",
    pricePerNight: 4500,
    rating: 4.98,
    imageUrls: [
      "https://images.unsplash.com/photo-1512918760383-eda2723ad6d3?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Entire Home",
    distance: "10 km away",
  },
  {
    id: "9",
    title: "Garden Villa",
    location: "Busay",
    pricePerNight: 4500,
    rating: 4.98,
    imageUrls: [
      "https://images.unsplash.com/photo-1512918760383-eda2723ad6d3?q=80&w=2000&auto=format&fit=crop",
    ],
    isGuestFavorite: true,
    category: "Entire Home",
    distance: "10 km away",
  },
];

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header Section */}
      <div className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white py-4 shadow-sm">
        <div className="mx-auto px-4 md:px-8">
          <MarketplaceSearch />
        </div>
      </div>

      {/* 2. Main Content */}
      <main className="mx-auto max-w-full px-4 py-8 md:px-8">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-2xl font-bold">
            Popular homes in Cebu
          </h2>
          {/* Filter Toggle could go here */}
        </div>

        {/* 3. Property Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {MOCK_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  );
}

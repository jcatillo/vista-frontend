import { useNavigate } from "react-router-dom";
import { Heart, BedDouble, Bath, Home } from "lucide-react";
import type { PropertyCardPayload } from "../types/property.types";

interface PropertyCardProps {
  property: PropertyCardPayload;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  // Extract city from address (e.g., "123 Ocean Drive, Cebu City, Cebu" -> "Cebu City")
  const cityFromAddress =
    property.address.split(",")[1]?.trim() || property.address;

  const handleClick = () => {
    navigate(`/buyer/property/${property.propertyId}`);
  };

  return (
    <div className="group cursor-pointer space-y-3" onClick={handleClick}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="h-full w-full object-cover"
        />

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black shadow-sm backdrop-blur-sm">
          {property.listingType}
        </div>

        {/* Image Label - Upper Right Corner */}
        {property.imageLabel && (
          <div className="absolute top-3 right-12">
            <div className="rounded-lg bg-black/70 px-3 py-1 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">
                {property.imageLabel}
              </p>
            </div>
          </div>
        )}

        {/* Heart Icon */}
        <button className="absolute top-3 right-3 rounded-full p-1 transition-transform active:scale-90">
          <Heart className="h-6 w-6 text-white/70 hover:text-white" />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="text-vista-primary truncate pr-2 font-semibold">
            {property.name}
          </h3>
        </div>

        <p className="text-vista-text/60 text-sm">{cityFromAddress}</p>

        <div className="text-vista-text/60 flex items-center gap-3 text-sm">
          <div className="group/tooltip relative flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            <span>{property.bedrooms}</span>
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
              Bedrooms
            </div>
          </div>
          <div className="group/tooltip relative flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            <span>{property.bathrooms}</span>
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
              Bathrooms
            </div>
          </div>
          <div className="group/tooltip relative flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>{property.floorArea}m²</span>
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
              Floor Area
            </div>
          </div>
        </div>

        <p className="text-vista-text/60 text-sm">
          {property.propertyType} • {property.furnishing || "Unfurnished"}
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-vista-primary font-semibold">
            ₱{property.price.toLocaleString()}
          </span>
          {property.priceNegotiable && (
            <span className="text-vista-text/60 text-xs">(Negotiable)</span>
          )}
        </div>
      </div>
    </div>
  );
}

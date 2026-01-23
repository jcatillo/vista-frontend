import { Heart, Star } from "lucide-react";
import type { Property } from "../types/property.types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group cursor-pointer space-y-3">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        <img
          src={property.imageUrls[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Guest Favorite Badge */}
        {property.isGuestFavorite && (
          <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black shadow-sm backdrop-blur-sm">
            Guest favorite
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
            {property.title}, {property.location}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            <span>{property.rating}</span>
          </div>
        </div>

        <p className="text-vista-text/60 text-sm">
          {property.category} • {property.distance || "Nearby"}
        </p>
        <p className="text-vista-text/60 text-sm">
          {property.availability || "Available now"}
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-vista-primary font-semibold">
            ₱{property.pricePerNight.toLocaleString()}
          </span>
          <span className="text-vista-text/80 text-sm">night</span>
        </div>
      </div>
    </div>
  );
}

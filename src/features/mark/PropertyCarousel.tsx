import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { PropertyCardData } from "../../context/MarkAIContext";

export function PropertyCarousel({
  properties,
}: {
  properties: PropertyCardData[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  // Function to handle manual scrolling
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Optional: Hide/Show arrows based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 10);
    }
  };

  if (!properties || properties.length === 0) return null;

  return (
    <div className="group relative mt-3 mb-2">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -left-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-all hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 -right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-all hover:bg-gray-50"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-4 pl-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {properties.map((prop) => (
          <motion.div
            key={prop.propertyId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex w-[240px] shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Image Section */}
            <div className="relative h-32 w-full bg-gray-100">
              {prop.image?.url ? (
                <img
                  src={prop.image.url}
                  alt={prop.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                {prop.propertyType}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-1 flex-col p-3">
              <h4
                className="line-clamp-1 text-sm font-semibold text-gray-900"
                title={prop.name}
              >
                {prop.name}
              </h4>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{prop.address}</span>
              </div>

              <div className="mt-2.5 border-t border-gray-100 pt-2.5">
                <span className="text-sm font-bold">
                  ₱{prop.price.toLocaleString()}
                </span>
              </div>

              <div className="mt-2 flex gap-3 text-[10px] text-gray-500">
                {prop.bedrooms !== undefined && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3" /> {prop.bedrooms}
                  </div>
                )}
                {prop.bathrooms !== undefined && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3" /> {prop.bathrooms}
                  </div>
                )}
                {prop.floorArea !== undefined && (
                  <div className="flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" /> {prop.floorArea}m²
                  </div>
                )}
              </div>

              <Link
                to={`/buyer/property/${prop.propertyId}`}
                className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-gray-50 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                View Details <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

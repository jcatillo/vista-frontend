import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export interface PropertyFilters {
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
}

interface MarketplaceSearchProps {
  onSearch?: (filters: PropertyFilters) => void;
}

export function MarketplaceSearch({ onSearch }: MarketplaceSearchProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false);

  const locations = [
    "Cebu City",
    "Mandaue City",
    "Lapu-Lapu City",
    "Talisay City",
    "Consolacion",
  ];
  const propertyTypes = ["House", "Condo", "Townhouse", "Apartment"];
  const priceRanges = [
    { label: "Under ₱5M", min: 0, max: 5000000 },
    { label: "₱5M - ₱10M", min: 5000000, max: 10000000 },
    { label: "₱10M - ₱20M", min: 10000000, max: 20000000 },
    { label: "₱20M - ₱50M", min: 20000000, max: 50000000 },
    { label: "Above ₱50M", min: 50000000, max: Infinity },
    { label: "For Rent (Monthly)", min: 0, max: 100000 },
  ];
  const bedroomOptions = ["1", "2", "3", "4", "5+"];

  // Auto-trigger search whenever filters change
  useEffect(() => {
    if (onSearch) {
      const selectedPrice = priceRanges.find((p) => p.label === priceRange);
      onSearch({
        location: location || "",
        propertyType: propertyType || "",
        minPrice: selectedPrice?.min || 0,
        maxPrice: selectedPrice?.max || Infinity,
        bedrooms: bedrooms ? parseInt(bedrooms.replace("+", "")) : 0,
      });
    }
  }, [location, propertyType, priceRange, bedrooms, onSearch, priceRanges]);

  const handleSearch = () => {
    if (onSearch) {
      const selectedPrice = priceRanges.find((p) => p.label === priceRange);
      onSearch({
        location: location || "",
        propertyType: propertyType || "",
        minPrice: selectedPrice?.min || 0,
        maxPrice: selectedPrice?.max || Infinity,
        bedrooms: bedrooms ? parseInt(bedrooms.replace("+", "")) : 0,
      });
    }
  };

  return (
    <div className="shadow-soft relative mx-auto flex w-full max-w-4xl items-center rounded-full border border-gray-200 bg-white px-2 py-1 transition-shadow hover:shadow-md">
      {/* Location */}
      <div className="relative flex-1 border-r border-gray-200">
        <div
          className="cursor-pointer px-4 py-1.5 hover:bg-gray-50"
          onClick={() => {
            setShowLocationDropdown(!showLocationDropdown);
            setShowTypeDropdown(false);
            setShowPriceDropdown(false);
            setShowBedroomsDropdown(false);
          }}
        >
          <div className="text-xs font-semibold text-gray-800">Location</div>
          <div className="truncate text-sm text-gray-500">
            {location || "City or Address"}
          </div>
        </div>
        {showLocationDropdown && (
          <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
              <button
                className="w-full rounded px-3 py-2 text-left text-sm font-semibold text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setLocation("");
                  setShowLocationDropdown(false);
                }}
              >
                All Locations
              </button>
              {locations.map((loc) => (
                <button
                  key={loc}
                  className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setLocation(loc);
                    setShowLocationDropdown(false);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property Type */}
      <div className="relative flex-1 border-r border-gray-200">
        <div
          className="cursor-pointer px-4 py-1.5 hover:bg-gray-50"
          onClick={() => {
            setShowTypeDropdown(!showTypeDropdown);
            setShowLocationDropdown(false);
            setShowPriceDropdown(false);
            setShowBedroomsDropdown(false);
          }}
        >
          <div className="text-xs font-semibold text-gray-800">Type</div>
          <div className="truncate text-sm text-gray-500">
            {propertyType || "House, Condo..."}
          </div>
        </div>
        {showTypeDropdown && (
          <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
              <button
                className="w-full rounded px-3 py-2 text-left text-sm font-semibold text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setPropertyType("");
                  setShowTypeDropdown(false);
                }}
              >
                All Types
              </button>
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setPropertyType(type);
                    setShowTypeDropdown(false);
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="relative flex-1 border-r border-gray-200">
        <div
          className="cursor-pointer px-4 py-1.5 hover:bg-gray-50"
          onClick={() => {
            setShowPriceDropdown(!showPriceDropdown);
            setShowLocationDropdown(false);
            setShowTypeDropdown(false);
            setShowBedroomsDropdown(false);
          }}
        >
          <div className="text-xs font-semibold text-gray-800">Price</div>
          <div className="truncate text-sm text-gray-500">
            {priceRange || "Any range"}
          </div>
        </div>
        {showPriceDropdown && (
          <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
              <button
                className="w-full rounded px-3 py-2 text-left text-sm font-semibold text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setPriceRange("");
                  setShowPriceDropdown(false);
                }}
              >
                Any Price
              </button>
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setPriceRange(range.label);
                    setShowPriceDropdown(false);
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bedrooms */}
      <div className="relative flex flex-1 cursor-pointer items-center justify-between pr-2 pl-4 hover:bg-gray-50">
        <div
          className="flex flex-1 flex-col py-1.5"
          onClick={() => {
            setShowBedroomsDropdown(!showBedroomsDropdown);
            setShowLocationDropdown(false);
            setShowTypeDropdown(false);
            setShowPriceDropdown(false);
          }}
        >
          <div className="text-xs font-semibold text-gray-800">Bedrooms</div>
          <div className="truncate text-sm text-gray-500">
            {bedrooms || "Any"}
          </div>
        </div>

        {showBedroomsDropdown && (
          <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
              <button
                className="w-full rounded px-3 py-2 text-left text-sm font-semibold text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setBedrooms("");
                  setShowBedroomsDropdown(false);
                }}
              >
                Any Bedrooms
              </button>
              {bedroomOptions.map((bed) => (
                <button
                  key={bed}
                  className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setBedrooms(bed);
                    setShowBedroomsDropdown(false);
                  }}
                >
                  {bed} Bedroom{bed !== "1" ? "s" : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-vista-primary hover:bg-opacity-90 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white transition-colors"
        >
          <Search className="h-4 w-4 font-bold" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

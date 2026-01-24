import { Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PropertyFilters {
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
}

export interface FilterState {
  location: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
}

interface MarketplaceSearchProps {
  onSearch?: (filters: PropertyFilters) => void;
  isMobile?: boolean;
  filterState?: FilterState;
  onFilterChange?: (state: FilterState) => void;
  onClose?: () => void;
}

export function MarketplaceSearch({
  onSearch,
  isMobile = false,
  filterState,
  onFilterChange,
  onClose,
}: MarketplaceSearchProps) {
  // Use controlled state if provided, otherwise use local state
  const [localLocation, setLocalLocation] = useState("");
  const [localPropertyType, setLocalPropertyType] = useState("");
  const [localPriceRange, setLocalPriceRange] = useState("");
  const [localBedrooms, setLocalBedrooms] = useState("");

  // Determine whether to use controlled or uncontrolled state
  const location = filterState?.location ?? localLocation;
  const propertyType = filterState?.propertyType ?? localPropertyType;
  const priceRange = filterState?.priceRange ?? localPriceRange;
  const bedrooms = filterState?.bedrooms ?? localBedrooms;

  const setLocation = (val: string) => {
    if (onFilterChange) {
      onFilterChange({ ...filterState!, location: val });
    } else {
      setLocalLocation(val);
    }
  };

  const setPropertyType = (val: string) => {
    if (onFilterChange) {
      onFilterChange({ ...filterState!, propertyType: val });
    } else {
      setLocalPropertyType(val);
    }
  };

  const setPriceRange = (val: string) => {
    if (onFilterChange) {
      onFilterChange({ ...filterState!, priceRange: val });
    } else {
      setLocalPriceRange(val);
    }
  };

  const setBedrooms = (val: string) => {
    if (onFilterChange) {
      onFilterChange({ ...filterState!, bedrooms: val });
    } else {
      setLocalBedrooms(val);
    }
  };
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const priceRanges = [
    { label: "Under ₱5M", min: 0, max: 5000000 },
    { label: "₱5M - ₱10M", min: 5000000, max: 10000000 },
    { label: "₱10M - ₱20M", min: 10000000, max: 20000000 },
    { label: "₱20M - ₱50M", min: 20000000, max: 50000000 },
    { label: "Above ₱50M", min: 50000000, max: Infinity },
    { label: "For Rent (Monthly)", min: 0, max: 100000 },
  ];
  const bedroomOptions = ["1", "2", "3", "4", "5+"];

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

  const hasActiveFilters = location || propertyType || priceRange || bedrooms;

  const clearAllFilters = () => {
    if (onFilterChange) {
      // Clear all at once for controlled state
      onFilterChange({
        location: "",
        propertyType: "",
        priceRange: "",
        bedrooms: "",
      });
    } else {
      // Clear local state
      setLocalLocation("");
      setLocalPropertyType("");
      setLocalPriceRange("");
      setLocalBedrooms("");
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        {/* Location */}
        <div className="relative">
          <label className="mb-1 block text-xs font-semibold text-gray-800">
            Location
          </label>
          <button
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-700"
            onClick={() => {
              setShowLocationDropdown(!showLocationDropdown);
              setShowTypeDropdown(false);
              setShowPriceDropdown(false);
              setShowBedroomsDropdown(false);
            }}
          >
            {location || "Select location"}
          </button>
          <AnimatePresence>
            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                <div className="max-h-48 overflow-y-auto p-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Property Type */}
        <div className="relative">
          <label className="mb-1 block text-xs font-semibold text-gray-800">
            Property Type
          </label>
          <button
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-700"
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowLocationDropdown(false);
              setShowPriceDropdown(false);
              setShowBedroomsDropdown(false);
            }}
          >
            {propertyType || "Select type"}
          </button>
          <AnimatePresence>
            {showTypeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                <div className="max-h-48 overflow-y-auto p-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        <div className="relative">
          <label className="mb-1 block text-xs font-semibold text-gray-800">
            Price Range
          </label>
          <button
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-700"
            onClick={() => {
              setShowPriceDropdown(!showPriceDropdown);
              setShowLocationDropdown(false);
              setShowTypeDropdown(false);
              setShowBedroomsDropdown(false);
            }}
          >
            {priceRange || "Select price range"}
          </button>
          <AnimatePresence>
            {showPriceDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                <div className="max-h-48 overflow-y-auto p-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <label className="mb-1 block text-xs font-semibold text-gray-800">
            Bedrooms
          </label>
          <button
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-700"
            onClick={() => {
              setShowBedroomsDropdown(!showBedroomsDropdown);
              setShowLocationDropdown(false);
              setShowTypeDropdown(false);
              setShowPriceDropdown(false);
            }}
          >
            {bedrooms
              ? `${bedrooms} Bedroom${bedrooms !== "1" ? "s" : ""}`
              : "Any"}
          </button>
          <AnimatePresence>
            {showBedroomsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                <div className="max-h-48 overflow-y-auto p-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-vista-primary hover:bg-opacity-90 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
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
        <AnimatePresence>
          {showLocationDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
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
                {locations.map((loc, idx) => (
                  <motion.button
                    key={loc}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setLocation(loc);
                      setShowLocationDropdown(false);
                    }}
                  >
                    {loc}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <AnimatePresence>
          {showTypeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
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
                {propertyTypes.map((type, idx) => (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setPropertyType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <AnimatePresence>
          {showPriceDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
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
                {priceRanges.map((range, idx) => (
                  <motion.button
                    key={range.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setPriceRange(range.label);
                      setShowPriceDropdown(false);
                    }}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

        <AnimatePresence>
          {showBedroomsDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
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
                {bedroomOptions.map((bed, idx) => (
                  <motion.button
                    key={bed}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setBedrooms(bed);
                      setShowBedroomsDropdown(false);
                    }}
                  >
                    {bed} Bedroom{bed !== "1" ? "s" : ""}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-vista-primary hover:bg-opacity-90 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors"
        >
          <Search className="h-4 w-4 font-bold" strokeWidth={3} />
        </button>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-2 shrink-0 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

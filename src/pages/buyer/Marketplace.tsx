import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MarketplaceSearch,
  type PropertyFilters,
  type FilterState,
} from "../../features/buyer/components/MarketplaceSearch";
import { PropertyCard } from "../../features/buyer/components/PropertyCard";
import type { PropertyCardPayload } from "../../features/buyer/types/property.types";
import { getBuyerPropertiesView } from "../../services/propertyService";

type QuickFilterType =
  | "popular"
  | "affordable-rentals"
  | "new-listings"
  | "luxury-properties"
  | "best-value";

interface QuickFilter {
  id: QuickFilterType;
  label: string;
  icon: string;
  description: string;
}

export default function Marketplace() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sectionProperties, setSectionProperties] = useState<{
    [key: string]: PropertyCardPayload[];
  }>({});
  const [allProperties, setAllProperties] = useState<PropertyCardPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    location: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
  });
  const navigate = useNavigate();
  const hasLoadedRef = useRef(false);

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const sections: QuickFilter[] = [
    {
      id: "popular",
      label: "Popular homes in Cebu",
      icon: "⭐",
      description: "Most viewed properties",
    },
    {
      id: "affordable-rentals",
      label: "Affordable rentals",
      icon: "🏠",
      description: "Budget-friendly rental properties",
    },
    {
      id: "new-listings",
      label: "New listings",
      icon: "🆕",
      description: "Recently added properties",
    },
    {
      id: "luxury-properties",
      label: "Luxury properties",
      icon: "💎",
      description: "Premium high-end properties",
    },
    {
      id: "best-value",
      label: "Best value for money",
      icon: "💰",
      description: "Great value for money",
    },
  ];

  // Load all properties once on component mount
  useEffect(() => {
    // Prevent double calls by checking if we've already loaded
    if (hasLoadedRef.current) {
      return;
    }

    const loadAllProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Single API call to get all properties
        const response = await getBuyerPropertiesView({});
        const properties = response.properties;
        setAllProperties(properties);

        // Organize properties into sections on the client side
        const organized: { [key: string]: PropertyCardPayload[] } = {};
        organized["popular"] = properties.slice(0, 10);
        organized["affordable-rentals"] = properties.filter(
          (p) => p.price <= 15000
        );
        organized["new-listings"] = properties.slice(0, 8);
        organized["luxury-properties"] = properties.filter(
          (p) => p.price >= 20000000
        );
        organized["best-value"] = properties.filter(
          (p) => p.price >= 10000000 && p.price <= 30000000
        );
        setSectionProperties(organized);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load properties"
        );
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    };

    hasLoadedRef.current = true;
    loadAllProperties();
  }, []);

  const scroll = (key: string, direction: "left" | "right") => {
    const container = scrollRefs.current[key];
    if (container) {
      const scrollAmount = 400;
      const newScrollLeft =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleClearFilters = () => {
    setFilterState({
      location: "",
      propertyType: "",
      priceRange: "",
      bedrooms: "",
    });

    // Reset to organized sections
    const organized: { [key: string]: PropertyCardPayload[] } = {};
    organized["popular"] = allProperties.slice(0, 10);
    organized["affordable-rentals"] = allProperties.filter(
      (p) => p.price <= 15000
    );
    organized["new-listings"] = allProperties.slice(0, 8);
    organized["luxury-properties"] = allProperties.filter(
      (p) => p.price >= 20000000
    );
    organized["best-value"] = allProperties.filter(
      (p) => p.price >= 10000000 && p.price <= 30000000
    );
    setSectionProperties(organized);
  };

  const handleLogout = () => {
    navigate("/get-started");
  };

  const handleSearch = (filters: PropertyFilters) => {
    // Client-side filtering of all properties
    const filtered = allProperties.filter((property) => {
      if (
        filters.location &&
        !property.address.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.propertyType &&
        property.propertyType !== filters.propertyType
      ) {
        return false;
      }
      if (filters.minPrice > 0 && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice < Infinity && property.price > filters.maxPrice) {
        return false;
      }
      if (filters.bedrooms > 0 && property.bedrooms !== filters.bedrooms) {
        return false;
      }
      return true;
    });

    // When user searches, show filtered results in a single section
    setSectionProperties({
      "search-results": filtered,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-screen items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="border-vista-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"></div>
            </div>
            <p className="text-vista-text/50 text-sm">Loading properties...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-screen items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-vista-primary mb-2 text-2xl font-semibold">
              Error Loading Properties
            </h1>
            <p className="text-vista-text/50 mb-6 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-vista-accent hover:text-vista-primary text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white py-2 shadow-sm"
      >
        <div className="mx-auto flex items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 md:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <h1 className="text-vista-primary font-display text-lg font-bold sm:text-xl">
              Vista.Buyer
            </h1>
          </div>

          {/* Search Bar - Hidden on mobile, shown on md+ */}
          <div className="hidden flex-1 md:block">
            <MarketplaceSearch
              onSearch={handleSearch}
              filterState={filterState}
              onFilterChange={setFilterState}
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="text-md flex h-9 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white p-2 text-sm transition-all hover:shadow-md md:hidden"
            aria-label="Open filters"
          >
            Filter
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:shadow-md"
              aria-label="Profile menu"
            >
              <User className="h-5 w-5 text-gray-700" />
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 right-0 w-56 rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                  <div className="py-2">
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Mobile Filters Modal (kept mounted to preserve filter state) */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <MarketplaceSearch
                onSearch={handleSearch}
                isMobile
                filterState={filterState}
                onFilterChange={setFilterState}
                onClose={() => setShowMobileFilters(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content */}
      <main className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
        {/* Show search results or all sections */}
        {sectionProperties["search-results"] ? (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-vista-primary text-lg font-bold sm:text-xl md:text-2xl">
                Search Results
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-vista-accent hover:text-vista-primary text-xs font-medium transition-colors sm:text-sm"
              >
                Clear Filters
              </button>
            </div>

            {sectionProperties["search-results"].length > 0 && (
              <div className="relative">
                <button
                  onClick={() => scroll("search-results", "left")}
                  className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-1.5 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl sm:block sm:p-2"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <button
                  onClick={() => scroll("search-results", "right")}
                  className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-1.5 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl sm:block sm:p-2"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div
                  ref={(el) => {
                    scrollRefs.current["search-results"] = el;
                  }}
                  className="scroll-smoothth flex gap-4 overflow-hidden pb-4 sm:gap-5 md:gap-6"
                >
                  {sectionProperties["search-results"].map((property) => (
                    <motion.div
                      key={property.propertyId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-65 shrink-0 sm:w-70 md:w-75"
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Display all category sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-8">
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                  <h2 className="text-vista-primary text-lg font-bold sm:text-xl md:text-2xl">
                    {section.label}
                  </h2>
                  {sectionProperties[section.id]?.length === 0 && (
                    <p className="text-xs text-gray-500 sm:text-sm">
                      No properties found
                    </p>
                  )}
                </div>

                {sectionProperties[section.id] &&
                  sectionProperties[section.id].length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => scroll(section.id, "left")}
                        className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-1.5 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl sm:block sm:p-2"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>

                      <button
                        onClick={() => scroll(section.id, "right")}
                        className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-1.5 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl sm:block sm:p-2"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>

                      <div
                        ref={(el) => {
                          scrollRefs.current[section.id] = el;
                        }}
                        className="flex gap-4 overflow-hidden scroll-smooth pb-4 sm:gap-5 md:gap-6"
                      >
                        {sectionProperties[section.id].map((property) => (
                          <motion.div
                            key={property.propertyId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-65 shrink-0 sm:w-70 md:w-75"
                          >
                            <PropertyCard property={property} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

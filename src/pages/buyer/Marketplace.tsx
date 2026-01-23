import { useRef, useState } from "react";
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
} from "../../features/buyer/components/MarketplaceSearch";
import { PropertyCard } from "../../features/buyer/components/PropertyCard";
import type { Property } from "../../features/buyer/types/property.types";
import { propertySections } from "../../data/marketplaceProperties";
import allProperties from "../../data/marketplaceProperties";
import { MarkAI } from "../../components/chatbot/MarkAI";

export default function Marketplace() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<
    Property[] | null
  >(null);
  const navigate = useNavigate();

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  const handleLogout = () => {
    navigate("/get-started");
  };

  const handleSearch = (filters: PropertyFilters) => {
    // If no filters are set, show all sections
    if (
      !filters.location &&
      !filters.propertyType &&
      filters.minPrice === 0 &&
      filters.maxPrice === Infinity &&
      filters.bedrooms === 0
    ) {
      setFilteredProperties(null);
      return;
    }

    let filtered = [...allProperties];

    // Location filter
    if (filters.location && filters.location.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Property type filter
    if (filters.propertyType && filters.propertyType.trim() !== "") {
      filtered = filtered.filter(
        (p) => p.propertyType === filters.propertyType
      );
    }

    // Price filter
    if (filters.minPrice > 0 || filters.maxPrice < Infinity) {
      filtered = filtered.filter(
        (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
      );
    }

    // Bedrooms filter
    if (filters.bedrooms > 0) {
      filtered = filtered.filter((p) => p.bedrooms >= filters.bedrooms);
    }

    setFilteredProperties(filtered);
  };

  const displaySections = filteredProperties
    ? [{ title: "Search Results", properties: filteredProperties }]
    : propertySections;

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
            <MarketplaceSearch onSearch={handleSearch} />
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
      <motion.div
        initial={false}
        animate={
          showMobileFilters
            ? { opacity: 1, pointerEvents: "auto" }
            : { opacity: 0, pointerEvents: "none" }
        }
        className="fixed inset-0 z-50 bg-black/50 md:hidden"
        onClick={() => setShowMobileFilters(false)}
      >
        <motion.div
          initial={false}
          animate={showMobileFilters ? { y: 0 } : { y: "100%" }}
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
          <MarketplaceSearch onSearch={handleSearch} isMobile />
        </motion.div>
      </motion.div>

      {/* 2. Main Content */}
      <main className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
        {displaySections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className={sectionIndex > 0 ? "mt-8 sm:mt-12" : ""}
          >
            {/* Section Header */}
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-vista-primary text-lg font-bold sm:text-xl md:text-2xl">
                {section.title}
              </h2>
              {section.properties.length === 0 && (
                <p className="text-xs text-gray-500 sm:text-sm">
                  No properties found
                </p>
              )}
            </div>

            {section.properties.length > 0 && (
              /* Horizontal Scroll Container */
              <div className="relative">
                {/* Left Arrow - Hidden on small mobile */}
                <button
                  onClick={() => scroll(section.title, "left")}
                  className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-1.5 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl sm:block sm:p-2"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {/* Right Arrow - Hidden on small mobile */}
                <button
                  onClick={() => scroll(section.title, "right")}
                  className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-1.5 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl sm:block sm:p-2"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div
                  ref={(el) => {
                    scrollRefs.current[section.title] = el;
                  }}
                  className="scrollbar-hide -mx-3 flex gap-3 overflow-x-auto px-3 pb-4 sm:mx-0 sm:gap-4 sm:px-0 md:gap-6"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {section.properties.map((property, index) => (
                    <motion.div
                      key={property.propertyId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: index * 0.1,
                      }}
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
      </main>

      <MarkAI />
    </div>
  );
}

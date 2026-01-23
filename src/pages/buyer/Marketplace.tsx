import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
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
        <div className="mx-auto flex items-center justify-between gap-4 px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-vista-primary font-display text-xl font-bold">
              Vista.Buyer
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1">
            <MarketplaceSearch onSearch={handleSearch} />
          </div>

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

      {/* 2. Main Content */}
      <main className="mx-auto max-w-full px-4 py-8 md:px-8">
        {displaySections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? "mt-12" : ""}>
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-vista-primary text-2xl font-bold">
                {section.title}
              </h2>
              {section.properties.length === 0 && (
                <p className="text-sm text-gray-500">
                  No properties found matching your criteria
                </p>
              )}
            </div>

            {section.properties.length > 0 && (
              /* Horizontal Scroll Container */
              <div className="relative">
                {/* Left Arrow */}
                <button
                  onClick={() => scroll(section.title, "left")}
                  className="absolute top-1/2 left-0 z-10 -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-2 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => scroll(section.title, "right")}
                  className="absolute top-1/2 right-0 z-10 -translate-y-1/2 cursor-pointer rounded-full border border-gray-300 bg-white p-2 shadow-lg transition-all hover:border-gray-900 hover:shadow-xl"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div
                  ref={(el) => {
                    scrollRefs.current[section.title] = el;
                  }}
                  className="scrollbar-hide flex gap-6 overflow-x-auto pb-4"
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
                      className="w-[280px] flex-shrink-0"
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

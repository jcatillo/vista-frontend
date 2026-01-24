import { motion } from "framer-motion";
import { Search, Plus, SlidersHorizontal, CheckCircle } from "lucide-react";
import { useState } from "react";
import AddPropertyModal from "./modal/AddPropertyModal";
import { createProperty } from "../../../../services/propertyService";
import type { PropertyFormData } from "./modal/interface";

interface PropertiesHeaderProps {
  onPropertyCreated?: () => void;
}

export function PropertiesHeader({ onPropertyCreated }: PropertiesHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handlePropertySubmit = async (propertyData: PropertyFormData) => {
    // Convert PropertyFormData to match API expectations
    const selectedThumbnail =
      propertyData.selectedThumbnailIndex !== null &&
      propertyData.regularImages[propertyData.selectedThumbnailIndex]
        ? propertyData.regularImages[propertyData.selectedThumbnailIndex]
        : propertyData.regularImages.length > 0
          ? propertyData.regularImages[0]
          : undefined;

    // Helper to convert empty strings to undefined
    const toUndefinedIfEmpty = (
      value: string | undefined
    ): string | undefined => (value === "" ? undefined : value);

    const formInput: PropertyFormData = {
      ...propertyData,
      // Ensure propertyType and listingType have valid values
      propertyType: (propertyData.propertyType || "House") as any,
      listingType: (propertyData.listingType || "For Sale") as any,
      // Convert empty strings to undefined for optional enum fields
      furnishing: toUndefinedIfEmpty(propertyData.furnishing) as any,
      condition: toUndefinedIfEmpty(propertyData.condition) as any,
      // Use selected thumbnail or first image as fallback
      image: selectedThumbnail?.file,
      // Keep as strings, let backend handle conversion
      // Add required fields
    };

    console.log("Submitting property:", formInput);
    await createProperty(formInput);
    console.log("Property created successfully");

    // Close modal and show success animation
    setIsModalOpen(false);
    setShowSuccessAnimation(true);

    // Refresh properties and hide animation after delay
    onPropertyCreated?.();
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };

  return (
    <>
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePropertySubmit}
      />

      {/* Success Animation */}
      {showSuccessAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="mx-4 w-full max-w-sm rounded-2xl border border-green-200 bg-white p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="mb-6 rounded-full bg-green-100 p-4"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-vista-primary mb-2 text-xl font-bold"
              >
                Property Added Successfully
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-vista-text/70 text-sm"
              >
                Your property has been added to your listings
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <section className="bg-vista-bg/50 border-vista-surface/20 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-vista-primary text-2xl font-bold md:text-3xl">
              My Properties
            </h1>
            <p className="text-vista-text/70 mt-1 text-sm">
              Manage and organize all your property listings
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            {/* Search */}
            <div className="border-vista-surface/30 focus-within:border-vista-accent relative flex flex-1 items-center rounded-xl border bg-white/40 backdrop-blur-sm transition-colors">
              <Search className="text-vista-text/40 ml-3 h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties by name or address..."
                className="text-vista-primary placeholder-vista-text/40 w-full bg-transparent px-3 py-2.5 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Filter Button */}
              <button className="border-vista-surface/30 hover:border-vista-accent flex items-center gap-2 rounded-xl border bg-white/40 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-white/60">
                <SlidersHorizontal className="text-vista-text/60 h-4 w-4" />
                <span className="text-vista-text/80 hidden text-xs font-medium sm:inline">
                  Filter
                </span>
              </button>

              {/* Add Property Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden text-xs sm:inline">Add Property</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

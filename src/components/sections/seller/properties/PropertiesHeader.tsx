import { motion } from "framer-motion";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import AddPropertyModal from "./modal/AddPropertyModal";
import { createProperty } from "../../../../services/propertyService";
import type { PropertyFormData } from "./modal/interface";
import type { PropertyFormInput } from "../../../../types/property";

interface PropertiesHeaderProps {
  onPropertyCreated?: () => void;
}

export function PropertiesHeader({ onPropertyCreated }: PropertiesHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePropertySubmit = async (propertyData: PropertyFormData) => {
    // Convert PropertyFormData to match API expectations
    const selectedThumbnail =
      propertyData.selectedThumbnailIndex !== null &&
      propertyData.regularImages[propertyData.selectedThumbnailIndex]
        ? propertyData.regularImages[propertyData.selectedThumbnailIndex]
        : propertyData.regularImages.length > 0
          ? propertyData.regularImages[0]
          : undefined;

    const formInput: PropertyFormInput = {
      ...propertyData,
      // Use selected thumbnail or first image as fallback
      image: selectedThumbnail,
      // Keep as strings, let backend handle conversion
      // Add required fields
      status: "draft" as const,
      user_id: "user_123456", // TODO: Get from auth context
    } as PropertyFormInput;

    console.log("Submitting property:", formInput);
    await createProperty(formInput);
    console.log("Property created successfully");
    setSuccessMessage("Property created successfully!");
    onPropertyCreated?.();

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <>
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePropertySubmit}
      />

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg"
        >
          {successMessage}
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

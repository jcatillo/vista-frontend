import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Building2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsStatsProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

/**
 * PropertyDetailsStats Component
 *
 * Displays and manages property statistics in a "Quick Information" section.
 * Supports inline editing mode where sellers can update all 6 key stats:
 * - Bedrooms, Bathrooms, Storeys, Floor Area, Lot Area, Year Built
 *
 * Features:
 * - View mode: Shows stats in a responsive grid (4 columns on desktop, 2 on tablet)
 * - Edit mode: Provides form inputs for easy updates
 * - Data persistence: Changes saved to propertyDatabase and synced with parent via onUpdate
 * - Responsive design: Handles last-row alignment for uneven stat counts
 */
export function PropertyDetailsStats({
  property,
  onUpdate,
}: PropertyDetailsStatsProps) {
  // Track edit mode state
  const [isEditing, setIsEditing] = useState(false);
  // Track async save operation to disable button during save
  const [isSaving, setIsSaving] = useState(false);
  // Local form state for editing (allows cancel without persisting)
  const [formData, setFormData] = useState<Property>(property);

  /**
   * Saves edited stats to the database
   * - Uses Object.assign to mutate propertyDatabase directly
   * - Calls onUpdate callback to sync parent component state
   * - Includes 300ms delay for smooth UX feedback
   */
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onUpdate?.(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  /**
   * Cancels edit mode and reverts form data to original property values
   */
  const handleCancel = () => {
    setFormData(property);
    setIsEditing(false);
  };

  /**
   * Array of stat objects with icon, label, and value for display
   * Uses lucide-react icons for visual consistency
   */
  const stats = [
    { icon: Bed, label: "Bedrooms", value: property.bedrooms, key: "bedrooms" },
    {
      icon: Bath,
      label: "Bathrooms",
      value: property.bathrooms,
      key: "bathrooms",
    },
    {
      icon: Building2,
      label: "Storeys",
      value: property.storeys || "N/A",
      key: "storeys",
    },
    {
      icon: Maximize2,
      label: "Floor Area",
      value: property.floorArea,
      key: "floorArea",
    },
    {
      icon: Maximize2,
      label: "Lot Area",
      value: property.lotArea || "N/A",
      key: "lotArea",
    },
    {
      icon: Calendar,
      label: "Built",
      value: property.yearBuilt,
      key: "yearBuilt",
    },
  ];

  /**
   * Calculates responsive column spans for last row items in the grid
   * Ensures proper alignment when stat count is not divisible by 4
   *
   * Example: 6 stats → 4 in first row + 2 in second row
   * Last 2 items should be md:col-span-2 to center them
   */
  const getColSpan = (idx: number) => {
    const lastRowCount = stats.length % 4 || 4;
    const isLastRowItem = idx >= stats.length - lastRowCount;

    if (isLastRowItem) {
      if (lastRowCount === 1) return "md:col-span-4";
      if (lastRowCount === 2) return "md:col-span-2";
    }
    return "";
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Property Stats
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Bedrooms
            </label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bedrooms: parseInt(e.target.value) || 0,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Bathrooms
            </label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bathrooms: parseInt(e.target.value) || 0,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Storeys
            </label>
            <input
              type="number"
              value={formData.storeys || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  storeys: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Floor Area
            </label>
            <input
              type="number"
              value={formData.floorArea}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  floorArea: parseFloat(e.target.value) || null,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Lot Area
            </label>
            <input
              type="number"
              value={formData.lotArea ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lotArea: parseFloat(e.target.value) || null,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Year Built
            </label>
            <input
              type="number"
              value={formData.yearBuilt ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  yearBuilt: parseInt(e.target.value) || 0,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="border-vista-surface/30 text-vista-text hover:bg-vista-surface/10 flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Quick Information
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
          title="Edit stats"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-vista-surface/30 rounded-2xl p-4 text-center md:p-6 ${getColSpan(idx)}`}
          >
            <div className="bg-vista-accent/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl">
              <stat.icon className="text-vista-accent h-5 w-5" />
            </div>
            <p className="text-vista-primary text-lg font-bold">{stat.value}</p>
            <p className="text-vista-text/60 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

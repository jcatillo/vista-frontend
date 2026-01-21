import { motion } from "framer-motion";
import { Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsBasicInfoProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsBasicInfo({
  property,
  onUpdate,
}: PropertyDetailsBasicInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Property>(property);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    Object.assign(propertyDatabase[property.id], formData);
    onUpdate?.(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(property);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">
            Basic Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Property Type
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyType: e.target.value as Property["propertyType"],
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option>House</option>
              <option>Condo</option>
              <option>Apartment</option>
              <option>Lot</option>
              <option>Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Listing Type
            </label>
            <select
              value={formData.listingType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  listingType: e.target.value as Property["listingType"],
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option>For Sale</option>
              <option>For Rent</option>
              <option>For Lease</option>
            </select>
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Price
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: e.target.value as Property["condition"],
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option>New</option>
              <option>Well-maintained</option>
              <option>Renovated</option>
              <option>Needs repair</option>
            </select>
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Furnishing
            </label>
            <select
              value={formData.furnishing}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  furnishing: e.target.value as Property["furnishing"],
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option>Fully furnished</option>
              <option>Semi-furnished</option>
              <option>Unfurnished</option>
            </select>
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Year Built
            </label>
            <input
              type="number"
              value={formData.yearBuilt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  yearBuilt: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-vista-surface/30 text-vista-text hover:bg-vista-surface/10 transition-colors font-medium"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vista-primary hover:bg-vista-primary/90 text-white font-medium transition-colors disabled:opacity-50"
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
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-vista-primary text-xl font-bold">
          Basic Information
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-vista-accent hover:bg-vista-accent/10 rounded-lg transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-vista-text/60 text-sm">Property Type</p>
          <p className="text-vista-primary font-semibold text-lg">
            {property.propertyType}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Listing Type</p>
          <p className="text-vista-primary font-semibold text-lg">
            {property.listingType}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Price</p>
          <div className="flex items-baseline gap-2">
            <p className="text-vista-primary font-semibold text-lg">
              {property.price}
            </p>
            {property.priceNegotiable && (
              <span className="text-vista-accent text-xs font-medium bg-vista-accent/10 px-2 py-1 rounded-lg">
                Negotiable
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Condition</p>
          <p className="text-vista-primary font-semibold text-lg">
            {property.condition}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Furnishing</p>
          <p className="text-vista-primary font-semibold text-lg">
            {property.furnishing}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Year Built</p>
          <p className="text-vista-primary font-semibold text-lg">
            {property.yearBuilt}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

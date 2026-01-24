import { motion } from "framer-motion";
import { Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
import { patchProperty } from "../../../../services/propertyService";

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
    try {
      // Only send changed fields
      const changedFields: Partial<Property> = {};
      if (formData.propertyType !== property.propertyType)
        changedFields.propertyType = formData.propertyType;
      if (formData.listingType !== property.listingType)
        changedFields.listingType = formData.listingType;
      if (formData.price !== property.price)
        changedFields.price = formData.price;
      if (formData.condition !== property.condition)
        changedFields.condition = formData.condition;
      if (formData.furnishing !== property.furnishing)
        changedFields.furnishing = formData.furnishing;
      if (formData.yearBuilt !== property.yearBuilt)
        changedFields.yearBuilt = formData.yearBuilt;

      if (Object.keys(changedFields).length > 0) {
        const updatedProperty = await patchProperty(
          property.propertyId,
          changedFields
        );
        onUpdate?.(updatedProperty);
      } else {
        // No changes, just close edit mode
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update property:", error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
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
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Basic Information
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
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
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>House</option>
              <option>Condo</option>
              <option>Apartment</option>
              <option>Lot</option>
              <option>Commercial</option>
            </select>
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
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
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>For Sale</option>
              <option>For Rent</option>
              <option>For Lease</option>
            </select>
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Condition
            </label>
            <select
              value={formData.condition ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: e.target.value as Property["condition"],
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>New</option>
              <option>Well-maintained</option>
              <option>Renovated</option>
              <option>Needs repair</option>
            </select>
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Furnishing
            </label>
            <select
              value={formData.furnishing ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  furnishing: e.target.value as Property["furnishing"],
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>Fully furnished</option>
              <option>Semi-furnished</option>
              <option>Unfurnished</option>
            </select>
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
      transition={{ duration: 0.5, delay: 0.25 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Basic Information
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className="text-vista-text/60 text-sm">Property Type</p>
          <p className="text-vista-primary text-lg font-semibold">
            {property.propertyType}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Listing Type</p>
          <p className="text-vista-primary text-lg font-semibold">
            {property.listingType}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Price</p>
          <div className="flex items-baseline gap-2">
            <p className="text-vista-primary text-lg font-semibold">
              {property.price}
            </p>
            {property.priceNegotiable && (
              <span className="text-vista-accent bg-vista-accent/10 rounded-lg px-2 py-1 text-xs font-medium">
                Negotiable
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Condition</p>
          <p className="text-vista-primary text-lg font-semibold">
            {property.condition}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Furnishing</p>
          <p className="text-vista-primary text-lg font-semibold">
            {property.furnishing}
          </p>
        </div>
        <div>
          <p className="text-vista-text/60 text-sm">Year Built</p>
          <p className="text-vista-primary text-lg font-semibold">
            {property.yearBuilt}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

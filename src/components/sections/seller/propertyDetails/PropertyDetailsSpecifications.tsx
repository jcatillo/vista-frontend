import { motion } from "framer-motion";
import { MapPin, ParkingCircle, Home, Layers, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsSpecificationsProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsSpecifications({
  property,
  onUpdate,
}: PropertyDetailsSpecificationsProps) {
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
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">
            Property Specifications
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Floor Area
            </label>
            <input
              type="text"
              value={formData.floorArea}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  floorArea: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Lot Area
            </label>
            <input
              type="text"
              value={formData.lotArea || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lotArea: e.target.value || undefined,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Floor Level
            </label>
            <input
              type="text"
              value={formData.floorLevel || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  floorLevel: e.target.value || undefined,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Parking Slots
            </label>
            <input
              type="number"
              value={formData.parking.slots}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...prev.parking, slots: parseInt(e.target.value) || 0 },
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Parking Available
            </label>
            <select
              value={formData.parking.available ? "yes" : "no"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...prev.parking, available: e.target.value === "yes" },
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-vista-primary text-xl font-bold">
          Property Specifications
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
        <div className="flex items-start gap-3">
          <Layers className="text-vista-accent h-5 w-5 mt-1 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Floor Area</p>
            <p className="text-vista-primary font-semibold text-lg">
              {property.floorArea}
            </p>
          </div>
        </div>
        {property.lotArea && (
          <div className="flex items-start gap-3">
            <MapPin className="text-vista-accent h-5 w-5 mt-1 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Lot Area</p>
              <p className="text-vista-primary font-semibold text-lg">
                {property.lotArea}
              </p>
            </div>
          </div>
        )}
        {property.floorLevel && (
          <div className="flex items-start gap-3">
            <Home className="text-vista-accent h-5 w-5 mt-1 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Floor Level</p>
              <p className="text-vista-primary font-semibold text-lg">
                {property.floorLevel}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <ParkingCircle className="text-vista-accent h-5 w-5 mt-1 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Parking</p>
            <p className="text-vista-primary font-semibold text-lg">
              {property.parking.available
                ? `${property.parking.slots} slot(s)`
                : "Not available"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

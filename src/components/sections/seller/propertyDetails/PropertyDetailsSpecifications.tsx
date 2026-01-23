import { motion } from "framer-motion";
import {
  MapPin,
  ParkingCircle,
  Home,
  Layers,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
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
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Property Specifications
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Floor Area
            </label>
            <input
              type="number"
              value={formData.floorArea ?? ""}
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
              type="text"
              value={formData.lotArea || ""}
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
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Parking Slots
            </label>
            <input
              type="number"
              value={formData.parking.slots}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: {
                    ...prev.parking,
                    slots: parseInt(e.target.value) || 0,
                  },
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Parking Available
            </label>
            <select
              value={formData.parkingAvailable ? "yes" : "no"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: {
                    ...prev,
                    available: e.target.value === "yes",
                  },
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Property Specifications
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
        <div className="flex items-start gap-3">
          <Layers className="text-vista-accent mt-1 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Floor Area</p>
            <p className="text-vista-primary text-lg font-semibold">
              {property.floorArea}
            </p>
          </div>
        </div>
        {property.lotArea && (
          <div className="flex items-start gap-3">
            <MapPin className="text-vista-accent mt-1 h-5 w-5 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Lot Area</p>
              <p className="text-vista-primary text-lg font-semibold">
                {property.lotArea}
              </p>
            </div>
          </div>
        )}
        {property.floorLevel && (
          <div className="flex items-start gap-3">
            <Home className="text-vista-accent mt-1 h-5 w-5 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Floor Level</p>
              <p className="text-vista-primary text-lg font-semibold">
                {property.floorLevel}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <ParkingCircle className="text-vista-accent mt-1 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Parking</p>
            <p className="text-vista-primary text-lg font-semibold">
              {property.parkingAvailable
                ? `${property.parkingSlots} slot(s)`
                : "Not available"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Calendar, PawPrint, Cigarette, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsAvailabilityProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsAvailability({
  property,
  onUpdate,
}: PropertyDetailsAvailabilityProps) {
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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">
            Availability & Restrictions
          </h2>
        </div>
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Available From
            </label>
            <input
              type="date"
              value={new Date(formData.availabilityDate).toISOString().split('T')[0]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availabilityDate: new Date(e.target.value).toISOString(),
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Minimum Lease Period
            </label>
            <input
              type="text"
              value={formData.minimumLeasePeriod || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minimumLeasePeriod: e.target.value || undefined,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Pet Policy
            </label>
            <select
              value={formData.petPolicy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  petPolicy: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option>Not allowed</option>
              <option>Small pets allowed</option>
              <option>All pets allowed</option>
            </select>
          </div>

          <div>
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Smoking Policy
            </label>
            <select
              value={formData.smokingPolicy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  smokingPolicy: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
            >
              <option>Not allowed</option>
              <option>Allowed</option>
              <option>Allowed in outdoor areas only</option>
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
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-vista-primary text-xl font-bold">
          Availability & Restrictions
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-vista-accent hover:bg-vista-accent/10 rounded-lg transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Available From</p>
            <p className="text-vista-primary font-semibold">
              {new Date(property.availabilityDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {property.minimumLeasePeriod && (
          <div className="flex items-start gap-3">
            <Calendar className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Minimum Lease Period</p>
              <p className="text-vista-primary font-semibold">
                {property.minimumLeasePeriod}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <PawPrint className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Pet Policy</p>
            <p className="text-vista-primary font-semibold">
              {property.petPolicy}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Cigarette className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Smoking Policy</p>
            <p className="text-vista-primary font-semibold">
              {property.smokingPolicy}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

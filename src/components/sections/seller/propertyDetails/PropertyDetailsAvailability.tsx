import { motion } from "framer-motion";
import { Calendar, PawPrint, Cigarette, Edit2, Check, X } from "lucide-react";
import { useState, useMemo } from "react";
import type { Property } from "../../../../types/property";
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
  const [formData, setFormData] = useState<Property>(() => ({
    ...property,
    availabilityDate: property.availabilityDate || new Date().toISOString(),
  }));

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

  const formattedDate = useMemo(() => {
    const dateValue = formData.availabilityDate || new Date().toISOString();
    return new Date(dateValue).toISOString().split("T")[0];
  }, [formData.availabilityDate]);

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Availability & Restrictions
          </h2>
        </div>
        <div className="mb-6 space-y-6">
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Available From
            </label>
            <input
              type="date"
              value={formattedDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availabilityDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
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
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Pet Policy
            </label>
            <select
              value={formData.petPolicy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  petPolicy: e.target.value || null,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>Not allowed</option>
              <option>Small pets allowed</option>
              <option>All pets allowed</option>
            </select>
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Smoking Policy
            </label>
            <select
              value={formData.smokingPolicy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  smokingPolicy: e.target.value || null,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>Not allowed</option>
              <option>Allowed</option>
              <option>Allowed in outdoor areas only</option>
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
      transition={{ duration: 0.5, delay: 0.5 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Availability & Restrictions
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Available From</p>
            <p className="text-vista-primary font-semibold">
              {property.availabilityDate
                ? new Date(property.availabilityDate).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
        </div>
        {property.minimumLeasePeriod && (
          <div className="flex items-start gap-3">
            <Calendar className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Minimum Lease Period</p>
              <p className="text-vista-primary font-semibold">
                {property.minimumLeasePeriod}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <PawPrint className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Pet Policy</p>
            <p className="text-vista-primary font-semibold">
              {property.petPolicy}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Cigarette className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
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

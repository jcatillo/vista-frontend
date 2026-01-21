import { motion } from "framer-motion";
import { CheckCircle2, Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsFeatureListProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsFeatureList({
  property,
  onUpdate,
}: PropertyDetailsFeatureListProps) {
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
        transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">
            Features & Amenities
          </h2>
        </div>
        <div className="space-y-6 mb-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-vista-primary font-semibold">Interior Features</h3>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    interiorFeatures: [...(prev.interiorFeatures || []), ""],
                  }))
                }
                className="p-1 text-vista-accent hover:bg-vista-accent/10 rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.interiorFeatures?.map((feature: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const updated = [...(prev.interiorFeatures || [])];
                        updated[idx] = e.target.value;
                        return { ...prev, interiorFeatures: updated };
                      })
                    }
                    className="flex-1 px-3 py-2 rounded border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors text-sm"
                    placeholder="Feature name"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        interiorFeatures: prev.interiorFeatures?.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-vista-primary font-semibold">
                Building / Community Amenities
              </h3>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    buildingAmenities: [...(prev.buildingAmenities || []), ""],
                  }))
                }
                className="p-1 text-vista-accent hover:bg-vista-accent/10 rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.buildingAmenities?.map((amenity: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const updated = [...(prev.buildingAmenities || [])];
                        updated[idx] = e.target.value;
                        return { ...prev, buildingAmenities: updated };
                      })
                    }
                    className="flex-1 px-3 py-2 rounded border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors text-sm"
                    placeholder="Amenity name"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        buildingAmenities: prev.buildingAmenities?.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-vista-primary font-semibold">Utilities</h3>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    utilities: [...(prev.utilities || []), ""],
                  }))
                }
                className="p-1 text-vista-accent hover:bg-vista-accent/10 rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.utilities?.map((utility: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={utility}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const updated = [...(prev.utilities || [])];
                        updated[idx] = e.target.value;
                        return { ...prev, utilities: updated };
                      })
                    }
                    className="flex-1 px-3 py-2 rounded border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors text-sm"
                    placeholder="Utility name"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        utilities: prev.utilities?.filter((_, i) => i !== idx),
                      }))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
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
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-vista-primary text-xl font-bold">
          Features & Amenities
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-vista-accent hover:bg-vista-accent/10 rounded-lg transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6">
        {property.interiorFeatures && property.interiorFeatures.length > 0 && (
          <div>
            <h3 className="text-vista-primary font-semibold mb-3">
              Interior Features
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {property.interiorFeatures.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="text-vista-accent h-4 w-4 shrink-0" />
                  <span className="text-vista-text/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {property.buildingAmenities && property.buildingAmenities.length > 0 && (
          <div>
            <h3 className="text-vista-primary font-semibold mb-3">
              Building / Community Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {property.buildingAmenities.map(
                (amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="text-vista-accent h-4 w-4 shrink-0" />
                    <span className="text-vista-text/80 text-sm">
                      {amenity}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {property.utilities && property.utilities.length > 0 && (
          <div>
            <h3 className="text-vista-primary font-semibold mb-3">
              Utilities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {property.utilities.map((utility: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="text-vista-accent h-4 w-4 shrink-0" />
                  <span className="text-vista-text/80 text-sm">{utility}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

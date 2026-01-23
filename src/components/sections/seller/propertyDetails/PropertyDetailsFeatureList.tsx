import { motion } from "framer-motion";
import { CheckCircle2, Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
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
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Features & Amenities
          </h2>
        </div>
        <div className="mb-6 space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-vista-primary font-semibold">
                Interior Features
              </h3>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    interiorFeatures: [...(prev.interiorFeatures || []), ""],
                  }))
                }
                className="text-vista-accent hover:bg-vista-accent/10 rounded p-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.interiorFeatures?.map(
                (feature: string, idx: number) => (
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
                      className="border-vista-surface/30 focus:border-vista-accent flex-1 rounded border px-3 py-2 text-sm transition-colors focus:outline-none"
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
                      className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
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
                className="text-vista-accent hover:bg-vista-accent/10 rounded p-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.buildingAmenities?.map(
                (amenity: string, idx: number) => (
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
                      className="border-vista-surface/30 focus:border-vista-accent flex-1 rounded border px-3 py-2 text-sm transition-colors focus:outline-none"
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
                      className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-vista-primary font-semibold">Utilities</h3>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    utilities: [...(prev.utilities || []), ""],
                  }))
                }
                className="text-vista-accent hover:bg-vista-accent/10 rounded p-1 transition-colors"
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
                    className="border-vista-surface/30 focus:border-vista-accent flex-1 rounded border px-3 py-2 text-sm transition-colors focus:outline-none"
                    placeholder="Utility name"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        utilities: prev.utilities?.filter((_, i) => i !== idx),
                      }))
                    }
                    className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
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
      transition={{ duration: 0.5, delay: 0.35 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Features & Amenities
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6">
        {property.interiorFeatures && property.interiorFeatures.length > 0 && (
          <div>
            <h3 className="text-vista-primary mb-3 font-semibold">
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

        {property.buildingAmenities &&
          property.buildingAmenities.length > 0 && (
            <div>
              <h3 className="text-vista-primary mb-3 font-semibold">
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
            <h3 className="text-vista-primary mb-3 font-semibold">Utilities</h3>
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

import { motion } from "framer-motion";
import { MapPin, Accessibility, Building2, Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsNearbyProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsNearby({
  property,
  onUpdate,
}: PropertyDetailsNearbyProps) {
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

  const renderEstablishments = (establishments: Array<{ distance: string; name: string }>) => {
    return establishments.map((est, index) => (
      <p key={index} className="text-vista-primary font-semibold">
        {est.distance} km - {est.name}
      </p>
    ));
  };

  if (isEditing) {
    const editCategories = [
      { key: "schools", label: "Schools" },
      { key: "hospitals", label: "Hospitals" },
      { key: "malls", label: "Malls" },
      { key: "publicTransport", label: "Public Transport" },
      { key: "offices", label: "Offices / Business" },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">
            Nearby Establishments
          </h2>
        </div>
        <div className="space-y-6 mb-6">
          {editCategories.map((category) => (
            <div key={category.key}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-vista-primary font-semibold">
                  {category.label}
                </h3>
                <button
                  onClick={() => {
                    const key = category.key as keyof typeof formData.nearbyEstablishments;
                    setFormData((prev) => ({
                      ...prev,
                      nearbyEstablishments: {
                        ...prev.nearbyEstablishments,
                        [key]: [...(prev.nearbyEstablishments[key] || []), { distance: "", name: "" }],
                      },
                    }));
                  }}
                  className="p-1 text-vista-accent hover:bg-vista-accent/10 rounded transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {(formData.nearbyEstablishments[category.key as keyof typeof formData.nearbyEstablishments] || []).map(
                  (est: { distance: string; name: string }, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={est.distance}
                        onChange={(e) => {
                          const key = category.key as keyof typeof formData.nearbyEstablishments;
                          setFormData((prev) => {
                            const updated = [...(prev.nearbyEstablishments[key] || [])];
                            updated[idx] = { ...updated[idx], distance: e.target.value };
                            return {
                              ...prev,
                              nearbyEstablishments: {
                                ...prev.nearbyEstablishments,
                                [key]: updated,
                              },
                            };
                          });
                        }}
                        placeholder="Distance (km)"
                        className="w-24 px-3 py-2 rounded border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors text-sm"
                      />
                      <input
                        type="text"
                        value={est.name}
                        onChange={(e) => {
                          const key = category.key as keyof typeof formData.nearbyEstablishments;
                          setFormData((prev) => {
                            const updated = [...(prev.nearbyEstablishments[key] || [])];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            return {
                              ...prev,
                              nearbyEstablishments: {
                                ...prev.nearbyEstablishments,
                                [key]: updated,
                              },
                            };
                          });
                        }}
                        placeholder="Establishment name"
                        className="grow px-3 py-2 rounded border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors text-sm"
                      />
                      <button
                        onClick={() => {
                          const key = category.key as keyof typeof formData.nearbyEstablishments;
                          setFormData((prev) => ({
                            ...prev,
                            nearbyEstablishments: {
                              ...prev.nearbyEstablishments,
                              [key]: prev.nearbyEstablishments[key]?.filter((_, i) => i !== idx),
                            },
                          }));
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
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
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-vista-primary text-xl font-bold">
          Nearby Establishments
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
          <MapPin className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Schools</p>
            {renderEstablishments(property.nearbyEstablishments.schools)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Building2 className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Hospitals</p>
            {renderEstablishments(property.nearbyEstablishments.hospitals)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Accessibility className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Malls</p>
            {renderEstablishments(property.nearbyEstablishments.malls)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Public Transport</p>
            {renderEstablishments(property.nearbyEstablishments.publicTransport)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Building2 className="text-vista-accent h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Offices / Business</p>
            {renderEstablishments(property.nearbyEstablishments.offices)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

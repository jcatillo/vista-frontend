import { motion } from "framer-motion";
import {
  MapPin,
  Accessibility,
  Building2,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";

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

  const categoryToField = {
    schools: "nearbySchools",
    hospitals: "nearbyHospitals",
    malls: "nearbyMalls",
    publicTransport: "nearbyTransport",
    offices: "nearbyOffices",
  } as const;

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

  const renderEstablishments = (
    establishments: Array<{ distance: string; name: string }>
  ) => {
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
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Nearby Establishments
          </h2>
        </div>
        <div className="mb-6 space-y-6">
          {editCategories.map((category) => (
            <div key={category.key}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-vista-primary font-semibold">
                  {category.label}
                </h3>
                <button
                  onClick={() => {
                    const field =
                      categoryToField[
                        category.key as keyof typeof categoryToField
                      ];
                    setFormData((prev) => ({
                      ...prev,
                      [field]: [
                        ...(prev[field] || []),
                        { distance: "", name: "" },
                      ],
                    }));
                  }}
                  className="text-vista-accent hover:bg-vista-accent/10 rounded p-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {(
                  formData[
                    categoryToField[
                      category.key as keyof typeof categoryToField
                    ]
                  ] || []
                ).map(
                  (est: { distance: string; name: string }, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={est.distance}
                        onChange={(e) => {
                          const field =
                            categoryToField[
                              category.key as keyof typeof categoryToField
                            ];
                          setFormData((prev) => {
                            const updated = [...(prev[field] || [])];
                            updated[idx] = {
                              ...updated[idx],
                              distance: e.target.value,
                            };
                            return {
                              ...prev,
                              [field]: updated,
                            };
                          });
                        }}
                        placeholder="Distance (km)"
                        className="border-vista-surface/30 focus:border-vista-accent w-24 rounded border px-3 py-2 text-sm transition-colors focus:outline-none"
                      />
                      <input
                        type="text"
                        value={est.name}
                        onChange={(e) => {
                          const field =
                            categoryToField[
                              category.key as keyof typeof categoryToField
                            ];
                          setFormData((prev) => {
                            const updated = [...(prev[field] || [])];
                            updated[idx] = {
                              ...updated[idx],
                              name: e.target.value,
                            };
                            return {
                              ...prev,
                              [field]: updated,
                            };
                          });
                        }}
                        placeholder="Establishment name"
                        className="border-vista-surface/30 focus:border-vista-accent grow rounded border px-3 py-2 text-sm transition-colors focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const field =
                            categoryToField[
                              category.key as keyof typeof categoryToField
                            ];
                          setFormData((prev) => ({
                            ...prev,
                            [field]: (prev[field] || []).filter(
                              (_, i) => i !== idx
                            ),
                          }));
                        }}
                        className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
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
      transition={{ duration: 0.5, delay: 0.4 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Nearby Establishments
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
          <MapPin className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Schools</p>
            {renderEstablishments(property.nearbySchools)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Building2 className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Hospitals</p>
            {renderEstablishments(property.nearbyHospitals)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Accessibility className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Malls</p>
            {renderEstablishments(property.nearbyMalls)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Public Transport</p>
            {renderEstablishments(property.nearbyTransport)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Building2 className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="text-vista-text/60 text-sm">Offices / Business</p>
            {renderEstablishments(property.nearbyOffices)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

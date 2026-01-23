// PropertyFeaturesForm.tsx - Step 4: Description & Features

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { StepProps } from "./interface";

export function PropertyFeaturesForm({
  formData,
  onUpdate,
  onArrayToggle,
}: StepProps) {
  const amenitiesList = [
    "Swimming Pool",
    "Gym",
    "Security (24/7)",
    "Garden",
    "Playground",
    "Elevator",
    "Generator",
    "Clubhouse",
  ];

  const interiorFeaturesList = [
    "Air-conditioning",
    "Built-in cabinets",
    "Balcony",
    "Kitchen appliances",
    "Walk-in closet",
    "Smart home system",
  ];

  const utilitiesList = [
    "Water",
    "Electricity",
    "Internet readiness",
    "Gas line",
    "Sewage system",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Description & Features
        </h3>
      </div>

      {/* Property Description */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Property Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Provide a detailed description of the property, highlighting unique features and selling points..."
          rows={4}
          className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full resize-none rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="hover:bg-vista-surface/20 flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => onArrayToggle("amenities", amenity)}
                className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
              />
              <span className="text-vista-text text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interior Features */}
      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Interior Features
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interiorFeaturesList.map((feature) => (
            <label
              key={feature}
              className="hover:bg-vista-surface/20 flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.interiorFeatures.includes(feature)}
                onChange={() => onArrayToggle("interiorFeatures", feature)}
                className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
              />
              <span className="text-vista-text text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Utilities */}
      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Utilities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {utilitiesList.map((utility) => (
            <label
              key={utility}
              className="hover:bg-vista-surface/20 flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.utilities.includes(utility)}
                onChange={() => onArrayToggle("utilities", utility)}
                className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
              />
              <span className="text-vista-text text-sm">{utility}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

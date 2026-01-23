import { motion } from "framer-motion";
import { Edit2, Check, X, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsLocationProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsLocation({
  property,
  onUpdate,
}: PropertyDetailsLocationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Property>(property);
  const [inputMode, setInputMode] = useState<"address" | "map">("address");

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
    setInputMode("address");
    setIsEditing(false);
  };

  const handleMapClick = () => {
    // This will be replaced with actual Google Maps integration
    // For now, we'll show a placeholder
    alert("Map interaction will be implemented with Google Maps API");
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 overflow-hidden p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">Location</h2>
        </div>

        {/* Toggle between Address and Map */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode("address")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === "address"
                ? "bg-vista-primary text-white"
                : "bg-vista-surface/30 text-vista-text hover:bg-vista-surface/50"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setInputMode("map")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              inputMode === "map"
                ? "bg-vista-primary text-white"
                : "bg-vista-surface/30 text-vista-text hover:bg-vista-surface/50"
            }`}
          >
            <MapIcon className="h-4 w-4" />
            Map
          </button>
        </div>

        {/* Address Input Mode */}
        {inputMode === "address" && (
          <div className="mb-6">
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors resize-none"
              placeholder="Enter property address"
            />
          </div>
        )}

        {/* Map Input Mode */}
        {inputMode === "map" && (
          <div className="mb-6">
            <label className="block text-vista-text/70 text-sm font-medium mb-2">
              Click on the map to select coordinates
            </label>
            <div
              onClick={handleMapClick}
              className="w-full h-96 rounded-lg border-2 border-vista-surface/30 bg-vista-surface/10 flex items-center justify-center cursor-pointer hover:border-vista-accent transition-colors"
            >
              <div className="text-center">
                <MapIcon className="h-12 w-12 text-vista-accent/50 mx-auto mb-2" />
                <p className="text-vista-text/60 text-sm">
                  Interactive map selection coming soon
                </p>
                <p className="text-vista-text/40 text-xs mt-1">
                  Currently showing embed preview
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-vista-accent/10 rounded-lg">
              <p className="text-sm text-vista-text/70">
                <strong>Tip:</strong> You can enter your address above or use the map
                to find the exact location by clicking on it.
              </p>
            </div>
          </div>
        )}

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
      className="bg-white shadow-soft rounded-2xl border border-white/50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 md:p-8 pb-3">
        <h2 className="text-vista-primary text-xl font-bold">Location</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-vista-accent hover:bg-vista-accent/10 rounded-lg transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <iframe
        width="100%"
        height="400"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD7e1bXPT7V9zHBCwkrXdnZ4M4QqM4WUu8&q=${encodeURIComponent(property.address)}`}
        allowFullScreen={true}
        loading="lazy"
      />
    </motion.div>
  );
}

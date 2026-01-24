import { motion } from "framer-motion";
import { Edit2, Check, X, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
import { patchProperty } from "../../../../services/propertyService";

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
    try {
      // Only send changed fields
      const changedFields: Partial<Property> = {};
      if (formData.address !== property.address)
        changedFields.address = formData.address;
      if (formData.latitude !== property.latitude)
        changedFields.latitude = formData.latitude;
      if (formData.longitude !== property.longitude)
        changedFields.longitude = formData.longitude;

      if (Object.keys(changedFields).length > 0) {
        const updatedProperty = await patchProperty(
          property.propertyId,
          changedFields
        );
        onUpdate?.(updatedProperty);
      } else {
        // No changes, just close edit mode
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update property:", error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
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
        className="shadow-soft overflow-hidden rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">Location</h2>
        </div>

        {/* Toggle between Address and Map */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setInputMode("address")}
            className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
              inputMode === "address"
                ? "bg-vista-primary text-white"
                : "bg-vista-surface/30 text-vista-text hover:bg-vista-surface/50"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setInputMode("map")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
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
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
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
              className="border-vista-surface/30 focus:border-vista-accent w-full resize-none rounded-lg border px-4 py-2 transition-colors focus:outline-none"
              placeholder="Enter property address"
            />
          </div>
        )}

        {/* Map Input Mode */}
        {inputMode === "map" && (
          <div className="mb-6">
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Click on the map to select coordinates
            </label>
            <div
              onClick={handleMapClick}
              className="border-vista-surface/30 bg-vista-surface/10 hover:border-vista-accent flex h-96 w-full cursor-pointer items-center justify-center rounded-lg border-2 transition-colors"
            >
              <div className="text-center">
                <MapIcon className="text-vista-accent/50 mx-auto mb-2 h-12 w-12" />
                <p className="text-vista-text/60 text-sm">
                  Interactive map selection coming soon
                </p>
                <p className="text-vista-text/40 mt-1 text-xs">
                  Currently showing embed preview
                </p>
              </div>
            </div>
            <div className="bg-vista-accent/10 mt-4 rounded-lg p-4">
              <p className="text-vista-text/70 text-sm">
                <strong>Tip:</strong> You can enter your address above or use
                the map to find the exact location by clicking on it.
              </p>
            </div>
          </div>
        )}

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
      className="shadow-soft overflow-hidden rounded-2xl border border-white/50 bg-white"
    >
      <div className="flex items-center justify-between p-6 pb-3 md:p-8">
        <h2 className="text-vista-primary text-xl font-bold">Location</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
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

import { motion } from "framer-motion";
import { Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsAboutProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsAbout({
  property,
  onUpdate,
}: PropertyDetailsAboutProps) {
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
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">About</h2>
        </div>
        <div className="mb-6">
          <label className="block text-vista-text/70 text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors resize-none"
          />
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-vista-primary text-xl font-bold">About</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-vista-accent hover:bg-vista-accent/10 rounded-lg transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <p className="text-vista-text/80 leading-relaxed">{property.description}</p>
    </motion.div>
  );
}

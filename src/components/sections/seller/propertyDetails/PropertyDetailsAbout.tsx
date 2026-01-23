import { motion } from "framer-motion";
import { Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";

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
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">About</h2>
        </div>
        <div className="mb-6">
          <label className="text-vista-text/70 mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            value={formData.description ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            className="border-vista-surface/30 focus:border-vista-accent w-full resize-none rounded-lg border px-4 py-2 transition-colors focus:outline-none"
          />
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">About</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <p className="text-vista-text/80 leading-relaxed">
        {property.description}
      </p>
    </motion.div>
  );
}

import { useState } from "react";
import type { Property } from "../data/properties";

export function useInlineEdit(property: Property, onSave: (updated: Property) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Property>(property);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSave(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(property);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    isSaving,
    formData,
    setFormData,
    handleSave,
    handleCancel,
  };
}

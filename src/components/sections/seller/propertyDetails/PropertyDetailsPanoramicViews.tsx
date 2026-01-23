import { motion } from "framer-motion";
import { Edit2, Check, X, Plus, Trash2, Upload, Headphones } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Property } from "../../../../data/properties";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsPanoramicViewsProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsPanoramicViews({
  property,
  onUpdate,
}: PropertyDetailsPanoramicViewsProps) {
  const navigate = useNavigate();
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

  const addPanoramicImage = () => {
    const newImages = formData.panoramicImages || [];
    setFormData((prev) => ({
      ...prev,
      panoramicImages: [...newImages, { url: "", title: "", description: "" }],
    }));
  };

  const removePanoramicImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      panoramicImages: prev.panoramicImages?.filter((_, i) => i !== index) || [],
    }));
  };

  const updatePanoramicImage = (
    index: number,
    field: "url" | "title" | "description",
    value: string
  ) => {
    setFormData((prev) => {
      const images = [...(prev.panoramicImages || [])];
      images[index] = { ...images[index], [field]: value };
      return { ...prev, panoramicImages: images };
    });
  };

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      updatePanoramicImage(index, "url", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-vista-primary text-xl font-bold">
            Panoramic Views
          </h2>
        </div>

        <div className="space-y-6 mb-6">
          {(formData.panoramicImages || []).map((image, index) => (
            <div key={index} className="p-4 border border-vista-surface/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-vista-text font-medium">
                  Panoramic View {index + 1}
                </h3>
                <button
                  onClick={() => removePanoramicImage(index)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-vista-text/70 text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) => updatePanoramicImage(index, "url", e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-vista-text/70 text-sm font-medium mb-2">
                    Or Upload from Device
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-vista-accent/50 rounded-lg hover:border-vista-accent hover:bg-vista-accent/5 cursor-pointer transition-colors">
                    <Upload size={18} className="text-vista-accent" />
                    <span className="text-vista-accent text-sm font-medium">
                      Click to upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(index, file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {image.url && (
                  <div>
                    <p className="text-vista-text/70 text-sm font-medium mb-2">
                      Preview
                    </p>
                    <img
                      src={image.url}
                      alt={image.title || `Panoramic View ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-vista-surface/20"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-vista-text/70 text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={image.title || ""}
                    onChange={(e) => updatePanoramicImage(index, "title", e.target.value)}
                    placeholder="e.g., Ocean View Panorama"
                    className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-vista-text/70 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={image.description || ""}
                    onChange={(e) =>
                      updatePanoramicImage(index, "description", e.target.value)
                    }
                    placeholder="Describe this panoramic view"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-vista-surface/30 focus:border-vista-accent focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addPanoramicImage}
          className="w-full mb-6 py-2 px-4 border-2 border-dashed border-vista-accent text-vista-accent hover:bg-vista-accent/5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Panoramic View
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 bg-vista-accent text-white px-4 py-2 rounded-lg hover:bg-vista-accent/90 transition-colors disabled:opacity-50"
          >
            <Check size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-2 border border-vista-surface/30 text-vista-text px-4 py-2 rounded-lg hover:bg-vista-surface/10 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  const panoramicImages = property.panoramicImages || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-vista-primary text-xl font-bold">Panoramic Views</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/vr-viewer/${property.id}`)}
            className="flex items-center gap-2 bg-vista-accent/10 hover:bg-vista-accent/20 text-vista-accent px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <Headphones size={18} />
            Experience in VR
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-vista-accent hover:text-vista-primary transition-colors"
          >
            <Edit2 size={18} />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
      </div>

      {panoramicImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-vista-text/50 mb-4">No panoramic views added yet</p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 text-vista-accent hover:text-vista-primary transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Add Panoramic Views</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panoramicImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg overflow-hidden bg-vista-surface/10"
            >
              <div className="aspect-video overflow-hidden bg-vista-surface/20">
                <img
                  src={image.url}
                  alt={image.title || `Panoramic View ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                {image.title && (
                  <h3 className="text-vista-primary font-semibold mb-2">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-vista-text/70 text-sm">{image.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

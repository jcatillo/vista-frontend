import { motion } from "framer-motion";
import {
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Upload,
  Headphones,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Property } from "../../../../types/property";
import { patchProperty } from "../../../../services/propertyService";

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
    try {
      // Only send changed fields
      const changedFields: Partial<Property> = {};
      if (
        JSON.stringify(formData.panoramicImages) !==
        JSON.stringify(property.panoramicImages)
      )
        changedFields.panoramicImages = formData.panoramicImages;

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
      panoramicImages:
        prev.panoramicImages?.filter((_, i) => i !== index) || [],
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
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Panoramic Views
          </h2>
        </div>

        <div className="mb-6 space-y-6">
          {(formData.panoramicImages || []).map((image, index) => (
            <div
              key={index}
              className="border-vista-surface/30 rounded-lg border p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-vista-text font-medium">
                  Panoramic View {index + 1}
                </h3>
                <button
                  onClick={() => removePanoramicImage(index)}
                  className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-vista-text/70 mb-2 block text-sm font-medium">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) =>
                      updatePanoramicImage(index, "url", e.target.value)
                    }
                    placeholder="Enter image URL"
                    className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-vista-text/70 mb-2 block text-sm font-medium">
                    Or Upload from Device
                  </label>
                  <label className="border-vista-accent/50 hover:border-vista-accent hover:bg-vista-accent/5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-colors">
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
                    <p className="text-vista-text/70 mb-2 text-sm font-medium">
                      Preview
                    </p>
                    <img
                      src={image.url}
                      alt={image.title || `Panoramic View ${index + 1}`}
                      className="border-vista-surface/20 h-40 w-full rounded-lg border object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="text-vista-text/70 mb-2 block text-sm font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    value={image.title || ""}
                    onChange={(e) =>
                      updatePanoramicImage(index, "title", e.target.value)
                    }
                    placeholder="e.g., Ocean View Panorama"
                    className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-vista-text/70 mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={image.description || ""}
                    onChange={(e) =>
                      updatePanoramicImage(index, "description", e.target.value)
                    }
                    placeholder="Describe this panoramic view"
                    rows={2}
                    className="border-vista-surface/30 focus:border-vista-accent w-full resize-none rounded-lg border px-4 py-2 transition-colors focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addPanoramicImage}
          className="border-vista-accent text-vista-accent hover:bg-vista-accent/5 mb-6 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 transition-colors"
        >
          <Plus size={18} />
          Add Panoramic View
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-vista-accent hover:bg-vista-accent/90 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition-colors disabled:opacity-50"
          >
            <Check size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            className="border-vista-surface/30 text-vista-text hover:bg-vista-surface/10 flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  const panoramicImagesFromType =
    property.images?.filter((img) => img.imageType === "panoramic") || [];
  const allPanoramicImages = [
    ...(property.panoramicImages || []).map((img) => ({
      url: img.url,
      title: img.title || "",
      description: img.description || "",
      isFromImages: false,
    })),
    ...panoramicImagesFromType.map((img) => ({
      url: img.url,
      title: img.filename || "",
      description: "",
      isFromImages: true,
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Panoramic Views
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate(`/vr-viewer/${property.id || property.propertyId}`, {
                state: { property },
              })
            }
            className="bg-vista-accent/10 hover:bg-vista-accent/20 text-vista-accent flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Headphones size={18} />
            Experience in VR
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-vista-accent hover:text-vista-primary flex items-center gap-2 transition-colors"
          >
            <Edit2 size={18} />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
      </div>

      {allPanoramicImages.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-vista-text/50 mb-4">
            No panoramic views added yet
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-vista-accent hover:text-vista-primary inline-flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Add Panoramic Views</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {allPanoramicImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-vista-surface/10 overflow-hidden rounded-lg"
            >
              <div className="bg-vista-surface/20 aspect-video overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title || `Panoramic View ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                {image.title && (
                  <h3 className="text-vista-primary mb-2 font-semibold">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-vista-text/70 text-sm">
                    {image.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

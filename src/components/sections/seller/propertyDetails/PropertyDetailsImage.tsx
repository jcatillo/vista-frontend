import { useState } from "react";
import { motion } from "framer-motion";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
} from "lucide-react";
import type { Property, PropertyImage } from "../../../../types/property";

/**
 * Custom scrollbar styling for thumbnail image strip
 * Uses webkit for Chrome/Safari compatibility with teal accent color
 */
const scrollbarStyles = `
  .property-image-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .property-image-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .property-image-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(47, 191, 161, 0.5);
    border-radius: 3px;
  }
  
  .property-image-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(47, 191, 161, 0.8);
  }
`;

interface PropertyDetailsImageProps {
  property: Property;
  onImageExpanded: (
    expanded: boolean,
    imageIndex: number,
    images?: PropertyImage[]
  ) => void;
  onUpdate?: (updated: Property) => void;
}

/**
 * PropertyDetailsImage Component
 *
 * Comprehensive image gallery with editing capabilities.
 *
 * View Mode Features:
 * - Display current image with navigation arrows
 * - Thumbnail strip at bottom for quick navigation
 * - Image counter (e.g., "1 / 6")
 * - Expand button to fullscreen view
 * - Edit button to enter management mode
 *
 * Edit Mode Features:
 * - Add images via URL input
 * - Add images via local file upload (converted to base64 data URLs)
 * - Rearrange images with up/down arrows
 * - Delete unwanted images
 * - Set thumbnail (which image displays first)
 * - Visual indicator for current thumbnail selection
 * - Save/Cancel buttons with validation
 *
 * Data Persistence:
 * - Changes saved via onUpdate callback
 * - Updates both 'images' array and 'image' (thumbnail)
 * - Parent component synced via onUpdate callback
 */
export function PropertyDetailsImage({
  property,
  onImageExpanded,
  onUpdate,
}: PropertyDetailsImageProps) {
  // Current image index being displayed in gallery view
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Toggle between view and edit modes
  const [isEditing, setIsEditing] = useState(false);
  // Track async save operation
  const [isSaving, setIsSaving] = useState(false);
  // Local editable array of image URLs (allows cancel without persisting)
  const [editImages, setEditImages] = useState<PropertyImage[]>(
    property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : []
  );
  // Index of the image to use as thumbnail
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  // Temp input for adding image via URL
  const [newImageUrl, setNewImageUrl] = useState("");

  // Get display images (handle both single image and array formats)
  const images = editImages;

  /**
   * Navigate to previous image in gallery (loops to end)
   */
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  /**
   * Navigate to next image in gallery (loops to start)
   */
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  /**
   * Add image from URL input
   * - Validates URL is not empty
   * - Appends to editImages array
   * - Clears input field for next entry
   */
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      const newImage: PropertyImage = {
        id: `img_${Date.now()}`,
        url: newImageUrl,
        filename: "",
        imageType: "regular",
      };
      setEditImages([...editImages, newImage]);
      setNewImageUrl("");
    }
  };

  /**
   * Add image from local file upload
   * - Uses FileReader API to convert file to base64 data URL
   * - Stores as data URL for persistence without server upload
   * - Supports all image formats (jpg, png, gif, webp, etc.)
   */
  const handleAddImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newImage: PropertyImage = {
          id: `img_${Date.now()}`,
          url: dataUrl,
          filename: file.name,
          imageType: "regular",
        };
        setEditImages([...editImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Delete image at specified index
   * - Updates editImages array
   * - Adjusts thumbnailIndex if needed (prevents out of bounds)
   */
  const handleDeleteImage = (idx: number) => {
    const newImages = editImages.filter((_, i) => i !== idx);
    setEditImages(newImages);
    if (thumbnailIndex >= newImages.length) {
      setThumbnailIndex(Math.max(0, newImages.length - 1));
    }
  };

  /**
   * Move image up one position
   * - Swaps with previous image using destructuring
   * - Updates thumbnailIndex if moved image was thumbnail
   */
  const handleMoveUp = (idx: number) => {
    if (idx > 0) {
      const newImages = [...editImages];
      [newImages[idx], newImages[idx - 1]] = [
        newImages[idx - 1],
        newImages[idx],
      ];
      setEditImages(newImages);
      if (thumbnailIndex === idx) setThumbnailIndex(idx - 1);
      else if (thumbnailIndex === idx - 1) setThumbnailIndex(idx);
    }
  };

  /**
   * Move image down one position
   * - Swaps with next image using destructuring
   * - Updates thumbnailIndex if moved image was thumbnail
   */
  const handleMoveDown = (idx: number) => {
    if (idx < editImages.length - 1) {
      const newImages = [...editImages];
      [newImages[idx], newImages[idx + 1]] = [
        newImages[idx + 1],
        newImages[idx],
      ];
      setEditImages(newImages);
      if (thumbnailIndex === idx) setThumbnailIndex(idx + 1);
      else if (thumbnailIndex === idx + 1) setThumbnailIndex(idx);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updatedProperty: Property = {
      ...property,
      images: editImages,
      image: editImages.length > 0 ? editImages[thumbnailIndex] : null,
      regularImageCount: editImages.filter((img) => img.imageType === "regular")
        .length,
      panoramicImageCount: editImages.filter(
        (img) => img.imageType === "panoramic"
      ).length,
    };
    onUpdate?.(updatedProperty);
    setIsSaving(false);
    setIsEditing(false);
  };

  /**
   * Cancel edit mode and revert all changes
   * - Resets editImages to original property images
   * - Resets thumbnail index
   * - Clears URL input field
   */
  const handleCancel = () => {
    setEditImages(
      property.images && property.images.length > 0
        ? property.images
        : property.image
          ? [property.image]
          : []
    );
    setThumbnailIndex(0);
    setNewImageUrl("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-soft overflow-hidden rounded-2xl border border-white/50 bg-white p-6"
      >
        <h2 className="text-vista-primary mb-6 text-xl font-bold">
          Edit Images
        </h2>

        {/* Add Image Section */}
        <div className="bg-vista-surface/20 mb-6 rounded-lg p-4">
          <h3 className="text-vista-text mb-3 font-semibold">Add Images</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="border-vista-surface/30 focus:border-vista-accent flex-1 rounded-lg border px-4 py-2 focus:outline-none"
              />
              <button
                onClick={handleAddImageUrl}
                className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add URL
              </button>
            </div>
            <div>
              <label className="bg-vista-primary hover:bg-vista-primary/90 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors">
                <Plus className="h-4 w-4" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Images List */}
        <div className="mb-6 space-y-3">
          <h3 className="text-vista-text font-semibold">Images</h3>
          {editImages.length === 0 ? (
            <p className="text-vista-text/50 text-sm">No images added yet</p>
          ) : (
            editImages.map((img, idx) => (
              <div
                key={idx}
                className={`flex gap-4 rounded-lg border-2 p-3 transition-colors ${
                  thumbnailIndex === idx
                    ? "border-vista-accent bg-vista-accent/5"
                    : "border-vista-surface/30"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Preview ${idx + 1}`}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-vista-text text-sm font-medium">
                    Image {idx + 1}
                  </p>
                  {thumbnailIndex === idx && (
                    <p className="text-vista-accent text-xs font-medium">
                      Thumbnail
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setThumbnailIndex(idx)}
                    title="Set as thumbnail"
                    className={`rounded-lg p-2 transition-colors ${
                      thumbnailIndex === idx
                        ? "bg-vista-accent text-white"
                        : "bg-vista-surface/30 text-vista-text hover:bg-vista-surface/50"
                    }`}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="bg-vista-surface/30 text-vista-text hover:bg-vista-surface/50 rounded-lg p-2 transition-colors disabled:opacity-50"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === editImages.length - 1}
                    className="bg-vista-surface/30 text-vista-text hover:bg-vista-surface/50 rounded-lg p-2 transition-colors disabled:opacity-50"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(idx)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="border-vista-surface/30 text-vista-text hover:bg-vista-surface/10 flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || editImages.length === 0}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="shadow-soft relative overflow-hidden rounded-2xl border border-white/50"
    >
      <style>{scrollbarStyles}</style>
      <img
        src={images[currentImageIndex]?.url}
        alt={`${property.name} - Image ${currentImageIndex + 1}`}
        className="h-96 w-full object-cover"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="bg-vista-primary/80 hover:bg-vista-primary absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="bg-vista-primary/80 hover:bg-vista-primary absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="bg-vista-primary/80 absolute bottom-4 left-4 rounded-lg px-3 py-1 text-xs font-medium text-white">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

      {/* Buttons Container */}
      <div className="absolute right-4 bottom-4 flex gap-2">
        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="bg-vista-accent hover:bg-vista-accent/90 flex items-center gap-2 rounded-xl px-3 py-2 text-white transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span className="text-xs font-medium">Edit</span>
        </button>

        {/* Expand Button */}
        <button
          onClick={() => onImageExpanded(true, currentImageIndex, images)}
          className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-2 rounded-xl px-3 py-2 text-white transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="text-xs font-medium">Expand</span>
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="property-image-scrollbar absolute right-0 bottom-16 left-0 flex gap-2 overflow-x-auto px-4 pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                idx === currentImageIndex
                  ? "border-vista-accent scale-110"
                  : "border-white/30 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

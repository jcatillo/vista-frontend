import { Image, Check } from "lucide-react";
import type { StepProps } from "./interface";
import { motion } from "framer-motion";

export function ThumbnailStep({ formData, onSelectThumbnail }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Image className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Select Main Thumbnail
        </h3>
      </div>

      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Choose Main Thumbnail *
        </label>
        <p className="text-vista-text/60 mb-4 text-xs">
          Select the image that will be displayed as the main thumbnail for your
          property listing.
        </p>
        {formData.regularImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {formData.regularImages.map((file, idx) => (
              <div key={idx} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelectThumbnail(idx)}
                  className={`relative h-24 w-full rounded-lg border-2 transition-all ${
                    formData.selectedThumbnailIndex === idx
                      ? "border-vista-accent ring-vista-accent/20 ring-2"
                      : "hover:border-vista-accent/50 border-gray-200"
                  }`}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-full w-full rounded-lg object-cover"
                  />
                  {formData.selectedThumbnailIndex === idx && (
                    <div className="bg-vista-accent/20 absolute inset-0 flex items-center justify-center rounded-lg">
                      <Check className="text-vista-accent h-6 w-6" />
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-vista-text/60 text-sm">
            No images available. Please upload images in the Property Images
            step first.
          </p>
        )}
      </div>
    </motion.div>
  );
}

import { Image, Upload, X } from "lucide-react";
import type { StepProps } from "./interface";
import { motion } from "framer-motion";

export function ImageStep({
  formData,
  onFileUpload,
  onRemoveImage,
}: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Image className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Property Images
        </h3>
      </div>

      {/* Regular Images */}
      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Regular Images *
        </label>
        <div className="border-vista-surface/40 hover:border-vista-accent cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onFileUpload("regularImages", e.target.files)}
            className="hidden"
            id="regular-upload"
          />
          <label htmlFor="regular-upload" className="cursor-pointer">
            <Upload className="text-vista-text/40 mx-auto mb-3 h-12 w-12" />
            <p className="text-vista-text/70 text-sm">
              Click to upload or drag and drop
            </p>
            <p className="text-vista-text/50 mt-1 text-xs">
              PNG, JPG up to 10MB
            </p>
          </label>
        </div>
        {formData.regularImages.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {formData.regularImages.map((file, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-24 w-full rounded-lg object-cover"
                />
                <button
                  onClick={() => onRemoveImage("regularImages", idx)}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panoramic Images */}
      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Panoramic Images (360°)
        </label>
        <div className="border-vista-surface/40 hover:border-vista-accent cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onFileUpload("panoramicImages", e.target.files)}
            className="hidden"
            id="panoramic-upload"
          />
          <label htmlFor="panoramic-upload" className="cursor-pointer">
            <p className="text-vista-text/70 text-sm">
              Upload 360° panoramic views
            </p>
            <p className="text-vista-text/50 mt-1 text-xs">
              Provide immersive property tours
            </p>
          </label>
        </div>
        {formData.panoramicImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {formData.panoramicImages.map((file, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-24 w-full rounded-lg object-cover"
                />
                <button
                  onClick={() => onRemoveImage("panoramicImages", idx)}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { Image, Upload, X } from "lucide-react";
import type { StepProps, RoomType } from "./interface";
import { motion } from "framer-motion";

export function ImageStep({
  formData,
  onFileUpload,
  onRemoveImage,
  onUpdateImageLabel,
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
            onChange={(e) => onFileUpload("regularImages", e.target.files, "")}
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
          <div className="mt-4 space-y-4">
            <h4 className="text-vista-primary text-sm font-medium">
              Uploaded Images
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {formData.regularImages.map((imageObj, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="group relative">
                    <img
                      src={URL.createObjectURL(imageObj.file)}
                      alt=""
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => onRemoveImage("regularImages", idx)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <select
                    value={imageObj.label}
                    onChange={(e) =>
                      onUpdateImageLabel(
                        "regularImages",
                        idx,
                        e.target.value as RoomType | ""
                      )
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="" disabled hidden>
                      Select room type...
                    </option>
                    <option value="Living Room">Living Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Master Bedroom">Master Bedroom</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Balcony/Terrace">Balcony/Terrace</option>
                    <option value="Garden/Yard">Garden/Yard</option>
                    <option value="Garage">Garage</option>
                    <option value="Hallway">Hallway</option>
                    <option value="Staircase">Staircase</option>
                    <option value="Basement">Basement</option>
                    <option value="Attic">Attic</option>
                    <option value="Laundry Room">Laundry Room</option>
                    <option value="Storage Room">Storage Room</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ))}
            </div>
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
            onChange={(e) =>
              onFileUpload("panoramicImages", e.target.files, "")
            }
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
          <div className="mt-4 space-y-4">
            <h4 className="text-vista-primary text-sm font-medium">
              360° Panoramic Images
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {formData.panoramicImages.map((imageObj, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="group relative">
                    <img
                      src={URL.createObjectURL(imageObj.file)}
                      alt=""
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => onRemoveImage("panoramicImages", idx)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <select
                    value={imageObj.label}
                    onChange={(e) =>
                      onUpdateImageLabel(
                        "panoramicImages",
                        idx,
                        e.target.value as RoomType | ""
                      )
                    }
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="" disabled hidden>
                      Select room type...
                    </option>
                    <option value="Living Room">Living Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Master Bedroom">Master Bedroom</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Balcony/Terrace">Balcony/Terrace</option>
                    <option value="Garden/Yard">Garden/Yard</option>
                    <option value="Garage">Garage</option>
                    <option value="Hallway">Hallway</option>
                    <option value="Staircase">Staircase</option>
                    <option value="Basement">Basement</option>
                    <option value="Attic">Attic</option>
                    <option value="Laundry Room">Laundry Room</option>
                    <option value="Storage Room">Storage Room</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

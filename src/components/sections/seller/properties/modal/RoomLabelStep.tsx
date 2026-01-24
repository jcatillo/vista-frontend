import { Image } from "lucide-react";
import type { StepProps, RoomType } from "./interface";
import { motion } from "framer-motion";

export function RoomLabelStep({ formData, onUpdateImageLabel }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Image className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Label Room Types
        </h3>
      </div>

      <div>
        <p className="text-vista-text/60 mb-4 text-sm">
          Assign room types to each of your uploaded images. This helps buyers
          understand what they're looking at.
        </p>

        {/* Regular Images */}
        {formData.regularImages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-vista-primary mb-3 font-medium">
              Regular Images
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {formData.regularImages.map((imageObj, idx) => (
                <div key={idx} className="space-y-2">
                  <img
                    src={URL.createObjectURL(imageObj.file)}
                    alt=""
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <select
                    value={imageObj.label}
                    onChange={(e) =>
                      onUpdateImageLabel(
                        "regularImages",
                        idx,
                        e.target.value as RoomType
                      )
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select room type...</option>
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

        {/* Panoramic Images */}
        {formData.panoramicImages.length > 0 && (
          <div>
            <h4 className="text-vista-primary mb-3 font-medium">
              360° Panoramic Images
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {formData.panoramicImages.map((imageObj, idx) => (
                <div key={idx} className="space-y-2">
                  <img
                    src={URL.createObjectURL(imageObj.file)}
                    alt=""
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <select
                    value={imageObj.label}
                    onChange={(e) =>
                      onUpdateImageLabel(
                        "panoramicImages",
                        idx,
                        e.target.value as RoomType
                      )
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select room type...</option>
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

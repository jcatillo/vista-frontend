import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { Property } from "../../../../types/property";

interface PropertyDetailsAmenitiesProps {
  property: Property;
}

export function PropertyDetailsAmenities({
  property,
}: PropertyDetailsAmenitiesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <h2 className="text-vista-primary mb-4 text-xl font-bold">Amenities</h2>
      <div className="grid grid-cols-2 gap-3">
        {property.amenities.map((amenity: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <CheckCircle2 className="text-vista-accent h-5 w-5 shrink-0" />
            <span className="text-vista-text/80 text-sm">{amenity}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

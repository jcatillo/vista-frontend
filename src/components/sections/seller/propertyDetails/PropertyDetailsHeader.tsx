import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Property } from "../../../../types/property";

interface PropertyDetailsHeaderProps {
  property: Property;
}

export function PropertyDetailsHeader({
  property,
}: PropertyDetailsHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8 md:py-6"
    >
      <button
        onClick={() => navigate("/seller/properties")}
        className="text-vista-text/60 hover:text-vista-primary mb-6 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Properties</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-vista-primary mb-2 text-3xl font-bold">
          {property.name}
        </h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-vista-text/70 text-base">{property.address}</p>
            <p className="text-vista-primary mt-2 text-2xl font-bold">
              {property.price}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

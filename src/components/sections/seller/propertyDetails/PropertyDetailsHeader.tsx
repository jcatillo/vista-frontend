import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Property } from "../../../../data/properties";

interface PropertyDetailsHeaderProps {
  property: Property;
}

export function PropertyDetailsHeader({ property }: PropertyDetailsHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl w-full px-4 py-4 md:px-8 md:py-6"
    >
      <button
        onClick={() => navigate("/seller/properties")}
        className="text-vista-text/60 hover:text-vista-primary flex items-center gap-2 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Properties</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-vista-primary text-3xl font-bold mb-2">
          {property.name}
        </h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-vista-text/70 text-base">{property.address}</p>
            <p className="text-vista-primary text-2xl font-bold mt-2">
              {property.price}
            </p>
          </div>
          <div className="bg-green-600 text-white rounded-xl px-4 py-2 w-fit">
            <span className="text-sm font-semibold">{property.status}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

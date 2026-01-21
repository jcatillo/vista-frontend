import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, Home, MapPin, AlertCircle, Trash2, Edit2, CheckCircle2, Clock } from "lucide-react";
import { propertyDatabase } from "../../../../data/properties";

const statusColors = {
  Active: "bg-green-600 text-white",
  Pending: "bg-amber-600 text-white",
  Draft: "bg-gray-500 text-white",
};

const statusIcons = {
  Active: CheckCircle2,
  Pending: Clock,
  Draft: AlertCircle,
};

export function PropertiesGrid() {
  const navigate = useNavigate();
  
  // Get properties dynamically from the database to reflect any changes
  const properties = Object.values(propertyDatabase).map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    status: p.status,
    views: p.views,
    inquiries: p.inquiries,
    image: p.image,
  }));
  
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {properties.map((property, idx) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => navigate(`/seller/properties/${property.id}`)}
            className="shadow-soft group overflow-hidden rounded-2xl border border-white/50 bg-white transition-shadow hover:shadow-lg cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative h-40 overflow-hidden bg-vista-bg">
              <img
                src={property.image}
                alt={property.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Status Badge */}
              <div
                className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  statusColors[property.status as keyof typeof statusColors]
                }`}
              >
                {(() => {
                  const StatusIcon = statusIcons[property.status as keyof typeof statusIcons];
                  return <StatusIcon className="h-3.5 w-3.5" />;
                })()}
                {property.status}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-vista-primary mb-1 text-base font-bold">
                {property.name}
              </h3>

              {/* Address */}
              <div className="text-vista-text/60 mb-3 flex items-start gap-1.5 text-xs">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{property.address}</span>
              </div>

              {/* Stats */}
              <div className="border-vista-surface/20 border-t pt-3">
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="bg-vista-surface/30 rounded-lg p-2 text-center">
                    <div className="text-vista-accent flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs font-bold">{property.views}</span>
                    </div>
                    <span className="text-vista-text/60 text-xs">Views</span>
                  </div>
                  <div className="bg-vista-surface/30 rounded-lg p-2 text-center">
                    <div className="text-vista-primary flex items-center justify-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs font-bold">{property.inquiries}</span>
                    </div>
                    <span className="text-vista-text/60 text-xs">Inquiries</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="text-vista-primary hover:bg-vista-surface/50 flex-1 flex items-center justify-center gap-1 rounded-lg py-2 transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Edit</span>
                  </button>
                  <button className="text-vista-text/60 hover:bg-red-500/10 hover:text-red-600 flex-1 flex items-center justify-center gap-1 rounded-lg py-2 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State (shown if no properties) */}
      {properties.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-vista-surface/20 col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-vista-surface/40 py-12"
        >
          <Home className="text-vista-text/40 mb-3 h-12 w-12" />
          <h3 className="text-vista-primary mb-1 text-lg font-semibold">
            No Properties Yet
          </h3>
          <p className="text-vista-text/60 text-sm">
            Start by adding your first property to get started
          </p>
        </motion.div>
      )}
    </section>
  );
}

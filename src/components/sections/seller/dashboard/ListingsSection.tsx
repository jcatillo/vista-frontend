import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BarChart3, Eye, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getSellerProperties } from "../../../../services/propertyService";
import type { SellerPropertyItem } from "../../../../types/property";
import { generatePropertyStats } from "../../../../utils/randomUtils";

export function ListingsSection() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<SellerPropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getSellerProperties();
        setProperties(response.properties.slice(0, 6)); // Show only first 6 properties
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center justify-between md:mb-8"
      >
        <div>
          <h2 className="text-vista-primary text-xl font-bold md:text-2xl">
            Your Properties
          </h2>
          <p className="text-vista-text/60 text-sm">
            Manage and monitor your property portfolio
          </p>
        </div>
        <button
          onClick={() => navigate("/seller/properties")}
          className="text-vista-accent hover:text-vista-primary flex items-center gap-1 text-sm font-medium transition-colors"
        >
          View All
          <BarChart3 className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {loading
          ? // Loading skeleton
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-64 animate-pulse rounded-2xl bg-gray-200"
              ></div>
            ))
          : properties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                delay={idx * 0.1}
                onNavigate={() => navigate(`/seller/properties/${property.id}`)}
              />
            ))}
      </div>
    </section>
  );
}

interface PropertyCardProps {
  property: SellerPropertyItem;
  delay: number;
  onNavigate?: () => void;
}

function PropertyCard({ property, delay, onNavigate }: PropertyCardProps) {
  const statusConfig = {
    published: {
      icon: CheckCircle2,
      color: "text-white bg-green-600",
      label: "Published",
    },
    pending_review: {
      icon: Clock,
      color: "text-white bg-amber-600",
      label: "Pending Review",
    },
    draft: {
      icon: AlertCircle,
      color: "text-white bg-gray-500",
      label: "Draft",
    },
    rejected: {
      icon: AlertCircle,
      color: "text-white bg-red-600",
      label: "Rejected",
    },
  };

  const status = statusConfig[property.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onNavigate?.()}
      className="group cursor-pointer"
    >
      <div className="shadow-soft h-full overflow-hidden rounded-2xl border border-white/50 bg-white transition-shadow duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={property.image || "/placeholder-property.jpg"}
            alt={property.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="from-vista-primary/60 absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


          {/* Price Badge */}
          <div className="bg-vista-primary/90 absolute bottom-3 left-3 rounded-lg px-3 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-bold text-white">
              ₱{property.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <h4 className="text-vista-primary mb-1 truncate text-base font-bold md:text-lg">
            {property.name}
          </h4>
          <p className="text-vista-text/60 mb-3 truncate text-xs md:text-sm">
            {property.address}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-vista-text/60 flex items-center gap-1.5 text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>
                {generatePropertyStats(property.propertyId).views} views
              </span>
            </div>
            <button className="text-vista-accent hover:text-vista-primary text-xs font-medium transition-colors">
              Manage →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

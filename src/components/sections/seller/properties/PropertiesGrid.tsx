import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { Eye, Home, MapPin, AlertCircle, Trash2, Edit2 } from "lucide-react";
import { getSellerProperties } from "../../../../services/propertyService";
import type { SellerPropertyItem } from "../../../../types/property";
import { generatePropertyStats } from "../../../../utils/randomUtils";

interface PropertiesGridProps {
  refetchTrigger?: number;
}

export interface PropertiesGridRef {
  refetch: () => void;
}

export const PropertiesGrid = forwardRef<
  PropertiesGridRef,
  PropertiesGridProps
>(({ refetchTrigger }, ref) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<SellerPropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getSellerProperties();
      setProperties(response.properties);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load properties"
      );
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refetch: fetchProperties,
  }));

  useEffect(() => {
    fetchProperties();
  }, [refetchTrigger]);

  // Generate random data only once using useMemo
  const displayProperties = useMemo(() => {
    return properties.map((p) => {
      const stats = generatePropertyStats(p.id);
      return {
        id: p.id,
        name: p.name,
        address: p.address,
        status: p.status,
        views: stats.views,
        inquiries: stats.inquiries,
        image: p.image,
        listingDate: stats.listingDate,
      };
    });
  }, [properties]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="text-vista-text/60">Loading properties...</div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center"
        >
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
          <p className="font-medium text-red-600">Error loading properties</p>
          <p className="text-sm text-red-500/80">{error}</p>
        </motion.div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayProperties.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => navigate(`/seller/properties/${property.id}`)}
              className="shadow-soft group cursor-pointer overflow-hidden rounded-2xl border border-white/50 bg-white transition-shadow hover:shadow-lg"
            >
              {/* Image Container */}
              <div className="bg-vista-bg relative h-40 overflow-hidden">
                <img
                  src={property.image || "/placeholder-property.jpg"}
                  alt={property.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
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
                        <span className="text-xs font-bold">
                          {property.views}
                        </span>
                      </div>
                      <span className="text-vista-text/60 text-xs">Views</span>
                    </div>
                    <div className="bg-vista-surface/30 rounded-lg p-2 text-center">
                      <div className="text-vista-primary flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs font-bold">
                          {property.inquiries}
                        </span>
                      </div>
                      <span className="text-vista-text/60 text-xs">
                        Inquiries
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/seller/properties/${property.id}`);
                      }}
                      className="text-vista-primary hover:bg-vista-surface/50 flex flex-1 items-center justify-center gap-1 rounded-lg py-2 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                    <button className="text-vista-text/60 flex flex-1 items-center justify-center gap-1 rounded-lg py-2 transition-colors hover:bg-red-500/10 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State (shown if no properties) */}
      {!loading && !error && displayProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-vista-surface/20 border-vista-surface/40 col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed py-12"
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
});

PropertiesGrid.displayName = "PropertiesGrid";

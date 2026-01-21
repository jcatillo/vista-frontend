import { motion } from "framer-motion";
import { Star, Globe, Phone, Mail } from "lucide-react";
import type { Property } from "../../../../data/properties";

interface PropertyDetailsDeveloperProps {
  property: Property;
}

export function PropertyDetailsDeveloper({
  property,
}: PropertyDetailsDeveloperProps) {
  const { developer } = property;

  if (!developer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <h2 className="text-vista-primary text-xl font-bold mb-6">Developer</h2>
      <div className="flex items-start gap-4">
        <img
          src={developer.image}
          alt={developer.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-vista-accent/20"
        />
        <div className="flex-1">
          <h3 className="text-vista-primary font-bold text-lg">
            {developer.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(developer.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-vista-text/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-vista-primary font-semibold text-sm">
              {developer.rating}
            </span>
            <span className="text-vista-text/60 text-xs">
              ({developer.reviews} reviews)
            </span>
          </div>

          {/* Bio */}
          <p className="text-vista-text/80 text-sm mt-3">{developer.bio}</p>

          {/* Experience & Contact */}
          <div className="mt-4 pt-4 border-t border-vista-surface space-y-2">
            <p className="text-vista-text/70 text-xs">
              <span className="font-semibold">In Business:</span>{" "}
              {developer.yearsInBusiness} years
            </p>
            <div className="flex gap-3">
              {developer.website && (
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-vista-accent/10 hover:bg-vista-accent/20 text-vista-accent px-3 py-2 rounded-lg transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">Website</span>
                </a>
              )}
              <a
                href={`tel:${developer.phone}`}
                className="flex items-center gap-1.5 bg-vista-primary hover:bg-vista-primary/90 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">Call</span>
              </a>
              <a
                href={`mailto:${developer.email}`}
                className="flex items-center gap-1.5 border border-vista-accent hover:bg-vista-accent/5 text-vista-primary px-3 py-2 rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-xs font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

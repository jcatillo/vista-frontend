import { motion } from "framer-motion";
import { Globe, Phone, Mail, Star } from "lucide-react";
import type { Property } from "../../../../types/property";

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
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <h2 className="text-vista-primary mb-6 text-xl font-bold">Developer</h2>
      <div className="flex items-start gap-4">
        <img
          src={"/placeholder-developer.jpg"}
          alt={developer.name}
          className="border-vista-accent/20 h-20 w-20 rounded-full border-2 object-cover"
        />
        <div className="flex-1">
          <h3 className="text-vista-primary text-lg font-bold">
            {developer.name}
          </h3>

          {/* Years in Business */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(4.5) // Default rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-vista-text/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-vista-primary text-sm font-semibold">
              4.5
            </span>
            <span className="text-vista-text/60 text-xs">(127 reviews)</span>
          </div>

          {/* Bio */}
          <p className="text-vista-text/80 mt-3 text-sm">{developer.bio}</p>

          {/* Experience & Contact */}
          <div className="border-vista-surface mt-4 space-y-2 border-t pt-4">
            <p className="text-vista-text/70 text-xs">
              <span className="font-semibold">In Business:</span>{" "}
              {developer.years} years
            </p>
            <div className="flex gap-3">
              {developer.website && (
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-vista-accent/10 hover:bg-vista-accent/20 text-vista-accent flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">Website</span>
                </a>
              )}
              <a
                href={`tel:${developer.phone}`}
                className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-2 text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">Call</span>
              </a>
              <a
                href={`mailto:${developer.email}`}
                className="border-vista-accent hover:bg-vista-accent/5 text-vista-primary flex items-center gap-1.5 rounded-lg border px-3 py-2 transition-colors"
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

import { motion } from "framer-motion";
import { Star, Phone, Mail } from "lucide-react";
import type { Property } from "../../../../types/property";

interface PropertyDetailsAgentProps {
  property: Property;
}

export function PropertyDetailsAgent({ property }: PropertyDetailsAgentProps) {
  const agent = {
    name: property.agentName || "Agent Name",
    title: "Real Estate Agent",
    rating: 5,
    reviews: 0,
    bio: property.agentBio || "Experienced real estate professional.",
    experience: property.agentExperience || 0,
    phone: property.agentPhone || "",
    email: property.agentEmail || "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <h2 className="text-vista-primary mb-6 text-xl font-bold">Agent</h2>
      <div className="flex items-start gap-4">
        <img
          src="https://via.placeholder.com/80x80?text=Agent"
          alt={agent.name}
          className="border-vista-accent/20 h-20 w-20 rounded-full border-2 object-cover"
        />
        <div className="flex-1">
          <h3 className="text-vista-primary text-lg font-bold">{agent.name}</h3>
          <p className="text-vista-text/70 text-sm">{agent.title}</p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(agent.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-vista-text/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-vista-primary text-sm font-semibold">
              {agent.rating}
            </span>
            <span className="text-vista-text/60 text-xs">
              ({agent.reviews} reviews)
            </span>
          </div>

          {/* Bio */}
          <p className="text-vista-text/80 mt-3 text-sm">{agent.bio}</p>

          {/* Experience & Contact */}
          <div className="border-vista-surface mt-4 space-y-2 border-t pt-4">
            <p className="text-vista-text/70 text-xs">
              <span className="font-semibold">Experience:</span>{" "}
              {agent.experience}
            </p>
            <div className="flex gap-3">
              <a
                href={`tel:${agent.phone}`}
                className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-2 text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">Call</span>
              </a>
              <a
                href={`mailto:${agent.email}`}
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

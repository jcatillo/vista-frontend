import { motion } from "framer-motion";
import { User, Phone, Mail } from "lucide-react";
import type { Property } from "../../../../types/property";

interface PropertyDetailsContactProps {
  property: Property;
}

export function PropertyDetailsContact({
  property,
}: PropertyDetailsContactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <h2 className="text-vista-primary mb-6 text-xl font-bold">
        Contact Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Agent / Owner Name</p>
            <p className="text-vista-primary font-semibold">
              {property.contactInfo.agentName}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Phone Number</p>
            <a
              href={`tel:${property.contactInfo.phone}`}
              className="text-vista-primary hover:text-vista-accent font-semibold transition-colors"
            >
              {property.contactInfo.phone}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Email</p>
            <a
              href={`mailto:${property.contactInfo.email}`}
              className="text-vista-primary hover:text-vista-accent font-semibold transition-colors"
            >
              {property.contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

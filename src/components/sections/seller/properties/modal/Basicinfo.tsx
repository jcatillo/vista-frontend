import { Home, MapPin } from "lucide-react";
import type { StepProps } from "./interface";
import { motion } from "framer-motion";

export function BasicInfo({ formData, onUpdate }: StepProps) {
  const propertyTypes = ["House", "Condo", "Apartment", "Lot", "Commercial"];
  const listingTypes = ["For Sale", "For Rent", "For Lease"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <Home className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Basic Information
        </h3>
      </div>

      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Property Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="e.g., Modern Beachfront Villa"
          className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => onUpdate("propertyType", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          >
            <option value="">Select type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Listing Type *
          </label>
          <select
            value={formData.listingType}
            onChange={(e) => onUpdate("listingType", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          >
            <option value="">Select type</option>
            {listingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Address *
        </label>
        <div className="relative">
          <MapPin className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onUpdate("address", e.target.value)}
            placeholder="Complete address with city and province"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Latitude
          </label>
          <input
            type="text"
            value={formData.latitude}
            onChange={(e) => onUpdate("latitude", e.target.value)}
            placeholder="e.g., 14.5995"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Longitude
          </label>
          <input
            type="text"
            value={formData.longitude}
            onChange={(e) => onUpdate("longitude", e.target.value)}
            placeholder="e.g., 120.9842"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>
    </motion.div>
  );
}

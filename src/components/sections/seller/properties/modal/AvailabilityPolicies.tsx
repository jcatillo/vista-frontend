import { motion } from "framer-motion";
import { Calendar, Clock, Heart, Ban } from "lucide-react";
import type { StepProps } from "./interface";

export function AvailabilityPolicies({ formData, onUpdate }: StepProps) {
  const petPolicies = [
    "Pets allowed",
    "No pets allowed",
    "Pets allowed with restrictions",
    "Pets allowed with deposit",
    "Service animals only",
  ];

  const smokingPolicies = [
    "No smoking allowed",
    "Smoking allowed outdoors only",
    "Smoking allowed in designated areas",
    "No restrictions",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Availability & Policies
        </h3>
      </div>

      {/* Availability Date */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Availability Date
        </label>
        <div className="relative">
          <Calendar className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="date"
            value={formData.availabilityDate}
            onChange={(e) => onUpdate("availabilityDate", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
        <p className="text-vista-text/60 mt-1 text-xs">
          When will this property be available for occupancy?
        </p>
      </div>

      {/* Minimum Lease Period (for rentals) */}
      {formData.listingType === "For Rent" && (
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Minimum Lease Period
          </label>
          <div className="relative">
            <Clock className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <select
              value={formData.minimumLeasePeriod}
              onChange={(e) => onUpdate("minimumLeasePeriod", e.target.value)}
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            >
              <option value="">Select minimum period</option>
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
          </div>
        </div>
      )}

      {/* Pet Policy */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Pet Policy
        </label>
        <div className="relative">
          <Heart className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <select
            value={formData.petPolicy}
            onChange={(e) => onUpdate("petPolicy", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          >
            <option value="">Select pet policy</option>
            {petPolicies.map((policy) => (
              <option key={policy} value={policy}>
                {policy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Smoking Policy */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Smoking Policy
        </label>
        <div className="relative">
          <Ban className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <select
            value={formData.smokingPolicy}
            onChange={(e) => onUpdate("smokingPolicy", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          >
            <option value="">Select smoking policy</option>
            {smokingPolicies.map((policy) => (
              <option key={policy} value={policy}>
                {policy}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-vista-surface/20 rounded-xl p-4">
        <h4 className="text-vista-primary mb-2 font-medium">
          Policy Guidelines
        </h4>
        <ul className="text-vista-text/70 space-y-1 text-sm">
          <li>
            • Clearly defined policies help attract the right tenants/buyers
          </li>
          <li>• Pet and smoking policies must comply with local regulations</li>
          <li>
            • Availability dates should be realistic and communicated clearly
          </li>
          <li>• Lease terms are binding agreements once signed</li>
        </ul>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Building, Phone, Mail, Globe, Award, FileText } from "lucide-react";
import type { StepProps } from "./interface";

export function DeveloperInformation({ formData, onUpdate }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <Building className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Developer Information
        </h3>
      </div>

      {/* Has Developer Toggle */}
      <div className="bg-vista-surface/20 rounded-xl p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={formData.hasDeveloper}
            onChange={(e) => onUpdate("hasDeveloper", e.target.checked)}
            className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
          />
          <span className="text-vista-text font-medium">
            This property has a developer/company
          </span>
        </label>
        <p className="text-vista-text/70 mt-2 text-sm">
          Check this if the property is managed or owned by a real estate
          developer or company.
        </p>
      </div>

      {formData.hasDeveloper && (
        <>
          {/* Developer Name */}
          <div>
            <label className="text-vista-text mb-2 block text-sm font-medium">
              Developer/Company Name *
            </label>
            <div className="relative">
              <Building className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <input
                type="text"
                value={formData.developerName}
                onChange={(e) => onUpdate("developerName", e.target.value)}
                placeholder="e.g., ABC Realty Corporation"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-vista-text mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
                <input
                  type="tel"
                  value={formData.developerPhone}
                  onChange={(e) => onUpdate("developerPhone", e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                  className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label className="text-vista-text mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
                <input
                  type="email"
                  value={formData.developerEmail}
                  onChange={(e) => onUpdate("developerEmail", e.target.value)}
                  placeholder="contact@developer.com"
                  className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="text-vista-text mb-2 block text-sm font-medium">
              Website
            </label>
            <div className="relative">
              <Globe className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <input
                type="url"
                value={formData.developerWebsite}
                onChange={(e) => onUpdate("developerWebsite", e.target.value)}
                placeholder="https://www.developer.com"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Years in Business */}
          <div>
            <label className="text-vista-text mb-2 block text-sm font-medium">
              Years in Business
            </label>
            <div className="relative">
              <Award className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <input
                type="number"
                value={formData.developerYears}
                onChange={(e) => onUpdate("developerYears", e.target.value)}
                placeholder="10"
                min="0"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Developer Bio */}
          <div>
            <label className="text-vista-text mb-2 block text-sm font-medium">
              Company Description
            </label>
            <div className="relative">
              <FileText className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <textarea
                value={formData.developerBio}
                onChange={(e) => onUpdate("developerBio", e.target.value)}
                placeholder="Brief description of the developer/company background, expertise, and notable projects..."
                rows={3}
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full resize-none rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          </div>
        </>
      )}

      {!formData.hasDeveloper && (
        <div className="bg-vista-surface/20 rounded-xl p-4 text-center">
          <Building className="text-vista-text/40 mx-auto mb-2 h-8 w-8" />
          <p className="text-vista-text/70 text-sm">
            No developer information will be included for this property listing.
          </p>
        </div>
      )}
    </motion.div>
  );
}

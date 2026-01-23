import { motion } from "framer-motion";
import {
  Building2,
  Bed,
  Bath,
  Maximize2,
  Car,
  Hash,
  Layers,
  Calendar,
  DollarSign,
} from "lucide-react";
import type { StepProps } from "./interface";

export function PropertyDetails({ formData, onUpdate }: StepProps) {
  const furnishingOptions = [
    "Fully furnished",
    "Semi-furnished",
    "Unfurnished",
  ];
  const conditionOptions = [
    "New",
    "Well-maintained",
    "Renovated",
    "Needs repair",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Property Details
        </h3>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Bedrooms *
          </label>
          <div className="relative">
            <Bed className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => onUpdate("bedrooms", e.target.value)}
              placeholder="0"
              min="0"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Bathrooms *
          </label>
          <div className="relative">
            <Bath className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => onUpdate("bathrooms", e.target.value)}
              placeholder="0"
              min="0"
              step="0.5"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>
      </div>

      {/* Floor Area & Lot Area */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Floor Area (sqm) *
          </label>
          <div className="relative">
            <Maximize2 className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="number"
              value={formData.floorArea}
              onChange={(e) => onUpdate("floorArea", e.target.value)}
              placeholder="0"
              min="0"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Lot Area (sqm)
          </label>
          <div className="relative">
            <Maximize2 className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="number"
              value={formData.lotArea}
              onChange={(e) => onUpdate("lotArea", e.target.value)}
              placeholder="0"
              min="0"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>
      </div>

      {/* Parking */}
      <div className="space-y-3">
        <label className="text-vista-text block text-sm font-medium">
          Parking
        </label>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={formData.parkingAvailable}
              onChange={(e) => onUpdate("parkingAvailable", e.target.checked)}
              className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
            />
            <span className="text-vista-text text-sm">Available</span>
          </label>
          {formData.parkingAvailable && (
            <div className="relative flex-1">
              <Car className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <input
                type="number"
                value={formData.parkingSlots}
                onChange={(e) => onUpdate("parkingSlots", e.target.value)}
                placeholder="Number of slots"
                min="1"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Floor Level & Storeys (for condos/apartments) */}
      {(formData.propertyType === "Condo" ||
        formData.propertyType === "Apartment") && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-vista-text mb-2 block text-sm font-medium">
              Floor Level
            </label>
            <div className="relative">
              <Hash className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <input
                type="text"
                value={formData.floorLevel}
                onChange={(e) => onUpdate("floorLevel", e.target.value)}
                placeholder="e.g., 15th Floor"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="text-vista-text mb-2 block text-sm font-medium">
              Total Floors
            </label>
            <div className="relative">
              <Layers className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
              <input
                type="number"
                value={formData.storeys}
                onChange={(e) => onUpdate("storeys", e.target.value)}
                placeholder="0"
                min="1"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Storeys for houses */}
      {formData.propertyType === "House" && (
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Number of Storeys
          </label>
          <div className="relative">
            <Layers className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="number"
              value={formData.storeys}
              onChange={(e) => onUpdate("storeys", e.target.value)}
              placeholder="0"
              min="1"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>
      )}

      {/* Furnishing & Condition */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Furnishing
          </label>
          <select
            value={formData.furnishing}
            onChange={(e) => onUpdate("furnishing", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          >
            <option value="">Select option</option>
            {furnishingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Condition
          </label>
          <select
            value={formData.condition}
            onChange={(e) => onUpdate("condition", e.target.value)}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          >
            <option value="">Select condition</option>
            {conditionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Year Built */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Year Built
        </label>
        <div className="relative">
          <Calendar className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="number"
            value={formData.yearBuilt}
            onChange={(e) => onUpdate("yearBuilt", e.target.value)}
            placeholder="2024"
            min="1900"
            max={new Date().getFullYear()}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Price *
        </label>
        <div className="relative">
          <DollarSign className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onUpdate("price", e.target.value)}
            placeholder="0"
            min="0"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="priceNegotiable"
            checked={formData.priceNegotiable}
            onChange={(e) => onUpdate("priceNegotiable", e.target.checked)}
            className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
          />
          <label htmlFor="priceNegotiable" className="text-vista-text text-sm">
            Price is negotiable
          </label>
        </div>
      </div>
    </motion.div>
  );
}

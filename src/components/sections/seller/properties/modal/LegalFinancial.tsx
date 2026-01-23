import { motion } from "framer-motion";
import { FileText, DollarSign, Receipt } from "lucide-react";
import type { StepProps } from "./interface";

export function LegalFinancial({ formData, onUpdate }: StepProps) {
  const ownershipStatuses = [
    "Free and Clear",
    "Mortgaged",
    "Under Foreclosure",
    "Bank Owned",
    "Government Owned",
    "Private Owned",
  ];

  const taxStatuses = [
    "Fully Paid",
    "Under Payment Plan",
    "Tax Lien",
    "Exempt",
    "Pending Assessment",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Legal & Financial Information
        </h3>
      </div>

      {/* Ownership Status */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Ownership Status
        </label>
        <select
          value={formData.ownershipStatus}
          onChange={(e) => onUpdate("ownershipStatus", e.target.value)}
          className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
        >
          <option value="">Select ownership status</option>
          {ownershipStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Tax Status */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Tax Status
        </label>
        <select
          value={formData.taxStatus}
          onChange={(e) => onUpdate("taxStatus", e.target.value)}
          className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
        >
          <option value="">Select tax status</option>
          {taxStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Association Dues */}
      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Association Dues (Monthly)
        </label>
        <div className="relative">
          <DollarSign className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="number"
            value={formData.associationDues}
            onChange={(e) => onUpdate("associationDues", e.target.value)}
            placeholder="0"
            min="0"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
        <p className="text-vista-text/60 mt-1 text-xs">
          Leave blank if not applicable (e.g., for houses without HOA)
        </p>
      </div>

      <div className="bg-vista-surface/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Receipt className="text-vista-accent mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <h4 className="text-vista-primary mb-2 font-medium">
              Important Legal Notes
            </h4>
            <ul className="text-vista-text/70 space-y-1 text-sm">
              <li>
                • All information provided must be accurate and verifiable
              </li>
              <li>
                • Property ownership documents may be requested for verification
              </li>
              <li>• Tax information should be current and up-to-date</li>
              <li>
                • Association dues information helps buyers understand ongoing
                costs
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

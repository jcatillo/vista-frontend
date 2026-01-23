import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";
import type { StepProps } from "./interface";

export function TermsAndPolicies({ formData, onArrayToggle }: StepProps) {
  const termsList = [
    "No smoking allowed",
    "Pets allowed with deposit",
    "Minimum 1 year lease",
    "Security deposit required",
    "Advance payment required",
    "Background check required",
    "Credit check required",
    "Co-signer required",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Shield className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Terms & Policies
        </h3>
      </div>

      <div className="bg-vista-surface/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-vista-accent mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <h4 className="text-vista-primary mb-2 font-medium">
              Property Terms
            </h4>
            <p className="text-vista-text/70 text-sm">
              Select all terms that apply to this property listing. These will
              be displayed to potential buyers/renters.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-vista-text mb-3 block text-sm font-medium">
          Property Terms & Conditions
        </label>
        <div className="grid grid-cols-1 gap-2">
          {termsList.map((term) => (
            <label
              key={term}
              className="hover:bg-vista-surface/20 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.terms.includes(term)}
                onChange={() => onArrayToggle("terms", term)}
                className="text-vista-accent border-vista-surface/30 focus:ring-vista-accent h-4 w-4 rounded"
              />
              <span className="text-vista-text text-sm">{term}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-vista-surface/20 rounded-xl p-4">
        <h4 className="text-vista-primary mb-2 font-medium">Important Notes</h4>
        <ul className="text-vista-text/70 space-y-1 text-sm">
          <li>
            • All selected terms will be visible to potential buyers/renters
          </li>
          <li>• Additional terms can be discussed during negotiations</li>
          <li>
            • Vista platform requires compliance with local real estate laws
          </li>
          <li>• Property listings are subject to platform verification</li>
        </ul>
      </div>
    </motion.div>
  );
}

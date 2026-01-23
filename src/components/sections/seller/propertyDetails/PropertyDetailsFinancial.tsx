import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types/property";
import { propertyDatabase } from "../../../../data/properties";

interface PropertyDetailsFinancialProps {
  property: Property;
  onUpdate?: (updated: Property) => void;
}

export function PropertyDetailsFinancial({
  property,
  onUpdate,
}: PropertyDetailsFinancialProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Property>(property);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    Object.assign(propertyDatabase[property.id], formData);
    onUpdate?.(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(property);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-vista-primary text-xl font-bold">
            Legal & Financial Information
          </h2>
        </div>
        <div className="mb-6 space-y-6">
          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Ownership Status
            </label>
            <select
              value={formData.ownershipStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownershipStatus: e.target.value,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            >
              <option>Owned</option>
              <option>Mortgaged</option>
              <option>Leased</option>
            </select>
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Tax Status
            </label>
            <input
              type="text"
              value={formData.taxStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  taxStatus: e.target.value,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>

          <div>
            <label className="text-vista-text/70 mb-2 block text-sm font-medium">
              Association Dues
            </label>
            <input
              type="number"
              value={formData.associationDues || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  associationDues: parseFloat(e.target.value) || null,
                }))
              }
              className="border-vista-surface/30 focus:border-vista-accent w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-vista-text/70 block text-sm font-medium">
                Payment Terms
              </label>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    terms: [...(prev.terms || []), ""],
                  }))
                }
                className="text-vista-accent hover:bg-vista-accent/10 rounded p-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.terms?.map((term: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const updated = [...(prev.terms || [])];
                        updated[idx] = e.target.value;
                        return { ...prev, terms: updated };
                      })
                    }
                    className="border-vista-surface/30 focus:border-vista-accent flex-1 rounded border px-3 py-2 text-sm transition-colors focus:outline-none"
                    placeholder="Payment term"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        terms: prev.terms?.filter((_, i) => i !== idx),
                      }))
                    }
                    className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="border-vista-surface/30 text-vista-text hover:bg-vista-surface/10 flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-vista-primary text-xl font-bold">
          Legal & Financial Information
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-vista-accent hover:bg-vista-accent/10 rounded-lg p-2 transition-colors"
          title="Edit this section"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <FileText className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Ownership Status</p>
            <p className="text-vista-primary font-semibold">
              {property.ownershipStatus}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FileText className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Tax Status</p>
            <p className="text-vista-primary font-semibold">
              {property.taxStatus}
            </p>
          </div>
        </div>
        {property.associationDues && (
          <div className="flex items-start gap-3">
            <CreditCard className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-vista-text/60 text-sm">Association Dues</p>
              <p className="text-vista-primary font-semibold">
                {property.associationDues}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <CreditCard className="text-vista-accent mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-vista-text/60 text-sm">Payment Terms</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {property.terms.map((term: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-vista-accent/10 text-vista-accent rounded-lg px-2 py-1 text-xs font-medium"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Share2, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import type { Property } from "../../../../types/property";
import { generatePropertyStats } from "../../../../utils/randomUtils";
import { deleteProperty } from "../../../../services/propertyService";

interface PropertyDetailsActionsProps {
  property: Property;
  onEditClick?: () => void;
  onDelete?: () => void;
}

/**
 * PropertyDetailsActions Component
 *
 * Displays action buttons and stats sidebar for property management.
 * Key features:
 * - Share Listing button (placeholder for future implementation)
 * - Delete Property with safety confirmation dialog
 * - Displays property metrics: Views, Inquiries, Listing Date (with seeded random values)
 *
 * Delete Flow:
 * 1. User clicks "Delete Property" button
 * 2. Confirmation dialog appears with warning message
 * 3. On confirm: Triggers onDelete callback for parent navigation
 */
export function PropertyDetailsActions({
  property,
  onDelete,
}: PropertyDetailsActionsProps) {
  // Track if delete confirmation dialog is visible
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Track async delete operation to disable button during deletion
  const [isDeleting, setIsDeleting] = useState(false);
  // Track successful deletion for success animation
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Generate random data only once using useMemo
  const randomData = useMemo(() => {
    return generatePropertyStats(property.propertyId);
  }, [property.propertyId]);

  /**
   * Handles confirmed property deletion
   * - Calls deleteProperty API to remove property from backend
   * - Shows success animation before triggering onDelete callback
   */
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteProperty(property.propertyId);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      // Navigate after showing success animation
      setTimeout(() => {
        onDelete?.();
      }, 2000);
    } catch (error) {
      console.error("Failed to delete property:", error);
      // TODO: Show error toast
      setIsDeleting(false);
    }
  };

  /**
   * Render confirmation dialog when delete is triggered
   * Shows warning message and action buttons
   */
  if (showDeleteConfirm) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="lg:col-span-1"
      >
        <div className="shadow-soft sticky top-24 space-y-4 rounded-2xl border border-white/50 bg-white p-6 md:p-8">
          <div className="mb-4 flex items-start gap-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-vista-primary text-lg font-bold">
                Delete Property?
              </h3>
              <p className="text-vista-text/70 mt-2 text-sm">
                Are you sure you want to delete this property listing? This
                action cannot be undone.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Yes, Delete Property"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="border-vista-surface/30 text-vista-text hover:bg-vista-surface/10 flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  /**
   * Render success animation when delete is completed
   * Shows checkmark and success message in center of screen before navigation
   */
  if (showDeleteSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="mx-4 w-full max-w-sm rounded-2xl border border-green-200 bg-white p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="mb-6 rounded-full bg-green-100 p-4"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-vista-primary mb-2 text-xl font-bold"
            >
              Property Deleted Successfully
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="text-vista-text/70 text-sm"
            >
              Redirecting you back to your properties...
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="shadow-soft sticky top-24 space-y-4 rounded-2xl border border-white/50 bg-white p-6 md:p-8">
        {/* Stats */}
        <div className="border-vista-surface space-y-3 border-b pb-4">
          <div className="flex items-center justify-between">
            <span className="text-vista-text/70 text-sm">Views</span>
            <span className="text-vista-primary font-bold">
              {randomData.views}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-vista-text/70 text-sm">Inquiries</span>
            <span className="text-vista-primary font-bold">
              {randomData.inquiries}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-vista-text/70 text-sm">Listed</span>
            <span className="text-vista-primary text-xs font-bold">
              {new Date(randomData.listingDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="border-vista-surface/30 hover:border-vista-accent hover:bg-vista-accent/5 text-vista-primary flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-medium transition-colors">
            <Share2 className="h-4 w-4" />
            Share Listing
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Property
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-vista-surface/20 rounded-xl p-4">
          <p className="text-vista-text/70 text-xs">
            Last updated: <strong>2 hours ago</strong>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

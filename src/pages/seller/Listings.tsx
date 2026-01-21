import { motion } from "framer-motion";
import { Plus, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SellerFooter } from "../../components/sections/seller";

export default function SellerListings() {
  const navigate = useNavigate();

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="text-vista-text/60 hover:text-vista-primary mb-4 flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-vista-primary text-2xl font-bold md:text-4xl">
                My Listings
              </h1>
              <p className="text-vista-text/70 mt-1 text-sm md:text-base">
                Manage all your property listings in one place
              </p>
            </div>
            <button className="bg-vista-primary hover:bg-vista-primary/90 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors md:px-6">
              <Plus className="h-4 w-4" />
              Add New
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <FilterButton label="All" active />
          <FilterButton label="Active" />
          <FilterButton label="Pending" />
          <FilterButton label="Draft" />
        </motion.div>

        {/* Empty State / Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="shadow-soft rounded-2xl border border-white/50 bg-white p-12 text-center"
        >
          <div className="bg-vista-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Upload className="text-vista-accent h-8 w-8" />
          </div>
          <h3 className="text-vista-primary mb-2 text-lg font-bold">
            Listings Management Coming Soon
          </h3>
          <p className="text-vista-text/60 mx-auto max-w-md text-sm">
            This section will allow you to view, edit, and manage all your
            property listings with advanced filtering and bulk actions.
          </p>
        </motion.div>
      </section>
      <SellerFooter />
    </>
  );
}

function FilterButton({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-vista-primary text-white"
          : "bg-vista-surface text-vista-text hover:bg-vista-accent/10"
      }`}
    >
      {label}
    </button>
  );
}

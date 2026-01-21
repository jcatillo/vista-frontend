import { motion } from "framer-motion";
import { BarChart3, ArrowLeft, Calendar, TrendingUp, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SellerFooter } from "../../components/sections/seller";

export default function SellerAnalytics() {
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
            <div className="flex items-center gap-3">
              <div className="bg-vista-primary flex h-12 w-12 items-center justify-center rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-vista-primary text-2xl font-bold md:text-4xl">
                  Analytics
                </h1>
                <p className="text-vista-text/70 text-sm md:text-base">
                  Track your property performance and engagement
                </p>
              </div>
            </div>
            <div className="bg-vista-surface flex items-center gap-2 rounded-lg px-4 py-2">
              <Calendar className="text-vista-accent h-4 w-4" />
              <span className="text-vista-text text-sm font-medium">
                Last 30 Days
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <StatCard
            label="Total Views"
            value="12,847"
            change="+18%"
            icon={Eye}
          />
          <StatCard
            label="Unique Visitors"
            value="3,241"
            change="+12%"
            icon={Users}
          />
          <StatCard
            label="Inquiries"
            value="156"
            change="+24%"
            icon={TrendingUp}
          />
          <StatCard
            label="Avg. Time on Page"
            value="2m 34s"
            change="+8%"
            icon={Calendar}
          />
        </motion.div>

        {/* Placeholder for detailed analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="shadow-soft rounded-2xl border border-white/50 bg-white p-8 text-center md:p-12"
        >
          <div className="bg-vista-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <BarChart3 className="text-vista-accent h-8 w-8" />
          </div>
          <h3 className="text-vista-primary mb-2 text-lg font-bold">
            Detailed Analytics Coming Soon
          </h3>
          <p className="text-vista-text/60 mx-auto max-w-md text-sm">
            This section will include detailed charts, property-level analytics,
            visitor demographics, and conversion tracking.
          </p>
        </motion.div>
      </section>
      <SellerFooter />
    </>
  );
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="shadow-soft rounded-2xl border border-white/50 bg-white p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="bg-vista-accent/10 flex h-10 w-10 items-center justify-center rounded-xl">
          <Icon className="text-vista-accent h-5 w-5" />
        </div>
      </div>
      <div className="text-vista-primary text-xl font-bold md:text-2xl">
        {value}
      </div>
      <div className="text-vista-text/60 text-xs md:text-sm">{label}</div>
      <div className="text-vista-accent mt-1 text-xs font-medium">{change}</div>
    </div>
  );
}

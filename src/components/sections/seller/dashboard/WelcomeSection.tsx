import { motion } from "framer-motion";
import { Building2, Eye, Layers, TrendingUp } from "lucide-react";

const quickStats = [
  {
    label: "Total Properties",
    value: "12",
    icon: Building2,
    change: "+2 this month",
  },
  {
    label: "Total Views",
    value: "1,847",
    icon: Eye,
    change: "+15% vs last week",
  },
  {
    label: "AI Staging Used",
    value: "8",
    icon: Layers,
    change: "67% of properties",
  },
  {
    label: "Inquiries",
    value: "34",
    icon: TrendingUp,
    change: "+8 new today",
  },
];

export function WelcomeSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-vista-primary mb-2 text-2xl font-bold md:text-4xl">
          Welcome back, Johnson Smith
        </h1>
        <p className="text-vista-text/70 text-sm md:text-base">
          Manage your properties and leverage AI-powered tools to attract more
          buyers.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
      >
        {quickStats.map((stat, idx) => (
          <div
            key={idx}
            className="shadow-soft rounded-2xl border border-white/50 bg-white p-4 md:p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="bg-vista-accent/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <stat.icon className="text-vista-accent h-5 w-5" />
              </div>
            </div>
            <div className="text-vista-primary text-xl font-bold md:text-2xl">
              {stat.value}
            </div>
            <div className="text-vista-text/60 text-xs md:text-sm">
              {stat.label}
            </div>
            <div className="text-vista-accent mt-1 text-xs font-medium">
              {stat.change}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

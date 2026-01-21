import { motion } from "framer-motion";
import { TrendingUp, Home, Eye, MessageSquare } from "lucide-react";

const propertyStats = [
  {
    label: "Total Properties",
    value: "6",
    icon: Home,
    change: "+2 this month",
    color: "text-vista-primary",
  },
  {
    label: "Total Views",
    value: "5,633",
    icon: Eye,
    change: "+28% vs last month",
    color: "text-vista-accent",
  },
  {
    label: "Active Properties",
    value: "4",
    icon: TrendingUp,
    change: "67% published",
    color: "text-green-600",
  },
  {
    label: "Total Inquiries",
    value: "117",
    icon: MessageSquare,
    change: "+15 new today",
    color: "text-amber-600",
  },
];

export function PropertiesStats() {
  return (
    <section className="bg-vista-surface/10 border-vista-surface/20 border-y">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-vista-primary text-lg font-bold md:text-xl">
            Properties Overview
          </h2>
          <p className="text-vista-text/60 text-xs md:text-sm">
            Quick stats about your property portfolio
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {propertyStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="shadow-soft rounded-xl border border-white/50 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-vista-text/60 text-xs font-medium">
                    {stat.label}
                  </span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="mb-2">
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <p className="text-vista-text/50 text-xs">{stat.change}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

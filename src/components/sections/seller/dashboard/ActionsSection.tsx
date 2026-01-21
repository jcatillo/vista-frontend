import React from "react";
import { motion } from "framer-motion";
import { Plus, Layers, Upload } from "lucide-react";

const actions = [
  {
    title: "Add New Property",
    description: "Upload property details and photos to create a new listing",
    icon: <Plus className="h-6 w-6" />,
    accentColor: "bg-vista-primary",
  },
  {
    title: "AI Virtual Staging",
    description: "Transform empty rooms with AI-generated furniture and decor",
    icon: <Layers className="h-6 w-6" />,
    accentColor: "bg-vista-accent",
  },
  {
    title: "Upload Assets",
    description: "Add 360° images, floor plans, and property documents",
    icon: <Upload className="h-6 w-6" />,
    accentColor: "bg-vista-primary",
  },
];

export function ActionsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h2 className="text-vista-primary text-xl font-bold md:text-2xl">
          Quick Actions
        </h2>
        <p className="text-vista-text/60 text-sm">
          Manage your properties and leverage AI tools
        </p>
      </motion.div>

      {/* Action Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
      >
        {actions.map((action, idx) => (
          <ActionCard
            key={idx}
            title={action.title}
            description={action.description}
            icon={action.icon}
            accentColor={action.accentColor}
            delay={idx * 0.1}
          />
        ))}
      </motion.div>
    </section>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  delay: number;
}

function ActionCard({
  title,
  description,
  icon,
  accentColor,
  delay,
}: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <div className="shadow-soft h-full rounded-2xl border border-white/50 bg-white p-5 transition-shadow duration-300 hover:shadow-xl md:p-6">
        <div
          className={`${accentColor} mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
        <h3 className="text-vista-primary mb-2 text-lg font-bold">{title}</h3>
        <p className="text-vista-text/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

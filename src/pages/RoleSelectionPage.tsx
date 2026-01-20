import React from "react";
import { motion } from "framer-motion";
import { Building2, Search, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const handleNavigation = (role: "buyer" | "seller") => navigate(`/${role}`);

  return (
    <section className="bg-vista-bg relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 md:px-6">
      {/* Decorative Background Elements (Optional, based on your Hero style) */}
      <div className="bg-vista-accent/5 absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      <div className="bg-vista-primary/5 absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />

      <div className="z-10 w-full max-w-5xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="border-vista-accent/20 mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border bg-white/50 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="text-vista-accent h-4 w-4" />
            <span className="text-vista-primary text-xs font-semibold tracking-wider uppercase">
              Interactive Demo Mode
            </span>
          </div>

          <h1 className="text-vista-primary mb-4 text-3xl font-bold md:text-5xl lg:text-6xl">
            Choose Your Perspective
          </h1>
          <p className="text-vista-text/80 mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
            Welcome to the Vista experience. To streamline this demonstration,
            we've bypassed standard authentication. Select a role below to
            explore the platform's tailored features.
          </p>
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* BUYER CARD */}
          <RoleCard
            role="buyer"
            title="Property Buyer"
            subtitle="I am looking for a home"
            description="Experience AI-driven property search, VR tours (Echo), and instant answers via Mark AI."
            icon={<Search className="h-8 w-8 text-white" />}
            delay={0.2}
            onClick={() => handleNavigation("buyer")}
          />

          {/* SELLER CARD */}
          <RoleCard
            role="seller"
            title="Property Seller"
            subtitle="Brokers & Owners"
            description="Access dashboard, upload property assets, and configure AI virtual staging."
            icon={<Building2 className="h-8 w-8 text-white" />}
            delay={0.3}
            onClick={() => handleNavigation("seller")}
          />
        </div>

        {/* Footer / Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center md:mt-16"
        >
          <p className="text-sm text-gray-400">
            Current Session:{" "}
            <span className="text-vista-accent font-mono">
              Guest_Preview_v1.0
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// --- Sub-Component for the Cards ---

interface RoleCardProps {
  role: "buyer" | "seller";
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  onClick: () => void;
}

function RoleCard({
  title,
  subtitle,
  description,
  icon,
  delay,
  onClick,
}: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="shadow-soft border-vista-surface/50 h-full rounded-3xl border bg-white p-6 transition-shadow duration-300 hover:shadow-2xl md:p-10">
        {/* Icon Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="bg-vista-primary shadow-vista-primary/20 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <div className="rounded-full bg-gray-50 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ArrowRight className="text-vista-primary h-6 w-6 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <div className="text-vista-accent text-sm font-bold tracking-wide uppercase">
            {subtitle}
          </div>
          <h3 className="text-vista-primary text-2xl font-bold md:text-3xl">
            {title}
          </h3>
          <p className="text-vista-text/70 text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Visual Decoration (Hover Effect) */}
        <div className="bg-vista-accent/5 absolute inset-0 -z-10 scale-95 rounded-3xl opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}

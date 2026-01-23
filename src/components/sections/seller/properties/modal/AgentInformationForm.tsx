import { motion } from "framer-motion";
import { User, Phone, Mail, Award, FileText } from "lucide-react";
import type { StepProps } from "./interface";

export function AgentInformationForm({ formData, onUpdate }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <User className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Agent Information
        </h3>
      </div>

      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Agent Name *
        </label>
        <div className="relative">
          <User className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="text"
            value={formData.agentName}
            onChange={(e) => onUpdate("agentName", e.target.value)}
            placeholder="Full name"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="tel"
              value={formData.agentPhone}
              onChange={(e) => onUpdate("agentPhone", e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
            <input
              type="email"
              value={formData.agentEmail}
              onChange={(e) => onUpdate("agentEmail", e.target.value)}
              placeholder="agent@example.com"
              className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Years of Experience
        </label>
        <div className="relative">
          <Award className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <input
            type="number"
            value={formData.agentExperience}
            onChange={(e) => onUpdate("agentExperience", e.target.value)}
            placeholder="5"
            min="0"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label className="text-vista-text mb-2 block text-sm font-medium">
          Agent Bio
        </label>
        <div className="relative">
          <FileText className="text-vista-text/40 absolute top-3 left-3 h-5 w-5" />
          <textarea
            value={formData.agentBio}
            onChange={(e) => onUpdate("agentBio", e.target.value)}
            placeholder="Brief description about the agent's background and expertise..."
            rows={3}
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full resize-none rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>
    </motion.div>
  );
}

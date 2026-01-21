import { motion } from "framer-motion";
import { Image, Layers, Home } from "lucide-react";

export function AIPromoSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-vista-primary relative overflow-hidden rounded-3xl p-6 md:p-10">
          {/* Background Decoration */}
          <div className="bg-vista-accent/20 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="bg-vista-accent/10 absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4 flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <Image className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                  AI-Powered Feature
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-3 text-2xl font-bold text-white md:text-3xl"
              >
                Stage Your Properties with AI
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-6 leading-relaxed text-white/80"
              >
                Transform empty rooms into beautifully furnished spaces.
                Increase buyer interest with professional-looking staged
                photos—no physical furniture required.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-vista-accent hover:bg-vista-accent/90 flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition-colors"
              >
                <Layers className="h-5 w-5" />
                Try AI Staging Now
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="shadow-glass aspect-video overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600"
                  alt="AI Staging Preview"
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="rounded-full bg-white/20 p-4 backdrop-blur-sm"
                  >
                    <Home className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -left-4 bottom-4 rounded-lg bg-white px-3 py-2 shadow-lg md:-left-8"
              >
                <div className="text-vista-primary text-xs font-bold">
                  Before
                </div>
                <div className="text-vista-text/60 text-xs">Empty Room</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -right-4 top-4 rounded-lg bg-white px-3 py-2 shadow-lg md:-right-8"
              >
                <div className="text-vista-accent text-xs font-bold">After</div>
                <div className="text-vista-text/60 text-xs">AI Staged</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

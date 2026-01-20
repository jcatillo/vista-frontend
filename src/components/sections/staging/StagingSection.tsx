import { motion } from "framer-motion";
import { Layers } from "lucide-react";

export function StagingSection() {
  return (
    <section
      id="staging"
      className="bg-vista-bg relative flex min-h-screen snap-start items-center justify-center px-4 py-20 md:h-screen md:px-6"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative order-2 md:order-1"
        >
          <div className="shadow-soft group relative aspect-video overflow-hidden rounded-2xl bg-white">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"
              alt="Modern Interior"
              className="h-full w-full object-cover"
            />
            <div className="from-vista-primary/20 absolute inset-0 bg-linear-to-r to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 50,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.6,
          }}
          className="order-1 md:order-2"
        >
          <div className="bg-vista-accent/10 text-vista-accent mb-4 flex h-10 w-10 items-center justify-center rounded-xl md:mb-6 md:h-12 md:w-12">
            <Layers className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h2 className="text-vista-primary mb-3 text-3xl font-bold md:mb-4 md:text-4xl lg:text-5xl">
            Redesign Reality Instantly
          </h2>
          <p className="text-vista-text/70 text-base leading-relaxed md:text-lg">
            Transform a property's interior with AI. Modify furniture, lighting,
            and mood without physical renovations. Visualize changes directly on
            360° panoramic images.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

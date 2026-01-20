import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <>
      <motion.div
        className="bg-vista-surface pointer-events-none fixed top-20 left-10 -z-10 h-48 w-48 rounded-full opacity-60 blur-3xl md:h-96 md:w-96"
        animate={{
          x: [0, 50, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="bg-vista-accent/10 pointer-events-none fixed right-5 bottom-40 -z-10 h-64 w-64 rounded-full opacity-50 blur-3xl md:right-10 md:h-125 md:w-125"
        animate={{
          x: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </>
  );
}

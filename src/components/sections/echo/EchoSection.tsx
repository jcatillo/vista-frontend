import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const voiceCommands = [
  "Change the sofa to a modern style",
  "Make the room feel warmer",
  "Add minimalist paintings",
];

export function EchoSection() {
  return (
    <section
      id="echo"
      className="bg-vista-bg relative flex min-h-screen snap-start items-center justify-center px-4 py-20 md:h-screen md:px-6"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{
            opacity: 0,
            x: -50,
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
        >
          <div className="bg-vista-accent/10 text-vista-accent mb-4 flex h-10 w-10 items-center justify-center rounded-xl md:mb-6 md:h-12 md:w-12">
            <Mic className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h2 className="text-vista-primary mb-3 text-3xl font-bold md:mb-4 md:text-4xl lg:text-5xl">
            Echo — Your Voice-Driven Design Partner
          </h2>
          <p className="text-vista-text/70 text-base leading-relaxed md:text-lg">
            While exploring a property in VR, simply speak your ideas. Echo
            interprets voice commands and updates the space in real-time,
            creating a hands-free, immersive experience.
          </p>
        </motion.div>

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
          className="relative flex min-h-100 items-center justify-center"
        >
          <div className="bg-vista-primary relative flex h-48 w-48 items-center justify-center rounded-full shadow-2xl md:h-64 md:w-64">
            <Mic className="h-16 w-16 text-white md:h-24 md:w-24" />

            {/* Audio Wave Rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="border-vista-accent absolute inset-0 rounded-full border-2"
                animate={{
                  scale: [1, 1.5],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                }}
              />
            ))}
          </div>

          {/* Speech Bubbles */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            {voiceCommands.map((command, idx) => (
              <motion.div
                key={idx}
                className="border-vista-accent/20 absolute max-w-35 rounded-2xl border bg-white/90 px-2.5 py-2 shadow-lg backdrop-blur-sm sm:max-w-40 sm:px-3 md:max-w-50 md:px-4 md:py-3"
                style={{
                  top: idx === 0 ? "10%" : idx === 1 ? "50%" : "80%",
                  left: idx === 0 ? "0%" : idx === 1 ? "auto" : "5%",
                  right: idx === 1 ? "0%" : "auto",
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.8 + idx * 0.3,
                  duration: 0.5,
                }}
              >
                <p className="text-vista-text text-xs leading-snug font-medium md:text-sm">
                  "{command}"
                </p>
                <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-transparent border-t-white/90" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

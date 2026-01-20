import { motion } from "framer-motion";
import { useBeforeAfterSlider } from "../../../hooks/useBeforeAfterSlider";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const {
    sliderContainerRef,
    sliderPosition,
    isDragging,
    containerWidth,
    handlers,
  } = useBeforeAfterSlider(50);

  return (
    <div className="relative h-87.5 w-full overflow-hidden rounded-3xl shadow-2xl sm:h-100 md:h-125">
      {/* Before/After Container */}
      <div
        ref={sliderContainerRef}
        className="group relative h-full w-full select-none"
        {...handlers}
      >
        {/* After Image (Furnished - Full Width Background) */}
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-gray-100">
          <img
            src={afterImage}
            alt="Room After - Furnished"
            className="pointer-events-none h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {/* Before Image (Empty - Clipped Overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{
            width: `${sliderPosition}%`,
            transition: isDragging ? "none" : "width 0.1s ease-out",
          }}
        >
          <img
            src={beforeImage}
            alt="Room Before - Empty"
            className="pointer-events-none h-full object-cover"
            style={{
              width: containerWidth ? `${containerWidth}px` : "100vw",
              maxWidth: "none",
            }}
            draggable={false}
          />
        </div>

        {/* Slider Line */}
        <div
          className="bg-vista-accent absolute top-0 bottom-0 z-10 w-1 cursor-col-resize shadow-lg"
          style={{
            left: `${sliderPosition}%`,
            transition: isDragging ? "none" : "left 0.1s ease-out",
          }}
        />

        {/* Slider Handle */}
        <div
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-col-resize"
          style={{
            left: `${sliderPosition}%`,
            transition: isDragging ? "none" : "left 0.1s ease-out",
          }}
        >
          <div className="bg-vista-accent flex h-10 w-10 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110 md:h-12 md:w-12">
            <svg
              className="h-5 w-5 text-white md:h-6 md:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19l7-7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <motion.div
          className="absolute top-4 left-4 z-20 rounded-lg bg-black/60 px-3 py-1 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs font-bold text-white md:text-sm">
            {beforeLabel}
          </span>
        </motion.div>

        <motion.div
          className="bg-vista-accent/90 absolute top-4 right-4 z-20 rounded-lg px-3 py-1 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-xs font-bold text-white md:text-sm">
            {afterLabel}
          </span>
        </motion.div>

        {/* Drag hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-xs font-medium text-white">
            ← Drag to compare →
          </span>
        </motion.div>
      </div>
    </div>
  );
}

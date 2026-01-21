import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property } from "../../../../data/properties";

const scrollbarStyles = `
  .image-modal-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .image-modal-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .image-modal-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 3px;
  }
  
  .image-modal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

interface PropertyDetailsImageModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

export function PropertyDetailsImageModal({
  property,
  isOpen,
  onClose,
  initialImageIndex = 0,
}: PropertyDetailsImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(initialImageIndex);
      
      // Inject scrollbar styles
      const styleEl = document.createElement("style");
      styleEl.innerHTML = scrollbarStyles;
      styleEl.id = "image-modal-scrollbar-styles";
      document.head.appendChild(styleEl);
    } else {
      document.body.style.overflow = "unset";
      
      // Remove scrollbar styles when modal closes
      const styleEl = document.getElementById("image-modal-scrollbar-styles");
      if (styleEl) {
        styleEl.remove();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialImageIndex]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 z-40"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Main Image */}
              <img
                src={images[currentImageIndex]}
                alt={`${property.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-lg px-4 py-2 text-white text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto image-modal-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-vista-accent scale-110"
                          : "border-white/30 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

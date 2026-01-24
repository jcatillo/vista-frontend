import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, PropertyImage } from "../../../../types/property";

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
  images?: PropertyImage[];
}

export function PropertyDetailsImageModal({
  property,
  isOpen,
  onClose,
  initialImageIndex = 0,
  images: propImages,
}: PropertyDetailsImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const images =
    propImages ||
    (property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : []);

  // Get current image to check its type
  const currentImage = images[currentImageIndex];
  const isPanoramic = currentImage?.imageType === "panoramic";

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
            className="fixed inset-0 z-40 bg-black/95"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image Label - Upper Right Corner */}
              <div className="absolute top-4 right-16 z-10">
                <div className="rounded-lg bg-black/70 px-6 py-3 backdrop-blur-sm">
                  <p className="text-xl font-bold text-white">
                    {images[currentImageIndex]?.label ||
                      (isPanoramic ? "Panoramic View" : "Regular Image")}
                  </p>
                </div>
              </div>

              {/* Main Image */}
              <img
                src={images[currentImageIndex]?.url}
                alt={`${property.name} - Image ${currentImageIndex + 1}`}
                className={`h-full w-full ${isPanoramic ? "object-cover" : "object-contain"}`}
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 text-sm font-medium text-white">
                  <div className="flex items-center gap-2">
                    <span>
                      {currentImageIndex + 1} / {images.length}
                    </span>
                    {images[currentImageIndex]?.label && (
                      <span className="text-vista-accent">
                        • {images[currentImageIndex].label}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="image-modal-scrollbar absolute -bottom-20 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-vista-accent scale-110"
                          : "border-white/30 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
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

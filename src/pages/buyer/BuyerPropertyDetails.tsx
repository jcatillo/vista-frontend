import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  BedDouble,
  Bath,
  Home,
  Car,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  School,
  ShoppingBag,
  Star,
  Check,
  Sparkles,
} from "lucide-react";
import type {
  PropertyDetailsPayload,
  PropertyImagePayload,
} from "../../features/buyer/types/property.types";
import { getPropertyDetails } from "../../services/propertyService";
// Image Gallery Modal
function ImageGalleryModal({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: PropertyImagePayload[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
      if (e.key === "ArrowRight")
        onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    };

    console.log(images[currentIndex]?.label);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:rotate-90 hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
        }}
        className="absolute left-6 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:scale-110 hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Image Label - Upper Right Corner */}
      {images[currentIndex]?.label && (
        <div className="absolute top-6 right-20 z-10">
          <div className="rounded-lg bg-black/70 px-6 py-3 backdrop-blur-sm">
            <p className="text-xl font-bold text-white">
              {images[currentIndex].label}
            </p>
          </div>
        </div>
      )}

      <motion.img
        key={currentIndex}
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        src={images[currentIndex]?.url}
        alt={`Property image ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
        }}
        className="absolute right-6 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:scale-110 hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span>
            {currentIndex + 1} / {images.length}
          </span>
          {images[currentIndex]?.label && (
            <span className="text-vista-accent">
              • {images[currentIndex].label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
// Modern Image Gallery
function PropertyImageGallery({
  property,
  onImageExpanded,
}: {
  property: PropertyDetailsPayload;
  onImageExpanded: (expanded: boolean, imageIndex: number) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const allImages: PropertyImagePayload[] = property.images;
  const images = allImages.filter((img) => img.imageType === "regular");
  const panoramicImages = allImages.filter(
    (img) => img.imageType === "panoramic"
  );
  const navigate = useNavigate();
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  if (images.length === 0) {
    return (
      <div className="bg-vista-bg flex aspect-video items-center justify-center rounded-2xl">
        <p className="text-vista-text/40">No images available</p>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Main Image */}
      <div className="bg-vista-bg relative h-[600px] w-full overflow-hidden">
        <motion.img
          key={currentImageIndex}
          initial={{
            opacity: 0,
            scale: 1.02,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.4,
          }}
          src={images[currentImageIndex]?.url}
          alt={property.name}
          className="h-full w-full object-cover"
        />

        {/* Subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10" />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
            >
              <ChevronLeft className="text-vista-primary h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
            >
              <ChevronRight className="text-vista-primary h-5 w-5" />
            </button>
          </>
        )}

        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setIsLiked(!isLiked)}
            className={`rounded-full p-2.5 shadow-lg backdrop-blur-md transition-all ${isLiked ? "bg-red-500 text-white" : "text-vista-text bg-white/90 hover:bg-white"}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            className="text-vista-text rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur-md transition-all hover:bg-white"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
          <div className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {currentImageIndex + 1} / {images.length}
          </div>
          <button
            onClick={() => onImageExpanded(true, currentImageIndex)}
            className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/60"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Panoramic Thumbnails + VR Button */}
      {panoramicImages.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-vista-primary text-sm font-medium">
              Panoramic Views
            </h3>
            <button
              onClick={() =>
                navigate(`/vr-viewer/${property.propertyId}`, {
                  state: { property, startIndex: 0 },
                })
              }
              className="text-vista-accent hover:text-vista-primary text-sm"
            >
              Open VR
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {panoramicImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() =>
                  navigate(`/vr-viewer/${property.propertyId}`, {
                    state: { property, startIndex: idx },
                  })
                }
                className="group hover:border-vista-accent relative shrink-0 overflow-hidden rounded-lg border-2 border-white/20 transition-all"
              >
                <div className="h-40 w-40 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.id || `Panorama ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-1 transition-colors group-hover:bg-black/40">
                  <p className="px-1 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {img.label || img.id || `View ${idx + 1}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default function BuyerPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetailsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getPropertyDetails(id);
        setProperty(response.property);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load property"
        );
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const allImages: PropertyImagePayload[] = property?.images || [];
  if (loading) {
    return (
      <div className="bg-vista-bg flex min-h-screen items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="border-vista-accent h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"></div>
          </div>
          <p className="text-vista-text/50 text-sm">Loading property...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-vista-bg flex min-h-screen items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >
          <h1 className="text-vista-primary mb-2 text-2xl font-semibold">
            Error Loading Property
          </h1>
          <p className="text-vista-text/50 mb-6 text-sm">{error}</p>
          <button
            onClick={() => navigate("/buyer/marketplace")}
            className="text-vista-accent hover:text-vista-primary text-sm font-medium transition-colors"
          >
            ← Back to Marketplace
          </button>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-vista-bg flex min-h-screen items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >
          <h1 className="text-vista-primary mb-2 text-2xl font-semibold">
            Property Not Found
          </h1>
          <p className="text-vista-text/50 mb-6 text-sm">
            This property doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/buyer/marketplace")}
            className="text-vista-accent hover:text-vista-primary text-sm font-medium transition-colors"
          >
            ← Back to Marketplace
          </button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="bg-vista-bg min-h-screen">
      <AnimatePresence>
        {isImageExpanded && (
          <ImageGalleryModal
            images={allImages}
            currentIndex={expandedImageIndex}
            onClose={() => setIsImageExpanded(false)}
            onNavigate={setExpandedImageIndex}
          />
        )}
      </AnimatePresence>

      {/* Minimal Header */}
      <div className="bg-vista-bg/80 sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <button
            onClick={() => navigate("/buyer/marketplace")}
            className="text-vista-text/50 hover:text-vista-primary group flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-10 lg:col-span-7">
            {/* Property Header */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-vista-accent rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                  {property.listingType}
                </span>
                <span className="text-vista-text/40 text-xs">•</span>
                <span className="text-vista-text/60 text-sm">
                  {property.propertyType}
                </span>
              </div>

              <h1 className="text-vista-primary text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                {property.name}
              </h1>

              <div className="text-vista-text/60 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <p className="text-sm">{property.address}</p>
              </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
            >
              <PropertyImageGallery
                property={property}
                onImageExpanded={(expanded, imageIndex) => {
                  setIsImageExpanded(expanded);
                  setExpandedImageIndex(imageIndex);
                }}
              />
            </motion.div>

            {/* Quick Stats - Horizontal Bar */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.15,
              }}
              className="border-vista-text/10 flex items-center justify-between border-y py-6"
            >
              {[
                {
                  icon: BedDouble,
                  value: property.bedrooms,
                  label: "Beds",
                },
                {
                  icon: Bath,
                  value: property.bathrooms,
                  label: "Baths",
                },
                {
                  icon: Home,
                  value: `${property.floorArea}m²`,
                  label: "Area",
                },
                {
                  icon: Car,
                  value: property.parkingSlots || 0,
                  label: "Parking",
                },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <stat.icon className="text-vista-accent h-5 w-5" />
                  <div>
                    <p className="text-vista-primary text-lg font-semibold">
                      {stat.value}
                    </p>
                    <p className="text-vista-text/50 text-xs">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* About */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="space-y-4"
            >
              <h2 className="text-vista-primary text-xl font-semibold">
                About
              </h2>
              <p className="text-vista-text/70 text-[15px] leading-relaxed">
                {property.description ||
                  "No description available for this property."}
              </p>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
              className="space-y-5"
            >
              <h2 className="text-vista-primary text-xl font-semibold">
                Details
              </h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {[
                  {
                    label: "Property Type",
                    value: property.propertyType,
                  },
                  {
                    label: "Furnishing",
                    value: property.furnishing || "Unfurnished",
                  },
                  {
                    label: "Condition",
                    value: property.condition || "N/A",
                  },
                  {
                    label: "Lot Area",
                    value: property.lotArea ? `${property.lotArea}m²` : "N/A",
                  },
                  {
                    label: "Year Built",
                    value: property.yearBuilt || "N/A",
                  },
                  {
                    label: "Storeys",
                    value: property.storeys || "N/A",
                  },
                ].map((detail, idx) => (
                  <div
                    key={idx}
                    className="border-vista-text/5 flex items-center justify-between border-b py-2"
                  >
                    <span className="text-vista-text/50 text-sm">
                      {detail.label}
                    </span>
                    <span className="text-vista-primary text-sm font-medium">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features & Amenities */}
            {((property.amenities && property.amenities.length > 0) ||
              (property.buildingAmenities &&
                property.buildingAmenities.length > 0) ||
              (property.interiorFeatures &&
                property.interiorFeatures.length > 0)) && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
                className="space-y-6"
              >
                <h2 className="text-vista-primary text-xl font-semibold">
                  Features & Amenities
                </h2>

                {property.interiorFeatures &&
                  property.interiorFeatures.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-vista-text/60 text-xs font-medium tracking-wider uppercase">
                        Interior
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {property.interiorFeatures.map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-vista-accent/5 text-vista-text/80 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
                          >
                            <Check className="text-vista-accent h-3.5 w-3.5" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {property.buildingAmenities &&
                  property.buildingAmenities.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-vista-text/60 text-xs font-medium tracking-wider uppercase">
                        Building
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {property.buildingAmenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-vista-accent/5 text-vista-text/80 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
                          >
                            <Check className="text-vista-accent h-3.5 w-3.5" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}

            {/* Nearby */}
            {((property.nearbySchools && property.nearbySchools.length > 0) ||
              (property.nearbyMalls && property.nearbyMalls.length > 0) ||
              (property.nearbyHospitals &&
                property.nearbyHospitals.length > 0)) && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                className="space-y-6"
              >
                <h2 className="text-vista-primary text-xl font-semibold">
                  Nearby
                </h2>
                <div className="grid gap-8 md:grid-cols-2">
                  {property.nearbySchools &&
                    property.nearbySchools.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <School className="text-vista-accent h-4 w-4" />
                          <h3 className="text-vista-primary text-sm font-medium">
                            Schools
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {property.nearbySchools.map((place, idx) => (
                            <div
                              key={idx}
                              className="flex items-baseline gap-3 text-sm"
                            >
                              <span className="text-vista-accent min-w-12 text-xs font-semibold">
                                {place.distance}
                              </span>
                              <span className="text-vista-text/70">
                                {place.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {property.nearbyMalls && property.nearbyMalls.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="text-vista-accent h-4 w-4" />
                        <h3 className="text-vista-primary text-sm font-medium">
                          Shopping
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {property.nearbyMalls.map((place, idx) => (
                          <div
                            key={idx}
                            className="flex items-baseline gap-3 text-sm"
                          >
                            <span className="text-vista-accent min-w-12 text-xs font-semibold">
                              {place.distance}
                            </span>
                            <span className="text-vista-text/70">
                              {place.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-5">
              {/* Price Card */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
                className="shadow-vista-primary/5 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-6">
                  <p className="text-vista-text/50 mb-1 text-xs tracking-wider uppercase">
                    {property.listingType === "For Rent"
                      ? "Monthly Rent"
                      : "Price"}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-vista-primary text-3xl font-bold">
                      ₱{property.price.toLocaleString()}
                    </span>
                    {property.listingType === "For Rent" && (
                      <span className="text-vista-text/40 text-sm">/mo</span>
                    )}
                  </div>
                  {property.priceNegotiable && (
                    <span className="text-vista-accent mt-2 inline-block text-xs font-medium">
                      Price negotiable
                    </span>
                  )}
                  {property.associationDues && property.associationDues > 0 && (
                    <p className="text-vista-text/50 mt-2 text-xs">
                      + ₱{property.associationDues.toLocaleString()}/mo
                      association dues
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <button className="bg-vista-primary hover:bg-vista-primary/90 hover:shadow-vista-primary/20 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg">
                    Schedule a Visit
                  </button>
                  <button className="bg-vista-primary/5 text-vista-primary hover:bg-vista-primary/10 w-full rounded-xl py-3.5 text-sm font-semibold transition-all">
                    Contact Agent
                  </button>
                </div>
              </motion.div>

              {/* AI Virtual Staging */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.25,
                }}
                className="from-vista-accent to-vista-primary relative overflow-hidden rounded-2xl bg-linear-to-br p-6 text-white"
              >
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold">AI Virtual Staging</h3>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-white/80">
                    Transform empty rooms into beautifully designed spaces with
                    AI-powered staging.
                  </p>
                  <button className="text-vista-primary w-full rounded-xl bg-white py-3 text-sm font-semibold transition-all hover:bg-white/90">
                    Try AI Staging
                  </button>
                </div>
              </motion.div>

              {/* Agent Card */}
              {property.agentName && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                  }}
                  className="shadow-vista-primary/5 rounded-2xl bg-white p-6 shadow-sm"
                >
                  <p className="text-vista-text/50 mb-4 text-xs tracking-wider uppercase">
                    Listed by
                  </p>
                  <div className="mb-5 flex items-center gap-4">
                    <div className="from-vista-accent to-vista-primary flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
                      <span className="text-lg font-semibold text-white">
                        {property.agentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-vista-primary font-semibold">
                        {property.agentName}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-vista-text/50 text-sm">
                          Real Estate Agent
                        </span>
                        {property.agentExperience && (
                          <>
                            <span className="text-vista-text/30">•</span>
                            <span className="text-vista-text/50 flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {property.agentExperience}y exp
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {property.agentPhone && (
                      <a
                        href={`tel:${property.agentPhone}`}
                        className="bg-vista-primary hover:bg-vista-primary/90 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    )}
                    {property.agentEmail && (
                      <a
                        href={`mailto:${property.agentEmail}`}
                        className="bg-vista-text/5 text-vista-primary hover:bg-vista-text/10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

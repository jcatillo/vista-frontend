import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SellerFooter } from "../components/sections/seller";
import {
  PropertyDetailsHeader,
  PropertyDetailsImage,
  PropertyDetailsImageModal,
  PropertyDetailsStats,
  PropertyDetailsBasicInfo,
  PropertyDetailsSpecifications,
  PropertyDetailsFeatureList,
  PropertyDetailsAbout,
  PropertyDetailsNearby,
  PropertyDetailsLocation,
  PropertyDetailsFinancial,
  PropertyDetailsAvailability,
  PropertyDetailsAgent,
  PropertyDetailsDeveloper,
  PropertyDetailsActions,
} from "../components/sections/seller/propertyDetails";
import type { Property, PropertyImage } from "../types/property";
import { getProperty } from "../services/propertyService";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const [expandedImages, setExpandedImages] = useState<
    PropertyImage[] | undefined
  >();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      const response = await getProperty(propertyId);
      setProperty(response);
    } catch (error) {
      console.error("Failed to fetch property:", error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Update property when id changes
    fetchProperty(id || "1");
  }, [id]);

  const handlePropertyUpdate = (updatedData: Property) => {
    setProperty({ ...updatedData });
  };

  if (loading) {
    return (
      <div className="bg-vista-bg flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="border-vista-accent h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
            <h1 className="text-vista-primary mb-2 text-xl font-semibold">
              Loading Property Details...
            </h1>
            <p className="text-vista-text-secondary">
              Please wait while we fetch the property information.
            </p>
          </div>
        </div>
        <SellerFooter />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-vista-bg flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-vista-primary mb-2 text-2xl font-bold">
              Property Not Found
            </h1>
            <button
              onClick={() => navigate("/seller/properties")}
              className="text-vista-accent hover:text-vista-primary transition-colors"
            >
              Back to Properties
            </button>
          </div>
        </div>
        <SellerFooter />
      </div>
    );
  }

  return (
    <div className="bg-vista-bg flex min-h-screen flex-col">
      <section className="flex-1">
        <PropertyDetailsHeader property={property} />

        {/* Main Content */}
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Images and Details */}
            <div className="space-y-6 lg:col-span-2">
              <PropertyDetailsImage
                property={property}
                onImageExpanded={(expanded, imageIndex, images) => {
                  setIsImageExpanded(expanded);
                  setExpandedImageIndex(imageIndex);
                  setExpandedImages(images);
                }}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsAbout
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsStats
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsBasicInfo
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsSpecifications
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsFeatureList
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsNearby
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsLocation
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsFinancial
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsAvailability
                property={property}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsAgent property={property} />

              <PropertyDetailsDeveloper property={property} />
            </div>

            {/* Right Column - Actions */}
            <PropertyDetailsActions
              property={property}
              onDelete={() => navigate("/seller/properties")}
            />
          </div>
        </div>
      </section>

      <PropertyDetailsImageModal
        property={property}
        isOpen={isImageExpanded}
        onClose={() => setIsImageExpanded(false)}
        initialImageIndex={expandedImageIndex}
        images={expandedImages}
      />

      <SellerFooter />
    </div>
  );
}

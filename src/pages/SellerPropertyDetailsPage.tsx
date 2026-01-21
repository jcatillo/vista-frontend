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
import { propertyDatabase, type Property } from "../data/properties";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(propertyDatabase[id || "1"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Update property when id changes
    setProperty(propertyDatabase[id || "1"]);
  }, [id]);

  const handlePropertyUpdate = (updatedData: Property) => {
    setProperty({ ...updatedData });
  };

  if (!property) {
    return (
      <div className="bg-vista-bg min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-vista-primary text-2xl font-bold mb-2">
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
    <div className="bg-vista-bg min-h-screen flex flex-col">
      <section className="flex-1">
        <PropertyDetailsHeader property={property} />

        {/* Main Content */}
        <div className="mx-auto max-w-7xl w-full px-4 pb-12 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              <PropertyDetailsImage
                property={property}
                onImageExpanded={(expanded, imageIndex) => {
                  setIsImageExpanded(expanded);
                  setExpandedImageIndex(imageIndex);
                }}
                onUpdate={handlePropertyUpdate}
              />

              <PropertyDetailsAbout property={property} onUpdate={handlePropertyUpdate} />
              
              <PropertyDetailsStats property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsBasicInfo property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsSpecifications property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsFeatureList property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsNearby property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsLocation property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsFinancial property={property} onUpdate={handlePropertyUpdate} />

              <PropertyDetailsAvailability property={property} onUpdate={handlePropertyUpdate} />
              
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
      />

      <SellerFooter />
    </div>
  );
}

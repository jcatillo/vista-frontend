import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { AddPropertyModalProps, PropertyFormData } from "./interface";

// Import all step components
import { BasicInfo } from "./Basicinfo";
import { PropertyDetails } from "./PropertyDetails";
import { ImageStep } from "./ImageStep";
import { PropertyFeaturesForm } from "./DetailsAndPricing";
import { LocationNearby } from "./LocationNearby";
import { LegalFinancial } from "./LegalFinancial";
import { AvailabilityPolicies } from "./AvailabilityPolicies";
import { AgentInformationForm } from "./AgentInformationForm";
import { DeveloperInformation } from "./DeveloperInformation";
import { TermsAndPolicies } from "./TermsAndPolicies";

const STEPS = [
  { id: 1, title: "Basic Information", component: BasicInfo },
  { id: 2, title: "Property Details", component: PropertyDetails },
  { id: 3, title: "Property Images", component: ImageStep },
  { id: 4, title: "Description & Features", component: PropertyFeaturesForm },
  { id: 5, title: "Location & Nearby", component: LocationNearby },
  { id: 6, title: "Legal & Financial", component: LegalFinancial },
  { id: 7, title: "Availability & Policies", component: AvailabilityPolicies },
  { id: 8, title: "Agent Information", component: AgentInformationForm },
  { id: 9, title: "Developer Information", component: DeveloperInformation },
  { id: 10, title: "Terms & Policies", component: TermsAndPolicies },
];

export default function AddPropertyModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPropertyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;

  // Initialize form data with default values
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    propertyType: "",
    listingType: "",
    address: "",
    latitude: "",
    longitude: "",
    price: "",
    priceNegotiable: false,
    regularImages: [],
    panoramicImages: [],
    bedrooms: "",
    bathrooms: "",
    floorArea: "",
    lotArea: "",
    parkingAvailable: false,
    parkingSlots: "",
    floorLevel: "",
    storeys: "",
    furnishing: "",
    condition: "",
    yearBuilt: "",
    description: "",
    amenities: [],
    interiorFeatures: [],
    buildingAmenities: [],
    utilities: [],
    nearbySchools: [],
    nearbyHospitals: [],
    nearbyMalls: [],
    nearbyTransport: [],
    nearbyOffices: [],
    ownershipStatus: "",
    taxStatus: "",
    associationDues: "",
    terms: [],
    availabilityDate: "",
    minimumLeasePeriod: "",
    petPolicy: "",
    smokingPolicy: "",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    agentExperience: "",
    agentBio: "",
    hasDeveloper: false,
    developerName: "",
    developerWebsite: "",
    developerPhone: "",
    developerEmail: "",
    developerYears: "",
    developerBio: "",
  });

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof PropertyFormData, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter((i) => i !== item)
        : [...(prev[field] as string[]), item],
    }));
  };

  const handleFileUpload = (
    field: "regularImages" | "panoramicImages",
    files: FileList | null
  ) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], ...fileArray],
      }));
    }
  };

  const handleRemoveImage = (
    field: "regularImages" | "panoramicImages",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as File[]).filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: "",
      propertyType: "",
      listingType: "",
      address: "",
      latitude: "",
      longitude: "",
      price: "",
      priceNegotiable: false,
      regularImages: [],
      panoramicImages: [],
      bedrooms: "",
      bathrooms: "",
      floorArea: "",
      lotArea: "",
      parkingAvailable: false,
      parkingSlots: "",
      floorLevel: "",
      storeys: "",
      furnishing: "",
      condition: "",
      yearBuilt: "",
      description: "",
      amenities: [],
      interiorFeatures: [],
      buildingAmenities: [],
      utilities: [],
      nearbySchools: [],
      nearbyHospitals: [],
      nearbyMalls: [],
      nearbyTransport: [],
      nearbyOffices: [],
      ownershipStatus: "",
      taxStatus: "",
      associationDues: "",
      terms: [],
      availabilityDate: "",
      minimumLeasePeriod: "",
      petPolicy: "",
      smokingPolicy: "",
      agentName: "",
      agentPhone: "",
      agentEmail: "",
      agentExperience: "",
      agentBio: "",
      hasDeveloper: false,
      developerName: "",
      developerWebsite: "",
      developerPhone: "",
      developerEmail: "",
      developerYears: "",
      developerBio: "",
    });
    setCurrentStep(1);
  };

  const isStepValid = () => {
    const currentStepData = STEPS[currentStep - 1];

    switch (currentStepData.id) {
      case 1: // Basic Information
        return (
          formData.name &&
          formData.propertyType &&
          formData.listingType &&
          formData.address
        );
      case 2: // Property Details
        return (
          formData.bedrooms &&
          formData.bathrooms &&
          formData.floorArea &&
          formData.price
        );
      case 3: // Property Images
        return formData.regularImages.length > 0;
      case 4: // Description & Features
        return formData.description;
      case 8: // Agent Information
        return formData.agentName && formData.agentPhone && formData.agentEmail;
      case 10: // Terms & Policies
        return formData.terms.length > 0;
      default:
        return true;
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;

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
            className="bg-vista-primary/60 fixed inset-0 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="bg-vista-primary flex items-center justify-between px-6 py-4 text-white">
                <div>
                  <h2 className="text-xl font-bold">Add New Property</h2>
                  <p className="mt-1 text-sm text-white/80">
                    Step {currentStep} of {totalSteps}: {currentStepData.title}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 transition-colors hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="bg-vista-surface/30 h-2">
                <motion.div
                  className="bg-vista-accent h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <CurrentStepComponent
                  formData={formData}
                  onUpdate={handleInputChange}
                  onArrayToggle={handleArrayToggle}
                  onFileUpload={handleFileUpload}
                  onRemoveImage={handleRemoveImage}
                />
              </div>

              {/* Footer Actions */}
              <div className="bg-vista-surface/20 border-vista-surface/30 flex items-center justify-between border-t px-6 py-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="border-vista-primary/20 text-vista-primary hover:bg-vista-primary/5 rounded-xl border px-6 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <div className="flex gap-2">
                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="bg-vista-accent hover:bg-vista-accent/90 rounded-xl px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isStepValid()}
                      className="bg-vista-accent hover:bg-vista-accent/90 rounded-xl px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Add Property
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

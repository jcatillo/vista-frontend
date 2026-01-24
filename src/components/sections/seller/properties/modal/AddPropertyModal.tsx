import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { AddPropertyModalProps, PropertyFormData } from "./interface";

// Import all step components
import { BasicInfo } from "./Basicinfo";
import { PropertyDetails } from "./PropertyDetails";
import { ImageStep } from "./ImageStep";
import { RoomLabelStep } from "./RoomLabelStep";
import { ThumbnailStep } from "./ThumbnailStep";
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
  { id: 4, title: "Label Room Types", component: RoomLabelStep },
  { id: 5, title: "Select Thumbnail", component: ThumbnailStep },
  { id: 6, title: "Description & Features", component: PropertyFeaturesForm },
  { id: 7, title: "Location & Nearby", component: LocationNearby },
  { id: 8, title: "Legal & Financial", component: LegalFinancial },
  { id: 9, title: "Availability & Policies", component: AvailabilityPolicies },
  { id: 10, title: "Agent Information", component: AgentInformationForm },
  { id: 11, title: "Developer Information", component: DeveloperInformation },
  { id: 12, title: "Terms & Policies", component: TermsAndPolicies },
];

export default function AddPropertyModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPropertyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [stepValidationStatus, setStepValidationStatus] = useState<
    Record<number, boolean | undefined>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation rules for each step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const currentData = formData;

    switch (step) {
      case 1: // Basic Information
        if (!currentData.name.trim()) errors.name = "Property name is required";
        if (!currentData.propertyType)
          errors.propertyType = "Property type is required";
        if (!currentData.listingType)
          errors.listingType = "Listing type is required";
        break;

      case 2: // Property Details
        if (!currentData.price.trim()) errors.price = "Price is required";
        if (!currentData.bedrooms.trim())
          errors.bedrooms = "Number of bedrooms is required";
        if (!currentData.bathrooms.trim())
          errors.bathrooms = "Number of bathrooms is required";
        if (!currentData.floorArea.trim())
          errors.floorArea = "Floor area is required";
        if (!currentData.furnishing)
          errors.furnishing = "Furnishing status is required";
        if (!currentData.condition)
          errors.condition = "Property condition is required";
        break;

      case 3: // Property Images
        if (currentData.regularImages.length === 0)
          errors.regularImages = "At least one property image is required";
        break;

      case 4: // Label Room Types
        const unlabeledRegular = currentData.regularImages.filter(
          (img: { file: File; label: string }) => !img.label
        );
        const unlabeledPanoramic = currentData.panoramicImages.filter(
          (img: { file: File; label: string }) => !img.label
        );
        if (unlabeledRegular.length > 0 || unlabeledPanoramic.length > 0) {
          errors.roomLabels = "Please assign room types to all uploaded images";
        }
        break;

      case 5: // Select Thumbnail
        if (currentData.selectedThumbnailIndex === null)
          errors.selectedThumbnailIndex = "Please select a main thumbnail";
        break;

      case 6: // Description & Features
        if (!currentData.description.trim())
          errors.description = "Property description is required";
        break;

      case 7: // Location & Nearby
        if (!currentData.address.trim())
          errors.address = "Property address is required";
        break;

      case 8: // Legal & Financial
        if (!currentData.ownershipStatus.trim())
          errors.ownershipStatus = "Ownership status is required";
        break;

      case 10: // Agent Information
        if (!currentData.agentName.trim())
          errors.agentName = "Agent name is required";
        if (!currentData.agentPhone.trim())
          errors.agentPhone = "Agent phone is required";
        if (!currentData.agentEmail.trim())
          errors.agentEmail = "Agent email is required";
        break;

      case 11: // Developer Information (only if hasDeveloper is true)
        if (currentData.hasDeveloper) {
          if (!currentData.developerName.trim())
            errors.developerName = "Developer name is required";
          if (!currentData.developerPhone.trim())
            errors.developerPhone = "Developer phone is required";
          if (!currentData.developerEmail.trim())
            errors.developerEmail = "Developer email is required";
        }
        break;

      case 12: // Terms & Policies
        if (currentData.terms.length === 0)
          errors.terms = "At least one term must be selected";
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all required fields for the current step are filled
  const isCurrentStepComplete = (): boolean => {
    const currentData = formData;

    switch (currentStep) {
      case 1: // Basic Information
        return !!(
          currentData.name.trim() &&
          currentData.propertyType &&
          currentData.listingType
        );

      case 2: // Property Details
        return !!(
          currentData.price.trim() &&
          currentData.bedrooms.trim() &&
          currentData.bathrooms.trim() &&
          currentData.floorArea.trim() &&
          currentData.furnishing &&
          currentData.condition
        );

      case 3: // Property Images
        return currentData.regularImages.length > 0;

      case 4: // Label Room Types
        const hasUnlabeledRegular = currentData.regularImages.some(
          (img: { file: File; label: string }) => !img.label
        );
        const hasUnlabeledPanoramic = currentData.panoramicImages.some(
          (img: { file: File; label: string }) => !img.label
        );
        return !hasUnlabeledRegular && !hasUnlabeledPanoramic;

      case 5: // Select Thumbnail
        return currentData.selectedThumbnailIndex !== null;

      case 6: // Description & Features
        return !!currentData.description.trim();

      case 7: // Location & Nearby
        return !!currentData.address.trim();

      case 8: // Legal & Financial
        return !!currentData.ownershipStatus.trim();

      case 10: // Agent Information
        return !!(
          currentData.agentName.trim() &&
          currentData.agentPhone.trim() &&
          currentData.agentEmail.trim()
        );

      case 11: // Developer Information (only if hasDeveloper is true)
        if (currentData.hasDeveloper) {
          return !!(
            currentData.developerName.trim() &&
            currentData.developerPhone.trim() &&
            currentData.developerEmail.trim()
          );
        }
        return true; // If no developer, step is complete

      case 12: // Terms & Policies
        return currentData.terms.length > 0;

      default:
        return true;
    }
  };

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
    selectedThumbnailIndex: null,
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
    // Clear validation error for this field when user updates it
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Reset validation status for current step to allow re-attempt
    if (stepValidationStatus[currentStep] === false) {
      setStepValidationStatus((prev) => ({
        ...prev,
        [currentStep]: undefined,
      }));
    }
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
      const fileArray = Array.from(files).map((file) => ({
        file,
        label: "",
      }));
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
      [field]: (prev[field] as Array<{ file: File; label: string }>).filter(
        (_, i) => i !== index
      ),
    }));
    // Adjust selected thumbnail index if necessary
    if (field === "regularImages" && formData.selectedThumbnailIndex !== null) {
      if (formData.selectedThumbnailIndex === index) {
        setFormData((prev) => ({ ...prev, selectedThumbnailIndex: null }));
      } else if (formData.selectedThumbnailIndex > index) {
        setFormData((prev) => ({
          ...prev,
          selectedThumbnailIndex: prev.selectedThumbnailIndex! - 1,
        }));
      }
    }
  };

  const handleUpdateImageLabel = (
    field: "regularImages" | "panoramicImages",
    index: number,
    label: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as Array<{ file: File; label: string }>).map(
        (item, i) => (i === index ? { ...item, label } : item)
      ),
    }));
  };

  const handleSelectThumbnail = (index: number | null) => {
    setFormData((prev) => ({ ...prev, selectedThumbnailIndex: index }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
      // Mark this step as validated successfully
      setStepValidationStatus((prev) => ({
        ...prev,
        [currentStep]: true,
      }));

      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        // Clear validation errors when moving to next step
        setValidationErrors({});
      }
    } else {
      // Mark this step as failed validation
      setStepValidationStatus((prev) => ({
        ...prev,
        [currentStep]: false,
      }));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // Clear validation errors when going back
      setValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    // Validate final step before submitting
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await onSubmit(formData);
        // Reset form and close modal on success
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
          selectedThumbnailIndex: null,
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
        setValidationErrors({});
        setStepValidationStatus({});
        setSubmitError(null);
        onClose();
      } catch (error) {
        // Display error in modal
        console.error("Submit error:", error);
        setSubmitError(
          error instanceof Error ? error.message : "Failed to create property"
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Mark this step as failed validation
      setStepValidationStatus((prev) => ({
        ...prev,
        [currentStep]: false,
      }));
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
                  onUpdateImageLabel={handleUpdateImageLabel}
                  onSelectThumbnail={handleSelectThumbnail}
                  validationErrors={validationErrors}
                />

                {/* Submit Error Display */}
                {submitError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                )}
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
                      disabled={!isCurrentStepComplete()}
                      className={`rounded-xl px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed ${
                        isCurrentStepComplete()
                          ? "bg-vista-accent hover:bg-vista-accent/90"
                          : "bg-gray-400 hover:bg-gray-400"
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isCurrentStepComplete() || isSubmitting}
                      className={`rounded-xl px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed ${
                        isCurrentStepComplete() && !isSubmitting
                          ? "bg-vista-accent hover:bg-vista-accent/90"
                          : "bg-gray-400 hover:bg-gray-400"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Creating Property...
                        </div>
                      ) : (
                        "Add Property"
                      )}
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

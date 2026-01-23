import type {
  Property,
  PropertyFormInput,
  SellerPropertiesResponse,
} from "../types/property";
import { env } from "../utils/env";

const { BASE_URL } = env;

// Fields that your Python service passes to `_parse_json_array`
const JSON_FIELDS = [
  "amenities",
  "interiorFeatures",
  "buildingAmenities",
  "utilities",
  "terms",
  "nearbySchools",
  "nearbyHospitals",
  "nearbyMalls",
  "nearbyTransport",
  "nearbyOffices",
];

/**
 * Transforms the Typed Object into FormData.
 * STRICTLY matches the parsing logic in Python `PropertyService._parse_property_data`
 */
function createFormData(data: Partial<PropertyFormInput>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // 1. Handle Files
    // We append multiple values to the same key 'regularImages' (without brackets)
    if (key === "regularImages" && Array.isArray(value)) {
      (value as File[]).forEach((file) =>
        formData.append("regularImages", file)
      );
      return;
    }
    if (key === "panoramicImages" && Array.isArray(value)) {
      (value as File[]).forEach((file) =>
        formData.append("panoramicImages", file)
      );
      return;
    }

    if (key === "image" && value instanceof File) {
      console.log(
        `Appending image as 'image': File(${value.name}, ${value.size} bytes)`
      );
      formData.append("image", value);
      return;
    }

    // Skip null/undefined so Python .get() returns None/default
    if (value === null || value === undefined) return;

    // 2. Handle Complex Arrays -> JSON String
    // Python: `_parse_json_array` calls `json.loads(data)`
    if (JSON_FIELDS.includes(key)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // 3. Handle Booleans -> String "true"/"false"
    // Python: `data.get('priceNegotiable') == 'true'`
    if (typeof value === "boolean") {
      formData.append(key, String(value));
      return;
    }

    // 4. Handle Dates
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    // 5. Handle everything else (Numbers/Strings)
    formData.append(key, String(value));
  });

  return formData;
}

// --- Exported Endpoints ---

export async function createProperty(
  data: PropertyFormInput
): Promise<Property> {
  console.log("Creating property with data keys:", Object.keys(data));
  console.log("Creating property with data:", data);
  console.log("mainImage type:", data.mainImage?.constructor?.name);
  console.log("mainImage instanceof File:", data.mainImage instanceof File);

  const formData = createFormData(data);

  console.log("FormData entries:");


  // Hardcode user_id or retrieve from your Auth Context if needed
  // formData.append('user_id', 'CURRENT_USER_ID');

  const response = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();

  console.log(`Create Property Response:`, responseData);

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error?.message || "Failed to create property");
  }

  // Unwrap the property object from the response wrapper
  return responseData.property;
}

export async function updateProperty(
  id: string,
  data: Partial<PropertyFormInput>
): Promise<Property> {
  const formData = createFormData(data);

  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "PUT",
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error?.message || "Failed to update property");
  }

  return responseData.property;
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`${BASE_URL}/properties/${id}`);
  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error?.message || "Property not found");
  }

  // Important: Return responseData.property, not responseData itself
  return responseData.property;
}

export async function getSellerProperties(): Promise<SellerPropertiesResponse> {
  const url = new URL(`${BASE_URL}/properties/seller/properties-view`);

  const response = await fetch(url.toString());

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(
      responseData.error?.message || "Failed to get seller properties"
    );
  }

  return responseData;
}

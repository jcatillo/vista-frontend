import type {
  Property,
  PropertyFormInput,
  SellerPropertiesResponse,
} from "../types/property";
import type {
  PropertyCardsQuery,
  PropertyCardsResponse,
  PropertyDetailsResponse,
  PropertySearchRequest,
  PropertySearchResponse,
  BuyerPropertiesViewQuery,
  BuyerPropertiesViewResponse,
} from "../features/buyer/types/property.types";
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
    // 1. Handle Images with Labels
    // We append multiple values to the same key 'regularImages' (without brackets)
    if (
      key === "regularImages" &&
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null &&
      "file" in value[0]
    ) {
      (value as unknown as Array<{ file: File; label: string }>).forEach(
        (imageObj) => {
          formData.append("regularImages", imageObj.file);
          formData.append(`regularImages_labels`, imageObj.label);
        }
      );
      return;
    }
    if (
      key === "panoramicImages" &&
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null &&
      "file" in value[0]
    ) {
      (value as unknown as Array<{ file: File; label: string }>).forEach(
        (imageObj) => {
          formData.append("panoramicImages", imageObj.file);
          formData.append(`panoramicImages_labels`, imageObj.label);
        }
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

export async function patchProperty(
  id: string,
  data: Partial<Property>
): Promise<Property> {
  // For PATCH, we'll use JSON since it's for partial updates
  // Add user_id as per API doc (temporary until auth is implemented)
  const patchData = {
    user_id: "current_user_id", // TODO: get from auth context
    ...data,
  };

  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchData),
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error?.message || "Failed to patch property");
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

// ============================================================================
// BUYER API FUNCTIONS - Lightweight payloads for optimized performance
// ============================================================================

/**
 * Get property cards for marketplace listings with pagination and filtering
 */
export async function getPropertyCards(
  filters?: PropertyCardsQuery
): Promise<PropertyCardsResponse> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const url = `${BASE_URL}/buyer/properties${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property cards: ${response.statusText}`);
  }

  const responseData: PropertyCardsResponse = await response.json();

  if (!responseData.success) {
    throw new Error(
      responseData.error?.message || "Failed to get property cards"
    );
  }

  return responseData;
}

/**
 * Get detailed property information for property details view
 */
export async function getPropertyDetails(
  propertyId: string
): Promise<PropertyDetailsResponse> {
  const url = `${BASE_URL}/buyer/${propertyId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property details: ${response.statusText}`);
  }

  const responseData: PropertyDetailsResponse = await response.json();

  if (!responseData.success) {
    throw new Error(
      responseData.error?.message || "Failed to get property details"
    );
  }

  return responseData;
}

/**
 * Advanced property search with filter payload
 */
export async function searchProperties(
  filters: PropertySearchRequest
): Promise<PropertySearchResponse> {
  const url = `${BASE_URL}/api/buyer/properties/search`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error(`Failed to search properties: ${response.statusText}`);
  }

  const responseData: PropertySearchResponse = await response.json();

  if (!responseData.success) {
    throw new Error(
      responseData.error?.message || "Failed to search properties"
    );
  }

  return responseData;
}

/**
 * Get buyer properties view for marketplace/dashboard
 */
export async function getBuyerPropertiesView(
  filters?: BuyerPropertiesViewQuery
): Promise<BuyerPropertiesViewResponse> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const url = `${BASE_URL}/buyer/properties-view${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch buyer properties view: ${response.statusText}`
    );
  }

  const responseData: BuyerPropertiesViewResponse = await response.json();

  if (!responseData.success) {
    throw new Error(
      responseData.error?.message || "Failed to get buyer properties view"
    );
  }

  return responseData;
}

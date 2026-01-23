// Virtual Staging API Service
// This service handles all API calls to the Virtual Staging backend

export interface VirtualStagingSession {
  session_id: string;
  property_id: string;
  user_id: string;
  room_name: string;
  original_image_url?: string;
  current_image_url?: string;
  last_saved_image_url?: string;
  panoramic_images: Array<{
    id: string;
    url: string;
    filename: string;
    imageType: "panoramic";
  }>;
  staging_parameters: Record<string, any>;
  current_version: number;
  total_versions: number;
  has_unsaved_changes: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface CreateSessionRequest {
  property_id: string;
  user_id: string;
  room_name: string;
  image_index?: number;
  style?: string;
  furniture_theme?: string;
  color_scheme?: string;
  specific_request?: string;
}

export interface CreateSessionResponse {
  message: string;
  session_id: string;
  selected_image: {
    url: string;
    filename: string;
    index: number;
  };
  available_panoramic_images: number;
  staging: VirtualStagingSession;
}

export interface GenerateStagingRequest {
  session_id: string;
  image_index?: number;
  custom_prompt: string;
  style?: string;
  furniture_theme?: string;
  color_scheme?: string;
  specific_request?: string;
  user_message?: string;
  image_mask?: File;
}

export interface GenerateStagingResponse {
  message: string;
  session_id: string;
  new_panorama_url: string;
  selected_image: {
    url: string;
    filename: string;
    index: number;
  };
  available_panoramic_images: number;
  staging_type: string;
  prompt_used: string;
}

export interface SaveChangeRequest {
  session_id: string;
}

export interface SaveChangeResponse {
  success: boolean;
  version: number;
  message: string;
}

export interface RevertChangeRequest {
  session_id: string;
}

export interface RevertChangeResponse {
  success: boolean;
  image_url: string;
  reverted_at: string;
  message: string;
}

export interface VersionHistoryResponse {
  session_id: string;
  total_versions: number;
  current_version: number;
  has_unsaved_changes: boolean;
  versions: Array<{
    version_number: number;
    image_url: string;
    parameters: Record<string, any>;
    prompt_used: string;
    created_at: string;
    saved_at?: string;
    is_current: boolean;
  }>;
}

export interface ChatHistoryResponse {
  session_id: string;
  total_messages: number;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    message_type?: string;
  }>;
}

const API_BASE_URL = "/api/staging";

class VirtualStagingService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed: ${response.statusText}`
      );
    }

    return response.json();
  }

  private async makeFormRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Session Management
  async createSession(
    request: CreateSessionRequest
  ): Promise<CreateSessionResponse> {
    const formData = new FormData();

    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return this.makeFormRequest<CreateSessionResponse>("/session", formData);
  }

  async getSession(
    sessionId: string
  ): Promise<{ message: string; session: VirtualStagingSession }> {
    return this.makeRequest(`/session/${sessionId}`);
  }

  // Virtual Staging Generation
  async generateStaging(
    request: GenerateStagingRequest
  ): Promise<GenerateStagingResponse> {
    const formData = new FormData();

    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.makeFormRequest<GenerateStagingResponse>("/generate", formData);
  }

  // Version Management
  async saveChanges(request: SaveChangeRequest): Promise<SaveChangeResponse> {
    return this.makeRequest("/save-change", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async revertChanges(
    request: RevertChangeRequest
  ): Promise<RevertChangeResponse> {
    return this.makeRequest("/revert-change", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getVersionHistory(sessionId: string): Promise<VersionHistoryResponse> {
    return this.makeRequest(`/version-history/${sessionId}`);
  }

  // Chat History
  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    return this.makeRequest(`/chat-history/${sessionId}`);
  }

  async getChatMessages(sessionId: string): Promise<ChatHistoryResponse> {
    return this.makeRequest(`/chat-history/${sessionId}/messages`);
  }
}

export const virtualStagingService = new VirtualStagingService();

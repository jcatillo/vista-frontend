/**
 * Current User Management
 * Stores the currently logged-in user's information
 */

export interface User {
  id: string;
  name: string;
  title: string;
  image: string;
  phone: string;
  email: string;
  experience: string;
  rating: number;
  reviews: number;
  bio: string;
}

/**
 * Default current user (Demo Agent)
 */
const defaultUser: User = {
  id: "agent_001",
  name: "Johnson Smith",
  title: "Real Estate Agent",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  phone: "+1 (555) 123-4567",
  email: "alex.johnson@vistaproperties.com",
  experience: "8 years",
  rating: 4.8,
  reviews: 156,
  bio: "Dedicated real estate professional with extensive experience in residential and commercial properties.",
};

/**
 * Get current user from localStorage or return default
 */
export function getCurrentUser(): User {
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error retrieving current user:", error);
  }
  return defaultUser;
}

/**
 * Set current user in localStorage
 */
export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving current user:", error);
  }
}

/**
 * Reset to default user
 */
export function resetToDefaultUser(): void {
  setCurrentUser(defaultUser);
}

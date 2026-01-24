import { createContext } from "react";

// Define the shape of a single property card
export interface PropertyCardData {
  propertyId: string;
  name: string;
  price: number;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  propertyType: string;
  image?: { url: string };
}

// Define the message structure
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  properties?: PropertyCardData[]; // <--- THIS MUST BE HERE
}

// Define the Context Provider structure
export interface MarkAIContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addMessage: (
    text: string,
    sender: "user" | "bot",
    properties?: PropertyCardData[] // <--- THIS MUST BE HERE
  ) => void;
}

export const MarkAIContext = createContext<MarkAIContextType | undefined>(
  undefined
);

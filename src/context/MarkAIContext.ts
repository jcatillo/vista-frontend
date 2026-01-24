import { createContext } from "react";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface MarkAIContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addMessage: (text: string, sender: "user" | "bot") => void;
}

export const MarkAIContext = createContext<MarkAIContextType | undefined>(
  undefined
);

import { useState, useEffect, type ReactNode } from "react";
import { MarkAIContext, type Message } from "./MarkAIContext";

// Type Guard to validate localStorage data safely without using 'any'
function isMessageArray(data: unknown): data is Message[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        "id" in item &&
        "text" in item &&
        "sender" in item &&
        (item.sender === "user" || item.sender === "bot")
    )
  );
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hi! I'm Mark AI. How can I help you find your perfect property today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

export function MarkAIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("vista_chat_history");
    if (!saved) return initialMessages;

    try {
      const parsed: unknown = JSON.parse(saved);
      if (isMessageArray(parsed)) {
        // Hydrate timestamps from strings back to Date objects
        return parsed.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    } catch (e) {
      console.error("Failed to parse chat history", e);
    }
    return initialMessages;
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persistence logic: saves to browser whenever messages change
  useEffect(() => {
    localStorage.setItem("vista_chat_history", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <MarkAIContext.Provider
      value={{ messages, setMessages, isOpen, setIsOpen, addMessage }}
    >
      {children}
    </MarkAIContext.Provider>
  );
}

import { useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import {
  MarkAIContext,
  type Message,
  type PropertyCardData,
} from "./MarkAIContext";
import env from "../utils/env";

// Type Guard to validate data structure
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
        // Hydrate data
        return parsed.map((m) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const raw = m as any;
          return {
            ...m,
            timestamp: new Date(m.timestamp),
            properties: raw.properties || undefined,
            isHidden: raw.isHidden || false,
          };
        });
      }
    } catch (e) {
      console.error("Failed to parse chat history", e);
    }
    return initialMessages;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem("vista_chat_history", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (
    text: string,
    sender: "user" | "bot",
    properties?: PropertyCardData[]
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      properties,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const notifyPropertyView = async (propertyId: string) => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
    setIsSummaryLoading(true);

    const formattedHistory = messages.slice(-20).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await axios.post(`${env.BASE_URL}/mark/summary`, {
        propertyId,
        history: formattedHistory,
      });

      const { summary, property } = response.data;

      // 3. Inject Hidden Context (Raw Data)
      if (property) {
        const contextMsg: Message = {
          id: Date.now().toString() + "_ctx",
          text: `[SYSTEM INJECTION] User clicked/viewed property card. PROPERTY DATA: ${JSON.stringify(
            property
          )}`,
          sender: "user",
          timestamp: new Date(),
          isHidden: true,
        };
        setMessages((prev) => [...prev, contextMsg]);

        // 3b. Add Visible User Message with Property Card
        const propertyCard: PropertyCardData = {
          propertyId: property._id || property.propertyId,
          name: property.name,
          price: property.price,
          address: property.address,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          floorArea: property.floorArea,
          propertyType: property.propertyType,
          image: property.images?.[0] || property.image,
        };

        const userPropertyMsg: Message = {
          id: Date.now().toString() + "_user_prop",
          text: "I'm interested in this property:",
          sender: "user",
          timestamp: new Date(),
          properties: [propertyCard],
        };
        setMessages((prev) => [...prev, userPropertyMsg]);
      }

      // 4. Add Visible Summary
      if (summary) {
        setTimeout(() => {
          const summaryMsg: Message = {
            id: Date.now().toString(),
            text: summary,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, summaryMsg]);
          setIsSummaryLoading(false);
        }, 400);
      } else {
        setIsSummaryLoading(false);
      }
    } catch (error) {
      setIsSummaryLoading(false);
      console.error("Failed to fetch property summary", error);
    }
  };

  return (
    <MarkAIContext.Provider
      value={{
        messages,
        setMessages,
        isOpen,
        setIsOpen,
        addMessage,
        notifyPropertyView,
        isSummaryLoading,
      }}
    >
      {children}
    </MarkAIContext.Provider>
  );
}

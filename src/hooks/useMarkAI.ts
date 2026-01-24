import { useContext } from "react";
import {
  MarkAIContext,
  type MarkAIContextType,
} from "../context/MarkAIContext";

export function useMarkAI(): MarkAIContextType {
  const context = useContext(MarkAIContext);
  if (context === undefined) {
    throw new Error("useMarkAI must be used within a MarkAIProvider");
  }
  return context;
}

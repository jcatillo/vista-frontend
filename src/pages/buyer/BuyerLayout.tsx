import { Outlet } from "react-router-dom";
import { MarkAI } from "../../features/mark/MarkAI";
import { MarkAIProvider } from "../../context/MarkAIProvider";

export function BuyerLayout() {
  return (
    <MarkAIProvider>
      <Outlet />
      <MarkAI />
    </MarkAIProvider>
  );
}

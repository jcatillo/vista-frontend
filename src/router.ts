import { createBrowserRouter } from "react-router-dom";
import RoleSelection from "./pages/RoleSelectionPage";
import Landing from "./pages/Landing";

export default createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/get-started",
    Component: RoleSelection,
  },
]);

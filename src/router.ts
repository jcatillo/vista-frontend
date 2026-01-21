import { createBrowserRouter } from "react-router-dom";
import RoleSelection from "./pages/RoleSelectionPage";
import Landing from "./pages/Landing";
import SellerLoginPage from "./pages/SellerLoginPage";
import SellerDashboard from "./pages/SellerDashboard";

export default createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/get-started",
    Component: RoleSelection,
  },
  {
    path: "/seller",
    Component: SellerLoginPage,
  },
  {
    path: "/seller/dashboard",
    Component: SellerDashboard,
  },
]);

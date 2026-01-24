import { createBrowserRouter } from "react-router-dom";
import RoleSelection from "./pages/RoleSelectionPage";
import Landing from "./pages/Landing";
import SellerLoginPage from "./pages/SellerLoginPage";
import SellerDashboard from "./pages/SellerDashboard";
import SellerPropertiesPage from "./pages/SellerPropertiesPage";
import PropertyDetailsPage from "./pages/SellerPropertyDetailsPage";
import VRViewerPage from "./pages/VRViewerPage";
import Marketplace from "./pages/buyer/Marketplace";
import BuyerLogin from "./pages/buyer/BuyerLogin";
import BuyerPropertyDetails from "./pages/buyer/BuyerPropertyDetails";
import { BuyerLayout } from "./pages/buyer/BuyerLayout";

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
  {
    path: "/seller/properties",
    Component: SellerPropertiesPage,
  },
  {
    path: "/seller/properties/:id",
    Component: PropertyDetailsPage,
  },
  {
    path: "/vr-viewer/:id",
    Component: VRViewerPage,
  },
  // Buyer landing page (no MarkAI)
  { path: "/buyer", Component: BuyerLogin },
  // Buyer pages with MarkAI
  {
    path: "/buyer",
    Component: BuyerLayout,
    children: [
      { path: "marketplace", Component: Marketplace },
      { path: "property/:id", Component: BuyerPropertyDetails },
    ],
  },
]);

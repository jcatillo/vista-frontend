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
  { path: "/buyer", Component: Marketplace },
  { path: "/buyer", Component: BuyerLogin },
  { path: "/buyer/marketplace", Component: Marketplace },
]);

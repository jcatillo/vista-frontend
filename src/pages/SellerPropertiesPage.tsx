import { useEffect } from "react";
import {
  PropertiesHeader,
  PropertiesStats,
  PropertiesGrid,
} from "../components/sections/seller/properties";

import { SellerNavbar, SellerFooter } from "../components/sections/seller";

export default function SellerPropertiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-vista-bg min-h-screen">
      <SellerNavbar />
      <PropertiesHeader />
      <PropertiesStats />
      <PropertiesGrid />
      <SellerFooter />
    </div>
  );
}

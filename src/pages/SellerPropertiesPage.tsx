import { useEffect, useRef } from "react";
import {
  PropertiesHeader,
  PropertiesStats,
  PropertiesGrid,
} from "../components/sections/seller/properties";

import { SellerNavbar, SellerFooter } from "../components/sections/seller";

export default function SellerPropertiesPage() {
  const propertiesGridRef = useRef<{ refetch: () => void }>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePropertyCreated = () => {
    propertiesGridRef.current?.refetch();
  };

  return (
    <div className="bg-vista-bg min-h-screen">
      <SellerNavbar />
      <PropertiesHeader onPropertyCreated={handlePropertyCreated} />
      <PropertiesStats />
      <PropertiesGrid ref={propertiesGridRef} />
      <SellerFooter />
    </div>
  );
}

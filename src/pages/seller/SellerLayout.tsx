import { Outlet } from "react-router-dom";
import { SellerNavbar } from "../../components/sections/seller";

export default function SellerLayout() {
  return (
    <div className="bg-vista-bg min-h-screen">
      <SellerNavbar />
      <Outlet />
    </div>
  );
}

import {
  WelcomeSection,
  AnalyticsSection,
  ActionsSection,
  ListingsSection,
  AIPromoSection,
} from "../components/sections/seller/dashboard";

import {SellerNavbar, SellerFooter} from "../components/sections/seller"; 

export default function SellerDashboard() {
  return (
    <div className="bg-vista-bg min-h-screen">
      <SellerNavbar />
      <WelcomeSection />
      <AnalyticsSection />
      <ActionsSection />
      <ListingsSection />
      <AIPromoSection />
      <SellerFooter />
    </div>
  );
}



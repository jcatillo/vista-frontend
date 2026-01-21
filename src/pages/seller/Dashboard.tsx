import {
  WelcomeSection,
  AnalyticsSection,
  ActionsSection,
  ListingsSection,
  AIPromoSection,
  SellerFooter,
} from "../../components/sections/seller";

export default function SellerDashboard() {
  return (
    <>
      <WelcomeSection />
      <AnalyticsSection />
      <ActionsSection />
      <ListingsSection />
      <AIPromoSection />
      <SellerFooter />
    </>
  );
}

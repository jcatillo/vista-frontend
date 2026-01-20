import { useRef } from "react";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { AnimatedBackground } from "../components/common/AnimatedBackground";
import { HeroSection } from "../components/sections/hero";
import { StagingSection } from "../components/sections/staging";
import { EchoSection } from "../components/sections/echo";
import { MarkSection } from "../components/sections/mark";
import { CostSection } from "../components/sections/cost";

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-screen snap-y snap-mandatory overflow-x-hidden overflow-y-scroll scroll-smooth"
    >
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <StagingSection />
      <EchoSection />
      <MarkSection />
      <CostSection />
      <Footer />
    </div>
  );
}

import HeroSectionLandingPage from "@/app/(client)/components/HeroSectionLandingPage";
import FeaturesSectionLandingPage from "@/app/(client)/components/FeaturesSectionLandingPage";

export default function LandingPage() {

  return (
    <div className="flex flex-col items-center">
      
      {/* HERO SECTION */}
      <HeroSectionLandingPage />

      {/* FEATURES SECTION */}
      <FeaturesSectionLandingPage />

    </div>
  );
}
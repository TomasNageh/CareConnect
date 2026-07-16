import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { SpecialtiesSection } from '../components/SpecialtiesSection';
import { FeaturedDoctors } from '../components/FeaturedDoctors';
import { HowItWorks } from '../components/HowItWorks';
import { PromotionsSection } from '../components/PromotionsSection';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <SpecialtiesSection />
        <FeaturedDoctors />
        <HowItWorks />
        <PromotionsSection />
      </main>
      <Footer />
    </div>
  );
}

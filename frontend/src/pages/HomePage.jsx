import { HeroSection } from '../components/HeroSection';
import { FeaturedDoctors } from '../components/FeaturedDoctors';
import { HowItWorks } from '../components/HowItWorks';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDoctors />
      <HowItWorks />
    </>
  );
}

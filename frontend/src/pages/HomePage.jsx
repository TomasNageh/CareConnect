import { HeroSection } from '../components/home/HeroSection';
import { FeaturedDoctors } from '../components/home/FeaturedDoctors';
import { HowItWorks } from '../components/home/HowItWorks';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDoctors />
      <HowItWorks />
    </>
  );
}

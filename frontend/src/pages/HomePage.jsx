import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { SpecialtiesSection } from '../components/home/SpecialtiesSection';
import { FeaturedDoctors } from '../components/home/FeaturedDoctors';
import { HowItWorks } from '../components/home/HowItWorks';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <HeroSection />
      <SpecialtiesSection />
      <FeaturedDoctors />
      <HowItWorks />
    </>
  );
}

import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('specialty', searchQuery);
    if (location) params.append('location', location);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              Find & Book Your Doctor Appointments Online
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with the best doctors and healthcare professionals. Book appointments instantly and get quality care.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search doctors, clinics, or specialties..."
                    className="pl-10 h-12 border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Location"
                    className="pl-10 h-12 border-gray-200"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>

                <Button size="lg" className="w-full h-12" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl text-blue-600 mb-1">5,000+</div>
                <div className="text-sm text-gray-600">Verified Doctors</div>
              </div>
              <div>
                <div className="text-3xl text-blue-600 mb-1">200+</div>
                <div className="text-sm text-gray-600">Specialties</div>
              </div>
              <div>
                <div className="text-3xl text-blue-600 mb-1">100K+</div>
                <div className="text-sm text-gray-600">Happy Patients</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block">
            <ImageWithFallback
              src="https://wallpapers.com/images/hd/physician-suspicious-look-8xnb5oj160eh3qjy.jpg"
              alt="Healthcare Professional"
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


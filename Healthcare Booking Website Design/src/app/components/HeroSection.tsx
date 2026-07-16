import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
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
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Location"
                    className="pl-10 h-12 border-gray-200"
                  />
                </div>

                <Button size="lg" className="w-full h-12">
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
              src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwZG9jdG9yfGVufDF8fHx8MTc2NjMyMzczMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Healthcare Professional"
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

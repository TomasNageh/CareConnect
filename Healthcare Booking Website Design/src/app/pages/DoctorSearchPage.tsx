import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, DollarSign, Calendar, Filter, SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getDoctors } from '../../lib/mockData';
import { Doctor } from '../../lib/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function DoctorSearchPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const allDoctors = getDoctors();
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
  }, []);

  useEffect(() => {
    let filtered = [...doctors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.specialty === specialtyFilter);
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'fee-low') {
      filtered.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sortBy === 'fee-high') {
      filtered.sort((a, b) => b.consultationFee - a.consultationFee);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, specialtyFilter, sortBy, doctors]);

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or specialty..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="fee-low">Lowest Fee</SelectItem>
                <SelectItem value="fee-high">Highest Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <h2 className="text-2xl text-gray-900">
            {filteredDoctors.length} Doctors Found
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Link key={doctor.id} to={`/doctors/${doctor.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={doctor.image || 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd'}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                  {doctor.verified && (
                    <Badge className="absolute top-4 right-4 bg-green-500">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-1">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-blue-600 mb-3">{doctor.specialty}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-900">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      ({doctor.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {doctor.bio}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">${doctor.consultationFee}</span>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria</p>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}

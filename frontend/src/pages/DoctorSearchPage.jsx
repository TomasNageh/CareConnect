import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, MessageCircle, Calendar } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import * as patientAPI from '../services/patient';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function DoctorSearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, [specialtyFilter, locationFilter]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        pageSize: 50,
      };
      
      if (specialtyFilter) params.specialty = specialtyFilter;
      if (locationFilter) params.location = locationFilter;

      const response = await patientAPI.searchDoctors(params);
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.firstName?.toLowerCase().includes(query) ||
      doc.lastName?.toLowerCase().includes(query) ||
      doc.specialty?.toLowerCase().includes(query)
    );
  });

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));

  return (
    <div className="bg-gray-50">
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
            <div>
              <select
                className="w-full h-9 rounded-md border border-input bg-input-background px-3 text-sm"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={doctor.profileImageUrl || 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd'}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-64 object-cover object-top"
                  />
                  {doctor.isVerified && (
                    <Badge className="absolute top-4 right-4 bg-green-500">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl text-gray-900 mb-1">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-blue-600">{doctor.specialty}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-900">{doctor.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    {doctor.clinicLocations && doctor.clinicLocations.length > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.clinicLocations[0]}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {doctor.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-200">
                    <Link to={`/doctors/${doctor.id}`}>
                      <Button size="sm" variant="outline">View Profile</Button>
                    </Link>
                    {isAuthenticated && user && (user.role === 'Patient') && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={async () => {
                            if (!isAuthenticated || !user) {
                              toast.error('Please login to chat with doctors');
                              navigate('/login');
                              return;
                            }
                            const userRole = user.role.toLowerCase();
                            if (userRole !== 'patient') {
                              toast.error('Only patients can chat with doctors');
                              return;
                            }
                            // Navigate to chat page with doctor's userId and name
                            navigate('/chat', { 
                              state: { 
                                doctorUserId: doctor.userId,
                                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`
                              } 
                            });
                          }}
                          className="gap-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/booking/${doctor.id}`)}
                          className="gap-1"
                        >
                          <Calendar className="w-4 h-4" />
                          Book
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No doctors found</p>
          </Card>
        )}
      </div>
</div>
  );
}

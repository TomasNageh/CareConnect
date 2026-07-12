import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, Mail, Clock, Calendar, Building2, Star } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import * as patientAPI from '../services/patient';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function ClinicSearchPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadClinics();
  }, [locationFilter]);

  const loadClinics = async () => {
    try {
      setLoading(true);
      // Since there's no direct clinic search endpoint, we'll get clinics from doctors
      const params = {
        page: 1,
        pageSize: 100,
      };
      
      if (locationFilter) params.location = locationFilter;

      const response = await patientAPI.searchDoctors(params);
      const doctors = response.doctors || [];
      
      // Extract clinics from doctors (using the Clinics array from search response)
      const clinicMap = new Map();
      doctors.forEach(doctor => {
        if (doctor.clinics && doctor.clinics.length > 0) {
          doctor.clinics.forEach((clinic) => {
            if (!clinicMap.has(clinic.id)) {
              clinicMap.set(clinic.id, {
                id: clinic.id,
                name: clinic.name,
                doctorId: doctor.id,
                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                specialty: doctor.specialty,
                location: `${clinic.city}, ${clinic.country}`,
                address: clinic.address,
                city: clinic.city,
                country: clinic.country,
                phoneNumber: clinic.phoneNumber,
                email: clinic.email,
                rating: doctor.rating,
                isVerified: clinic.isVerified,
                profileImageUrl: doctor.profileImageUrl,
              });
            }
          });
        }
      });
      
      setClinics(Array.from(clinicMap.values()));
    } catch (error) {
      console.error('Error loading clinics:', error);
      toast.error('Failed to load clinics');
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClinics = clinics.filter((clinic) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      clinic.name?.toLowerCase().includes(query) ||
      clinic.doctorName?.toLowerCase().includes(query) ||
      clinic.specialty?.toLowerCase().includes(query) ||
      clinic.location?.toLowerCase().includes(query)
    );
  });

  const handleBookAppointment = (clinic) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    
    const userRole = user.role.toLowerCase();
    if (userRole !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }
    
    navigate(`/booking/${clinic.doctorId}`);
  };

  const handleViewClinic = (clinic) => {
    // Navigate to clinic details page
    navigate(`/clinics/${clinic.id}`);
  };

  return (
    <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Find Clinics</h1>
          <p className="text-gray-600">Search for clinics and book appointments</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by clinic name, doctor, or specialty..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading clinics...</p>
          </div>
        ) : filteredClinics.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {clinic.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{clinic.doctorName}</p>
                    <p className="text-sm text-blue-600">{clinic.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-700">
                        {clinic.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{clinic.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 border-t">
                  <div>
                    {clinic.isVerified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewClinic(clinic)}
                    >
                      View Details
                    </Button>
                    {isAuthenticated && user && (user.role === 'Patient') && (
                      <Button 
                        size="sm"
                        onClick={() => handleBookAppointment(clinic)}
                        className="gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Book
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No clinics found</p>
          </Card>
        )}
      </div>
</div>
  );
}


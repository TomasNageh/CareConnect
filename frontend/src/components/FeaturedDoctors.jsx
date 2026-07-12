import { Star, MapPin, Calendar, MessageCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as patientAPI from '../services/patient';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function FeaturedDoctors() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedDoctors();
  }, []);

  const loadFeaturedDoctors = async () => {
    try {
      const response = await patientAPI.searchDoctors({ page: 1, pageSize: 3, minRating: 4.5 });
      if (response.doctors) {
        setDoctors(response.doctors.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading featured doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/doctors');
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading featured doctors...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl text-gray-900 mb-3">Featured Doctors</h2>
            <p className="text-lg text-gray-600">Top-rated healthcare professionals</p>
          </div>
          <Button variant="outline" onClick={handleViewAll}>View All</Button>
        </div>

        {doctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
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
          <div className="text-center py-12">
            <p className="text-gray-600">No featured doctors available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Award, Calendar, DollarSign, Clock, Phone, Mail } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getDoctors, getReviews, getClinics } from '../../lib/mockData';
import { Doctor, Review, Clinic } from '../../lib/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContext';

export default function DoctorProfilePage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    if (doctorId) {
      const docs = getDoctors();
      const foundDoctor = docs.find(d => d.id === doctorId) || null;
      setDoctor(foundDoctor);

      const allReviews = getReviews();
      setReviews(allReviews.filter(r => r.doctorId === doctorId));

      const allClinics = getClinics();
      setClinics(allClinics.filter(c => c.doctorId === doctorId));
    }
  }, [doctorId]);

  const handleBookAppointment = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      alert('Only patients can book appointments');
      return;
    }
    navigate(`/booking/${doctorId}`);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Doctor not found</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Header */}
        <Card className="p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ImageWithFallback
                src={doctor.image || 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd'}
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl text-gray-900 mb-2">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h1>
                  <p className="text-xl text-blue-600 mb-2">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 mb-4">
                    {doctor.verified && (
                      <Badge className="bg-green-500">Verified</Badge>
                    )}
                    <Badge variant="outline">License: {doctor.license}</Badge>
                  </div>
                </div>
                <Button size="lg" onClick={handleBookAppointment} className="gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl text-gray-900">{doctor.rating}</span>
                  <span className="text-gray-600">({doctor.reviewCount} reviews)</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">${doctor.consultationFee} consultation</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{doctor.phone || '+1 (555) 000-0000'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{doctor.email}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="clinics">Clinics ({clinics.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Biography</h2>
              <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-900">{review.rating}/5</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-600">No reviews yet</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clinics">
            <div className="space-y-4">
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <Card key={clinic.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl text-gray-900 mb-2">{clinic.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.address}, {clinic.city}, {clinic.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{clinic.phone}</span>
                        </div>
                      </div>
                      {clinic.verified && (
                        <Badge className="bg-green-500">Verified</Badge>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-600">No clinics listed</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

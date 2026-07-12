import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Award, Calendar, DollarSign, Clock, Phone, Mail, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import * as patientAPI from '../services/patient';
import { toast } from 'sonner';

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (doctorId) {
      loadDoctorData();
      loadReviews();
      if (user && (user.role === 'Patient')) {
        loadMyReview();
      }
    }
  }, [doctorId, user]);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      // Search for the doctor by ID
      const response = await patientAPI.searchDoctors({ page: 1, pageSize: 100 });
      const foundDoctor = response.doctors?.find(d => d.id === parseInt(doctorId));
      
      if (foundDoctor) {
        setDoctor(foundDoctor);
        // Set clinics from the search response
        if (foundDoctor.clinics && foundDoctor.clinics.length > 0) {
          setClinics(foundDoctor.clinics);
        }
      } else {
        toast.error('Doctor not found');
      }
    } catch (error) {
      console.error('Error loading doctor:', error);
      toast.error('Failed to load doctor information');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await patientAPI.getDoctorReviews(parseInt(doctorId), 1, 10);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadMyReview = async () => {
    try {
      const data = await patientAPI.getMyReviewForDoctor(parseInt(doctorId));
      setMyReview(data);
      setRating(data.rating);
      setComment(data.comment || '');
    } catch (error) {
      // Not found is okay - means patient hasn't reviewed yet
      if (error.response?.status !== 404) {
        console.error('Error loading my review:', error);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'Patient' && user.role !== 'patient') {
      toast.error('Only patients can rate doctors');
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      if (myReview) {
        // Update existing review
        await patientAPI.updateReview(myReview.id, { rating, comment });
        toast.success('Review updated successfully');
      } else {
        // Create new review
        await patientAPI.addReview({
          doctorId: parseInt(doctorId),
          rating,
          comment
        });
        toast.success('Review added successfully');
      }
      setRatingDialogOpen(false);
      loadReviews();
      loadMyReview();
      loadDoctorData(); // Reload to update average rating
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChat = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userRole = user.role.toLowerCase();
    if (userRole !== 'patient') {
      toast.error('Only patients can chat with doctors');
      return;
    }
    // Navigate to chat page with doctor's userId and name
    if (doctor && doctor.userId) {
      navigate('/chat', { 
        state: { 
          doctorUserId: doctor.userId,
          doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`
        } 
      });
    } else {
      toast.error('Doctor information not available');
    }
  };

  const handleBookAppointment = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'Patient' && user.role !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }
    navigate(`/booking/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading...</p>
          </Card>
        </div>
</div>
    );
  }

  if (!doctor) {
    return (
      <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Doctor not found</p>
          </Card>
        </div>
</div>
    );
  }

  return (
    <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Header */}
        <Card className="p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ImageWithFallback
                src={doctor.profileImageUrl || 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd'}
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                className="w-full h-64 object-cover object-top rounded-lg"
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
                    {doctor.isVerified && (
                      <Badge className="bg-green-500">Verified</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {user && (user.role === 'Patient') && (
                    <Button size="lg" variant="outline" onClick={handleChat} className="gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Chat
                    </Button>
                  )}
                  <Button size="lg" onClick={handleBookAppointment} className="gap-2">
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl text-gray-900">{doctor.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>

              {doctor.clinicLocations && doctor.clinicLocations.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.clinicLocations[0]}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Biography</h2>
              <p className="text-gray-700 leading-relaxed">{doctor.bio || 'No biography available.'}</p>
            </Card>
          </TabsContent>

          <TabsContent value="clinics">
            {clinics && clinics.length > 0 ? (
              <div className="space-y-4">
                {clinics.map((clinic) => (
                  <Card 
                    key={clinic.id} 
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/clinics/${clinic.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-2">{clinic.name}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{clinic.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>{clinic.city}, {clinic.country}</span>
                          </div>
                          {clinic.phoneNumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{clinic.phoneNumber}</span>
                            </div>
                          )}
                          {clinic.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{clinic.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/clinics/${clinic.id}`);
                            }}
                            className="gap-2"
                          >
                            View Details
                          </Button>
                          {user && (user.role === 'Patient') && (
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/booking/${doctorId}`, { state: { clinicId: clinic.id } });
                              }}
                              className="gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Book Appointment
                            </Button>
                          )}
                        </div>
                      </div>
                      {clinic.isVerified && (
                        <Badge className="bg-green-500">Verified</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No clinics listed</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Reviews & Ratings</h2>
                {user && (user.role === 'Patient') && (
                  <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Star className="w-4 h-4 mr-2" />
                        {myReview ? 'Edit My Review' : 'Rate This Doctor'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{myReview ? 'Edit Your Review' : 'Rate This Doctor'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Comment (Optional)</label>
                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => setRatingDialogOpen(false)}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitReview} disabled={submitting}>
                            {submitting ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.patientName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet. Be the first to rate this doctor!</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
</div>
  );
}

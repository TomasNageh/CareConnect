import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, CheckCircle, Calendar, Star, User } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import * as patientAPI from '../services/patient';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { toast } from 'sonner';

export default function ClinicPage() {
  const { clinicId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to convert day number to day name
  const getDayName = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // dayOfWeek can be a number (0-6) or a string
    const dayIndex = typeof dayOfWeek === 'string' ? parseInt(dayOfWeek) : dayOfWeek;
    return days[dayIndex] || dayOfWeek;
  };

  // Helper function to format time (remove seconds if present)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // If it's in format "HH:mm:ss", remove seconds
    if (timeString.includes(':') && timeString.split(':').length === 3) {
      return timeString.substring(0, 5); // Returns "HH:mm"
    }
    return timeString;
  };

  useEffect(() => {
    if (clinicId) {
      loadClinicData();
    }
  }, [clinicId]);

  const loadClinicData = async () => {
    try {
      setLoading(true);
      const data = await patientAPI.getClinic(parseInt(clinicId));
      setClinic(data);
    } catch (error) {
      console.error('Error loading clinic:', error);
      toast.error('Failed to load clinic information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
</div>
    );
  }

  if (!clinic) {
    return (
      <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Clinic not found</p>
          </Card>
        </div>
</div>
    );
  }

  return (
    <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Info Card */}
        {clinic.doctorName && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4">
              {clinic.doctorProfileImageUrl && (
                <ImageWithFallback
                  src={clinic.doctorProfileImageUrl}
                  alt={clinic.doctorName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{clinic.doctorName}</h2>
                <p className="text-blue-600">{clinic.doctorSpecialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-700">{clinic.doctorRating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate(`/doctors/${clinic.doctorId}`)}>
                View Doctor Profile
              </Button>
            </div>
          </Card>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl text-gray-900">{clinic.name}</h1>
            {clinic.isVerified && (
              <Badge className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">{clinic.address}</p>
                  <p className="text-gray-600">{clinic.city}, {clinic.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{clinic.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{clinic.email}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl text-gray-900 mb-4">Operating Hours</h2>
            {clinic.operatingHours && clinic.operatingHours.length > 0 ? (
              <div className="space-y-2">
                {clinic.operatingHours.map((hours) => (
                  <div key={hours.id} className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-700 font-medium">{getDayName(hours.dayOfWeek)}</span>
                    {hours.isClosed ? (
                      <span className="text-red-600">Closed</span>
                    ) : (
                      <span className="text-gray-900">
                        {formatTime(hours.startTime)} - {formatTime(hours.endTime)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No operating hours set</p>
            )}
          </Card>
        </div>

        {clinic.locationEmbedCode && (
          <Card className="p-6 mt-6">
            <h2 className="text-xl text-gray-900 mb-4">Location</h2>
            <div className="w-full rounded-lg overflow-hidden">
              <div
                dangerouslySetInnerHTML={{ __html: clinic.locationEmbedCode }}
                className="w-full [&>iframe]:w-full [&>iframe]:max-w-full [&>iframe]:h-64 [&>iframe]:border-0 [&>iframe]:block"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </Card>
        )}

        {/* Book Appointment Button for Patients */}
        {user && (user.role === 'Patient') && clinic && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl text-gray-900 mb-2">Ready to Book?</h3>
                <p className="text-gray-600">Book an appointment at this clinic</p>
              </div>
              <Button 
                size="lg"
                onClick={() => {
                  if (clinic.doctorId) {
                    navigate(`/booking/${clinic.doctorId}`, { state: { clinicId: clinic.id } });
                  } else {
                    toast.error('Doctor information not available');
                  }
                }}
                className="gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Button>
            </div>
          </Card>
        )}
      </div>
</div>
  );
}

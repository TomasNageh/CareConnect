import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { useAuth } from '../contexts/AuthContext';
import * as patientAPI from '../services/patient';
import { toast } from 'sonner';

export default function BookingFlow() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (doctorId) {
      loadDoctorData();
    }
  }, [doctorId]);

  useEffect(() => {
    if (doctorId && selectedClinic && selectedDate) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [doctorId, selectedClinic, selectedDate]);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.searchDoctors({ page: 1, pageSize: 100 });
      const foundDoctor = response.doctors?.find(d => d.id === parseInt(doctorId));
      
      if (foundDoctor) {
        setDoctor(foundDoctor);
        // Extract clinics from doctor data
        if (foundDoctor.clinics && foundDoctor.clinics.length > 0) {
          setClinics(foundDoctor.clinics);
        } else if (foundDoctor.clinicLocations && foundDoctor.clinicLocations.length > 0) {
          // Fallback to clinic locations if clinics array not available
          setClinics([{ 
            id: 1,
            name: 'Main Clinic', 
            address: foundDoctor.clinicLocations[0] 
          }]);
        } else {
          toast.warning('This doctor has no clinics set up yet. Please contact the doctor directly.');
          setClinics([]);
        }
      } else {
        toast.error('Doctor not found');
        navigate('/doctors');
      }
    } catch (error) {
      console.error('Error loading doctor:', error);
      toast.error('Failed to load doctor information');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const slots = await patientAPI.getAvailableSlots(parseInt(doctorId), selectedClinic?.id, dateStr);
      setAvailableSlots(slots || []);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirm = async () => {
    if (!user || !doctor || !selectedClinic || !selectedDate || !selectedSlot) {
      toast.error('Please complete all fields');
      return;
    }

    try {
      setSubmitting(true);

      const appointmentData = {
        clinicId: selectedClinic.id,
        slotId: selectedSlot.slotId,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        patientNotes: notes || null,
      };

      await patientAPI.bookAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/dashboard/patient');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to book appointment';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (timeString) => {
    // Convert "HH:mm:ss" or "HH:mm" to "HH:MM AM/PM"
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes.padStart(2, '0')} ${period}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-50">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading...</p>
          </Card>
        </div>
</div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="bg-gray-50">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Select Clinic</span>
            <span className="text-sm text-gray-600">Choose Date</span>
            <span className="text-sm text-gray-600">Select Time</span>
            <span className="text-sm text-gray-600">Confirm</span>
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Select Clinic */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">Select a Clinic</h2>
              {clinics.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {clinics.map((clinic) => (
                      <Card
                        key={clinic.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedClinic?.id === clinic.id ? 'border-blue-600 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedClinic(clinic)}
                      >
                        <h3 className="text-lg text-gray-900 mb-2">{clinic.name}</h3>
                        <p className="text-gray-600">{clinic.address}</p>
                      </Card>
                    ))}
                  </div>
                  <Button onClick={() => setStep(2)} disabled={!selectedClinic} className="mt-6 w-full">
                    Continue
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    This doctor has not set up any clinics yet. Please contact the doctor directly to book an appointment.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/doctors')}>
                    Back to Doctors
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">Choose a Date</h2>
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDate} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">Select Time Slot</h2>
              {loadingSlots ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading available slots...</p>
                </div>
              ) : availableSlots.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.slotId}
                        variant={selectedSlot?.slotId === slot.slotId ? 'default' : 'outline'}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={slot.disabled}
                        className={slot.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    No available slots for this date. Please select another date or contact the doctor.
                  </p>
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Change Date
                  </Button>
                </div>
              )}
              <div className="mt-6">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or symptoms..."
                  rows={4}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(4)} disabled={!selectedSlot} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">Confirm Booking</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Doctor</span>
                  <span className="text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Specialty</span>
                  <span className="text-gray-900">{doctor.specialty}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Clinic</span>
                  <span className="text-gray-900">{selectedClinic?.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="text-gray-900">
                    {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : 'Not selected'}
                  </span>
                </div>
                {selectedSlot?.petName && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Pet Name</span>
                    <span className="text-gray-900">{selectedSlot.petName}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} disabled={submitting} className="flex-1 gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
</div>
  );
}

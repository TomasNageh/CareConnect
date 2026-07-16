import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { getDoctors, getClinics, getAppointments } from '../../lib/mockData';
import { Doctor, Clinic, Appointment } from '../../lib/types';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function BookingFlow() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  useEffect(() => {
    if (doctorId) {
      const docs = getDoctors();
      const foundDoctor = docs.find(d => d.id === doctorId) || null;
      setDoctor(foundDoctor);

      const allClinics = getClinics();
      setClinics(allClinics.filter(c => c.doctorId === doctorId));
    }
  }, [doctorId]);

  const handleConfirm = () => {
    if (!user || !doctor || !selectedClinic || !selectedDate || !selectedTime) {
      toast.error('Please complete all fields');
      return;
    }

    const appointments = getAppointments();
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: user.id,
      doctorId: doctor.id,
      clinicId: selectedClinic,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'Confirmed',
      notes,
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);
    localStorage.setItem('medicare_appointments', JSON.stringify(appointments));
    
    toast.success('Appointment booked successfully!');
    navigate('/dashboard/patient');
  };

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div className={`w-24 h-1 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />
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
              <div className="space-y-4">
                {clinics.map((clinic) => (
                  <Card
                    key={clinic.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedClinic === clinic.id ? 'border-blue-600 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedClinic(clinic.id)}
                  >
                    <h3 className="text-lg text-gray-900 mb-2">{clinic.name}</h3>
                    <p className="text-gray-600">{clinic.address}, {clinic.city}</p>
                  </Card>
                ))}
              </div>
              <Button onClick={() => setStep(2)} disabled={!selectedClinic} className="mt-6 w-full">
                Continue
              </Button>
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
                  onSelect={setSelectedDate}
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
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
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
                <Button onClick={() => setStep(4)} disabled={!selectedTime} className="flex-1">
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
                  <span className="text-gray-900">
                    {clinics.find(c => c.id === selectedClinic)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="text-gray-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="text-gray-900">${doctor.consultationFee}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1 gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
}

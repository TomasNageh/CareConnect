import { useState, useEffect } from 'react';
import { Calendar, FileText, Star, Bell } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { getAppointments, getDoctors } from '../../lib/mockData';
import { Appointment, Doctor } from '../../lib/types';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (user) {
      const allAppointments = getAppointments();
      setAppointments(allAppointments.filter(a => a.patientId === user.id));
      setDoctors(getDoctors());
    }
  }, [user]);

  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'Completed');

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Upcoming Appointments</p>
                <p className="text-3xl text-blue-600">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Past Visits</p>
                <p className="text-3xl text-green-600">{pastAppointments.length}</p>
              </div>
              <FileText className="w-12 h-12 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Notifications</p>
                <p className="text-3xl text-orange-600">0</p>
              </div>
              <Bell className="w-12 h-12 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-gray-900 mb-4">Upcoming Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <Card key={apt.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg text-gray-900 mb-2">{getDoctorName(apt.doctorId)}</h4>
                            <p className="text-gray-600 mb-1">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                            {apt.notes && <p className="text-sm text-gray-500">Notes: {apt.notes}</p>}
                          </div>
                          <Badge className="bg-green-500">Confirmed</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-gray-600">No upcoming appointments</p>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="text-xl text-gray-900 mb-4">Past Appointments</h3>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((apt) => (
                      <Card key={apt.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg text-gray-900 mb-2">{getDoctorName(apt.doctorId)}</h4>
                            <p className="text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-gray-600">No past appointments</p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-6">
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medical records available</p>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Name</span>
                  <span className="text-gray-900">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phone</span>
                  <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Address</span>
                  <span className="text-gray-900">{user?.address || 'Not provided'}</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

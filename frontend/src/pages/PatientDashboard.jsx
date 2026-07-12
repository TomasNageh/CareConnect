import { useState, useEffect } from 'react';
import { Calendar, FileText, Star, Bell } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import * as patientAPI from '../services/patient';
import { toast } from 'sonner';
import { AppointmentStatus } from '../services/types';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [apptsData, historyData, notifsData, profileData] = await Promise.all([
        patientAPI.getAppointments().catch(() => []),
        patientAPI.getMedicalHistory().catch(() => []),
        patientAPI.getNotifications().catch(() => ({ notifications: [] })),
        patientAPI.getProfile().catch(() => null),
      ]);

      setAppointments(apptsData || []);
      setMedicalHistory(historyData || []);
      setNotifications(notifsData.notifications || []);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    a => a.status === AppointmentStatus.CONFIRMED && 
    new Date(a.appointmentDate) >= new Date()
  );
  const pastAppointments = appointments.filter(
    a => a.status === AppointmentStatus.COMPLETED || 
    (a.status === AppointmentStatus.CONFIRMED && new Date(a.appointmentDate) < new Date())
  );

  const handleCancelAppointment = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await patientAPI.cancelAppointment(id);
      toast.success('Appointment cancelled successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to cancel appointment');
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

  return (
    <div className="bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.firstName || user?.firstName || 'User'}!</p>
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
                <p className="text-3xl text-orange-600">{notifications.filter(n => !n.isRead).length}</p>
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
                            <h4 className="text-lg text-gray-900 mb-2">{apt.doctorName}</h4>
                            <p className="text-gray-600 mb-1">
                              {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.startTime}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">Clinic: {apt.clinicName}</p>
                            {apt.notes && <p className="text-sm text-gray-500">Notes: {apt.notes}</p>}
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Badge className="bg-green-500">Confirmed</Badge>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </button>
                          </div>
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
                            <h4 className="text-lg text-gray-900 mb-2">{apt.doctorName}</h4>
                            <p className="text-gray-600">
                              {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.startTime}
                            </p>
                            <p className="text-sm text-gray-500">Clinic: {apt.clinicName}</p>
                          </div>
                          <Badge variant="outline">
                            {apt.status === AppointmentStatus.COMPLETED ? 'Completed' : 'Past'}
                          </Badge>
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
            {medicalHistory.length > 0 ? (
              <div className="space-y-4">
                {medicalHistory.map((record) => (
                  <Card key={record.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg text-gray-900 mb-1">{record.doctorName}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(record.visitDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {record.diagnosis && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                        <p className="text-sm text-gray-600">{record.diagnosis}</p>
                      </div>
                    )}
                    {record.treatment && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Treatment:</p>
                        <p className="text-sm text-gray-600">{record.treatment}</p>
                      </div>
                    )}
                    {record.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No medical records available</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Name</span>
                  <span className="text-gray-900">
                    {profile?.firstName || user?.firstName} {profile?.lastName || user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phone</span>
                  <span className="text-gray-900">{profile?.phoneNumber || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Address</span>
                  <span className="text-gray-900">{profile?.address || 'Not provided'}</span>
                </div>
                {profile?.dateOfBirth && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Date of Birth</span>
                    <span className="text-gray-900">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
</div>
  );
}

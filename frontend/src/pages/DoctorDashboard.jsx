import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Bell, Clock, MapPin, Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import * as doctorAPI from '../services/doctor';
import { toast } from 'sonner';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createClinicDialogOpen, setCreateClinicDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const [clinicForm, setClinicForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    email: '',
    locationEmbedCode: '',
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  useEffect(() => {
    // Check if we should navigate to clinics tab
    if (location.state?.tab === 'clinics') {
      setActiveTab('clinics');
    }
  }, [location.state]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, profileData, clinicsData, notifsData] = await Promise.all([
        doctorAPI.getDashboard().catch(() => null),
        doctorAPI.getProfile().catch(() => null),
        doctorAPI.getMyClinics().catch(() => []),
        doctorAPI.getNotifications().catch(() => ({ notifications: [] })),
      ]);

      setDashboardData(dashboard);
      setProfile(profileData);
      setClinics(clinicsData || []);
      setNotifications(notifsData.notifications || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClinic = async () => {
    try {
      if (!clinicForm.name || !clinicForm.address || !clinicForm.city || !clinicForm.country) {
        toast.error('Please fill in all required fields');
        return;
      }

      const newClinic = await doctorAPI.createClinic(clinicForm);
      toast.success('Clinic created successfully! It will be verified by an admin.');
      setCreateClinicDialogOpen(false);
      setClinicForm({
        name: '',
        address: '',
        city: '',
        country: '',
        phoneNumber: '',
        email: '',
        locationEmbedCode: '',
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating clinic:', error);
      toast.error(error.response?.data?.message || 'Failed to create clinic');
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
          <h1 className="text-3xl text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dr. {profile?.firstName || user?.firstName || 'Doctor'}!</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Today's Appointments</p>
                <p className="text-3xl text-blue-600">{dashboardData?.totalAppointmentsToday || 0}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">This Week</p>
                <p className="text-3xl text-green-600">{dashboardData?.totalAppointmentsThisWeek || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Patients</p>
                <p className="text-3xl text-purple-600">{dashboardData?.totalPatients || 0}</p>
              </div>
              <Users className="w-12 h-12 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Rating</p>
                <p className="text-3xl text-orange-600">{dashboardData?.averageRating?.toFixed(1) || '0.0'}</p>
              </div>
              <Bell className="w-12 h-12 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="clinics">My Clinics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-6">
            <div className="space-y-4">
              {dashboardData?.upcomingAppointments && dashboardData.upcomingAppointments.length > 0 ? (
                dashboardData.upcomingAppointments.map((apt) => (
                  <Card key={apt.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg text-gray-900 mb-2">{apt.patientName}</h4>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{apt.startTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{apt.clinicName}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Confirmed</Badge>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-600">No upcoming appointments</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clinics" className="mt-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl text-gray-900">My Clinics</h3>
              <Button onClick={() => setCreateClinicDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Clinic
              </Button>
            </div>
            <div className="space-y-4">
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <Card 
                    key={clinic.id} 
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/dashboard/doctor/clinics/${clinic.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-2">{clinic.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.address}, {clinic.city}, {clinic.country}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Phone: {clinic.phoneNumber || 'N/A'}</p>
                          <p>Email: {clinic.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {clinic.isVerified && (
                          <Badge className="bg-green-500">Verified</Badge>
                        )}
                        <Badge variant="outline">{clinic.isVerified ? 'Active' : 'Pending Verification'}</Badge>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-600 mb-4">No clinics registered</p>
                  <Button onClick={() => setCreateClinicDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Clinic
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Name</span>
                  <span className="text-gray-900">
                    Dr. {profile?.firstName || ''} {profile?.lastName || ''}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Specialty</span>
                  <span className="text-gray-900">{profile?.specialty || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">License Number</span>
                  <span className="text-gray-900">{profile?.licenseNumber || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Rating</span>
                  <span className="text-gray-900">{profile?.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Verification Status</span>
                  <Badge className={profile?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}>
                    {profile?.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                {profile?.bio && (
                  <div className="py-2">
                    <p className="text-gray-600 mb-2">Bio</p>
                    <p className="text-gray-900">{profile.bio}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Clinic Dialog */}
      <Dialog open={createClinicDialogOpen} onOpenChange={setCreateClinicDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Clinic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clinic-name">Clinic Name *</Label>
              <Input
                id="clinic-name"
                value={clinicForm.name}
                onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                placeholder="Enter clinic name"
                required
              />
            </div>
            <div>
              <Label htmlFor="clinic-address">Address *</Label>
              <Input
                id="clinic-address"
                value={clinicForm.address}
                onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                placeholder="Street address"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic-city">City *</Label>
                <Input
                  id="clinic-city"
                  value={clinicForm.city}
                  onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clinic-country">Country *</Label>
                <Input
                  id="clinic-country"
                  value={clinicForm.country}
                  onChange={(e) => setClinicForm({ ...clinicForm, country: e.target.value })}
                  placeholder="Country"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic-phone">Phone Number</Label>
                <Input
                  id="clinic-phone"
                  value={clinicForm.phoneNumber}
                  onChange={(e) => setClinicForm({ ...clinicForm, phoneNumber: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="clinic-email">Email</Label>
                <Input
                  id="clinic-email"
                  type="email"
                  value={clinicForm.email}
                  onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                  placeholder="clinic@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="clinic-location">Location Embed Code (Optional)</Label>
              <Textarea
                id="clinic-location"
                value={clinicForm.locationEmbedCode}
                onChange={(e) => setClinicForm({ ...clinicForm, locationEmbedCode: e.target.value })}
                rows={3}
                placeholder="Paste Google Maps embed code here"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can get this from Google Maps by clicking "Share" → "Embed a map"
              </p>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setCreateClinicDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClinic} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Clinic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
</div>
  );
}

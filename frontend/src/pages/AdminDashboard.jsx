import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import * as adminAPI from '../services/admin';
import { toast } from 'sonner';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminPendingTab from '../components/admin/AdminPendingTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminAnalyticsTab from '../components/admin/AdminAnalyticsTab';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [pendingClinics, setPendingClinics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, doctorsData, clinicsData, usersData] = await Promise.all([
        adminAPI.getSystemAnalytics().catch(() => null),
        adminAPI.getPendingDoctors().catch(() => []),
        adminAPI.getPendingClinics().catch(() => []),
        adminAPI.getAllUsers(userFilter === 'all' ? null : userFilter, currentPage, 20).catch(() => ({ users: [], totalCount: 0 })),
      ]);

      setAnalytics(analyticsData);
      setPendingDoctors(doctorsData || []);
      setPendingClinics(clinicsData || []);
      setUsers(usersData.users || []);
      setTotalUsers(usersData.totalCount || 0);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, userFilter, currentPage]);

  const handleVerifyDoctor = async (doctorId) => {
    try {
      await adminAPI.verifyDoctor(doctorId);
      toast.success('Doctor verified successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to verify doctor');
    }
  };

  const handleVerifyClinic = async (clinicId) => {
    try {
      await adminAPI.verifyClinic(clinicId);
      toast.success('Clinic verified successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to verify clinic');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deactivated successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to deactivate user');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await adminAPI.activateUser(userId);
      toast.success('User activated successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to activate user');
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
          <h1 className="text-3xl text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}!</p>
        </div>

        <AdminStatsCards analytics={analytics} />

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">Pending Verifications</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AdminOverviewTab
              analytics={analytics}
              pendingDoctors={pendingDoctors}
              pendingClinics={pendingClinics}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <AdminPendingTab
              pendingDoctors={pendingDoctors}
              pendingClinics={pendingClinics}
              onVerifyDoctor={handleVerifyDoctor}
              onVerifyClinic={handleVerifyClinic}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsersTab
              users={users}
              totalUsers={totalUsers}
              userFilter={userFilter}
              userSearch={userSearch}
              currentPage={currentPage}
              onFilterChange={(value) => {
                setUserFilter(value);
                setCurrentPage(1);
              }}
              onSearchChange={setUserSearch}
              onPageChange={setCurrentPage}
              onDeactivateUser={handleDeactivateUser}
              onActivateUser={handleActivateUser}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AdminAnalyticsTab analytics={analytics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

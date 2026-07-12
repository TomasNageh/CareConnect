import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorSearchPage from './pages/DoctorSearchPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ClinicSearchPage from './pages/ClinicSearchPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorClinicDetailsPage from './pages/DoctorClinicDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import ClinicPage from './pages/ClinicPage';
import ChatPage from './pages/ChatPage';
import BookingFlow from './pages/BookingFlow';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user) {
    const userRole = user.role.toLowerCase();
    const hasAccess = allowedRoles.some((role) => role.toLowerCase() === userRole);

    if (!hasAccess) {
      if (userRole === 'patient') {
        return <Navigate to="/" replace />;
      } else if (userRole === 'doctor') {
        return <Navigate to="/dashboard/doctor" replace />;
      } else if (userRole === 'admin') {
        return <Navigate to="/dashboard/admin" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

function PublicRoute({ children, allowAuthenticated = false }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!allowAuthenticated && isAuthenticated && user) {
    const role = user.role.toLowerCase();
    if (role === 'patient') {
      return <Navigate to="/" replace />;
    } else if (role === 'doctor') {
      return <Navigate to="/dashboard/doctor" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    }
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorSearchPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
        <Route path="/clinics" element={<ClinicSearchPage />} />
        <Route path="/clinics/:clinicId" element={<ClinicPage />} />
        <Route
          path="/booking/:doctorId"
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <BookingFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/clinics/:clinicId"
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <DoctorClinicDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={['Patient', 'Doctor']}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

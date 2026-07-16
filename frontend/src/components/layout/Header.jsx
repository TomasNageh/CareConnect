import { Search, MapPin, Menu, Heart, Calendar, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Navbar } from './Navbar';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    const role = user.role.toLowerCase();
    if (role === 'patient') return '/dashboard/patient';
    if (role === 'doctor') return '/dashboard/doctor';
    if (role === 'admin') return '/dashboard/admin';
    return '/';
  };

  const getUserRole = () => {
    if (!user) return '';
    return user.role.toLowerCase();
  };

  const role = getUserRole();
  const isAuthenticated = !!user;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">CareConnect</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3 relative z-50">
              <Navbar />
            </div>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
                Find Doctors
              </Link>
              <Link to="/clinics" className="text-gray-700 hover:text-blue-600 transition-colors">
                Find Clinics
              </Link>
              <a href="#specialties" className="text-gray-700 hover:text-blue-600 transition-colors">
                Specialties
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About Us
              </a>
            </nav>
          )}

          {/* Desktop Actions - Only show for non-authenticated users */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-3 relative z-50">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>Sign Up</Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Navbar />
              </div>
            ) : (
              <nav className="flex flex-col gap-4">
                <Link to="/doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Find Doctors
                </Link>
                <Link to="/clinics" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Find Clinics
                </Link>
                <a href="#specialties" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Specialties
                </a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About Us
                </a>
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/register')}>Sign Up</Button>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  );
}


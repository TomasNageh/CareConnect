import { Search, MapPin, Menu, Heart, Calendar, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/dashboard/${user.role}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">MediCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
              Find Doctors
            </Link>
            <a href="#specialties" className="text-gray-700 hover:text-blue-600 transition-colors">
              Specialties
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About Us
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <UserIcon className="w-4 h-4" />
                    {user.firstName} {user.lastName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {user.role === 'patient' && (
                    <DropdownMenuItem onClick={() => navigate('/chat')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Messages
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>

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
            <nav className="flex flex-col gap-4">
              <Link to="/doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
                Find Doctors
              </Link>
              <a href="#specialties" className="text-gray-700 hover:text-blue-600 transition-colors">
                Specialties
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About Us
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate(getDashboardLink())}>
                      Dashboard
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      Sign In
                    </Button>
                    <Button onClick={() => navigate('/register')}>Sign Up</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
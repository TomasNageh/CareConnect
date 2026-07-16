import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, Search, Building2, Bell, User as UserIcon, LogOut, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import * as patientAPI from '../../services/patient';
import * as doctorAPI from '../../services/doctor';
import { toast } from 'sonner';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const role = user.role.toLowerCase();
      let data;
      
      if (role === 'patient') {
        data = await patientAPI.getNotifications(1, 10);
      } else if (role === 'doctor') {
        data = await doctorAPI.getNotifications(1, 10);
      } else {
        return;
      }
      
      setNotifications(data.notifications || []);
      setUnreadCount((data.notifications || []).filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

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

  const handleMarkAsRead = async (notificationId) => {
    try {
      const role = user.role.toLowerCase();
      if (role === 'patient') {
        await patientAPI.markNotificationRead(notificationId);
      } else if (role === 'doctor') {
        await doctorAPI.markNotificationRead(notificationId);
      }
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getUserRole = () => {
    if (!user) return '';
    return user.role.toLowerCase();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    const role = getUserRole();
    if (role === 'patient') return '/dashboard/patient';
    if (role === 'doctor') return '/dashboard/doctor';
    if (role === 'admin') return '/dashboard/admin';
    return '/';
  };

  const role = getUserRole();

  // Patient Navigation
  if (role === 'patient') {
    return (
      <nav className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link
          to="/dashboard/patient"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Messages
        </Link>
        <Link
          to="/doctors"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Search className="w-4 h-4" />
          Find Doctors
        </Link>
        <Link
          to="/clinics"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Building2 className="w-4 h-4" />
          Find Clinics
        </Link>
        
        {/* Notifications */}
        <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="p-2 font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onSelect={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <UserIcon className="w-4 h-4" />
              <span>{user?.firstName || user?.username} {user?.lastName || ''}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  }

  // Doctor Navigation
  if (role === 'doctor') {
    return (
      <nav className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <Link
          to="/dashboard/doctor"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Messages
        </Link>
        <button
          onClick={() => {
            navigate('/dashboard/doctor', { state: { tab: 'clinics' } });
          }}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Building2 className="w-4 h-4" />
          My Clinics
        </button>
        
        {/* Notifications */}
        <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="p-2 font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onSelect={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <UserIcon className="w-4 h-4" />
              <span>{user?.firstName || user?.username} {user?.lastName || ''}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  }

  // Admin Navigation - keep existing header behavior or add admin-specific nav
  if (role === 'admin') {
    return (
      <nav className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <Link
          to="/dashboard/admin"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <UserIcon className="w-4 h-4" />
              <span>{user?.firstName || user?.username} {user?.lastName || ''}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  }

  // Not logged in - return null (handled by Header)
  return null;
}


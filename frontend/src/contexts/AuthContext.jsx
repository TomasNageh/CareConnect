import { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../services/auth.js';

const AuthContext = createContext(undefined);

function normalizeRole(role) {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function buildUser(response, extra = {}) {
  const role = normalizeRole(response.role);
  return {
    id: response.userId,
    userId: response.userId,
    username: response.username,
    email: response.email,
    role,
    firstName: extra.firstName || '',
    lastName: extra.lastName || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const userData = buildUser(response);

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    return true;
  };

  const register = async (formData, role) => {
    let response;

    if (role === 'Patient') {
      response = await authAPI.registerPatient(formData);
    } else if (role === 'Doctor') {
      response = await authAPI.registerDoctor(formData);
    } else if (role === 'Admin') {
      response = await authAPI.registerAdmin(formData);
    } else {
      throw new Error('Invalid role');
    }

    const userData = buildUser(response, {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
    });

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

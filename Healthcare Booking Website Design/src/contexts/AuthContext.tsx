import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../lib/types';
import { getUsers, initializeMockData } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    // Check for existing session
    const sessionUser = localStorage.getItem('medicare_current_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email);

    // Demo: password is "password" for all users
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('medicare_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const users = getUsers();
    
    // Check if email exists
    if (users.some(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: `${userData.role}-${Date.now()}`,
      username: userData.username || '',
      email: userData.email || '',
      role: userData.role || 'patient',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('medicare_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('medicare_current_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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

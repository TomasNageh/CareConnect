import { User, Doctor, Patient, Clinic, Appointment, Review, MedicalRecord, Notification, DoctorAvailability } from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@medicare.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'patient',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York',
    dateOfBirth: '1990-05-15',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    medicalHistory: [],
  },
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: 'doctor-1',
    username: 'dr_sarah',
    email: 'sarah@medicare.com',
    role: 'doctor',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialty: 'Cardiology',
    license: 'MD-12345',
    bio: 'Board-certified cardiologist with 15 years of experience specializing in preventive cardiology and heart disease management.',
    verified: true,
    rating: 4.9,
    reviewCount: 127,
    consultationFee: 150,
    phone: '+1 (555) 234-5678',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a',
  },
  {
    id: 'doctor-2',
    username: 'dr_michael',
    email: 'michael@medicare.com',
    role: 'doctor',
    firstName: 'Michael',
    lastName: 'Chen',
    specialty: 'Neurology',
    license: 'MD-23456',
    bio: 'Expert neurologist specializing in migraine treatment, stroke prevention, and neurological disorders.',
    verified: true,
    rating: 4.8,
    reviewCount: 98,
    consultationFee: 175,
    phone: '+1 (555) 345-6789',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1575654402720-0af3480d1fad',
  },
  {
    id: 'doctor-3',
    username: 'dr_emily',
    email: 'emily@medicare.com',
    role: 'doctor',
    firstName: 'Emily',
    lastName: 'Williams',
    specialty: 'Pediatrics',
    license: 'MD-34567',
    bio: 'Compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence.',
    verified: true,
    rating: 5.0,
    reviewCount: 145,
    consultationFee: 120,
    phone: '+1 (555) 456-7890',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1758691463331-2ac00e6f676f',
  },
  {
    id: 'doctor-4',
    username: 'dr_david',
    email: 'david@medicare.com',
    role: 'doctor',
    firstName: 'David',
    lastName: 'Martinez',
    specialty: 'Orthopedics',
    license: 'MD-45678',
    bio: 'Orthopedic surgeon specializing in sports medicine, joint replacement, and fracture care.',
    verified: true,
    rating: 4.7,
    reviewCount: 89,
    consultationFee: 200,
    phone: '+1 (555) 567-8901',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'doctor-5',
    username: 'dr_lisa',
    email: 'lisa@medicare.com',
    role: 'doctor',
    firstName: 'Lisa',
    lastName: 'Anderson',
    specialty: 'Dentistry',
    license: 'DDS-56789',
    bio: 'Experienced dentist offering comprehensive dental care including cosmetic dentistry and orthodontics.',
    verified: true,
    rating: 4.9,
    reviewCount: 112,
    consultationFee: 100,
    phone: '+1 (555) 678-9012',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Clinics
export const mockClinics: Clinic[] = [
  {
    id: 'clinic-1',
    doctorId: 'doctor-1',
    name: 'City Heart Center',
    address: '456 Medical Plaza',
    city: 'New York',
    country: 'USA',
    phone: '+1 (555) 111-2222',
    email: 'info@cityheartcenter.com',
    verified: true,
    services: ['Cardiology Consultation', 'ECG', 'Echocardiogram', 'Stress Testing'],
    operatingHours: [],
  },
  {
    id: 'clinic-2',
    doctorId: 'doctor-2',
    name: 'Neuro Care Clinic',
    address: '789 Health Ave',
    city: 'Los Angeles',
    country: 'USA',
    phone: '+1 (555) 222-3333',
    email: 'info@neurocareclinic.com',
    verified: true,
    services: ['Neurology Consultation', 'EEG', 'MRI', 'Nerve Conduction Study'],
    operatingHours: [],
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    rating: 5,
    comment: 'Dr. Johnson is fantastic! Very thorough and caring. Highly recommend.',
    createdAt: '2024-12-01T00:00:00Z',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [];

// Initialize data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem('medicare_users')) {
    localStorage.setItem('medicare_users', JSON.stringify([...mockUsers, ...mockPatients, ...mockDoctors]));
  }
  if (!localStorage.getItem('medicare_clinics')) {
    localStorage.setItem('medicare_clinics', JSON.stringify(mockClinics));
  }
  if (!localStorage.getItem('medicare_appointments')) {
    localStorage.setItem('medicare_appointments', JSON.stringify(mockAppointments));
  }
  if (!localStorage.getItem('medicare_reviews')) {
    localStorage.setItem('medicare_reviews', JSON.stringify(mockReviews));
  }
  if (!localStorage.getItem('medicare_notifications')) {
    localStorage.setItem('medicare_notifications', JSON.stringify(mockNotifications));
  }
};

// Helper functions for localStorage operations
export const getUsers = (): User[] => {
  const data = localStorage.getItem('medicare_users');
  return data ? JSON.parse(data) : [];
};

export const getDoctors = (): Doctor[] => {
  return getUsers().filter(u => u.role === 'doctor') as Doctor[];
};

export const getPatients = (): Patient[] => {
  return getUsers().filter(u => u.role === 'patient') as Patient[];
};

export const getClinics = (): Clinic[] => {
  const data = localStorage.getItem('medicare_clinics');
  return data ? JSON.parse(data) : [];
};

export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem('medicare_appointments');
  return data ? JSON.parse(data) : [];
};

export const getReviews = (): Review[] => {
  const data = localStorage.getItem('medicare_reviews');
  return data ? JSON.parse(data) : [];
};

export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem('medicare_notifications');
  return data ? JSON.parse(data) : [];
};

// User Types
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory: MedicalRecord[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  license: string;
  bio: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  consultationFee: number;
}

export interface Admin extends User {
  role: 'admin';
}

// Clinic Types
export interface Clinic {
  id: string;
  doctorId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  locationEmbed?: string;
  verified: boolean;
  services: string[];
  operatingHours: OperatingHours[];
}

export interface OperatingHours {
  id: string;
  clinicId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

// Availability Types
export interface DoctorAvailability {
  id: string;
  doctorId: string;
  clinicId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
}

// Appointment Types
export type AppointmentStatus = 'Confirmed' | 'Cancelled' | 'Completed';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  patientId: string;
  doctorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

// Medical History Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId?: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  createdAt: string;
}

// Chat Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  lastMessage: Message;
  unreadCount: number;
}

// Notification Types
export type NotificationType = 
  | 'AppointmentBooked'
  | 'AppointmentCancelled'
  | 'AppointmentReminder'
  | 'DoctorVerified'
  | 'NewMessage'
  | 'ReviewReceived'
  | 'ComplaintReceived';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

// Complaint Types
export type ComplaintStatus = 'Pending' | 'InProgress' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  patientId: string;
  doctorId: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

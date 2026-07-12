let nextUserId = 10;
let nextDoctorId = 6;
let nextPatientId = 2;
let nextClinicId = 4;
let nextSlotId = 20;
let nextAppointmentId = 2;
let nextReviewId = 2;
let nextMedicalId = 2;
let nextNotificationId = 3;
let nextMessageId = 2;
let nextComplaintId = 2;

export const users = [
  { id: 1, username: 'admin', email: 'admin@careconnect.com', password: 'admin123', role: 'Admin', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, username: 'john_doe', email: 'john@example.com', password: 'password123', role: 'Patient', isActive: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 3, username: 'dr_sarah', email: 'sarah@medicare.com', password: 'password123', role: 'Doctor', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 4, username: 'dr_michael', email: 'michael@medicare.com', password: 'password123', role: 'Doctor', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 5, username: 'dr_emily', email: 'emily@medicare.com', password: 'password123', role: 'Doctor', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 6, username: 'dr_pending', email: 'pending@medicare.com', password: 'password123', role: 'Doctor', isActive: true, createdAt: '2024-06-01T00:00:00Z' },
];

export const patients = [
  {
    id: 1,
    userId: 2,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main St, New York',
    profileImageUrl: null,
  },
];

export const doctors = [
  {
    id: 1,
    userId: 3,
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialty: 'Cardiology',
    licenseNumber: 'MD-12345',
    bio: 'Board-certified cardiologist with 15 years of experience.',
    profileImageUrl: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a',
    isVerified: true,
    rating: 4.9,
  },
  {
    id: 2,
    userId: 4,
    firstName: 'Michael',
    lastName: 'Chen',
    specialty: 'Neurology',
    licenseNumber: 'MD-23456',
    bio: 'Expert neurologist specializing in migraine treatment and stroke prevention.',
    profileImageUrl: 'https://images.unsplash.com/photo-1575654402720-0af3480d1fad',
    isVerified: true,
    rating: 4.8,
  },
  {
    id: 3,
    userId: 5,
    firstName: 'Emily',
    lastName: 'Williams',
    specialty: 'Pediatrics',
    licenseNumber: 'MD-34567',
    bio: 'Compassionate pediatrician for children from infancy through adolescence.',
    profileImageUrl: 'https://images.unsplash.com/photo-1758691463331-2ac00e6f676f',
    isVerified: true,
    rating: 5.0,
  },
  {
    id: 4,
    userId: 6,
    firstName: 'James',
    lastName: 'Wilson',
    specialty: 'Dermatology',
    licenseNumber: 'MD-45678',
    bio: 'Dermatologist awaiting admin verification.',
    profileImageUrl: null,
    isVerified: false,
    rating: 0,
  },
];

const defaultHours = [
  { id: 1, dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isClosed: false },
  { id: 2, dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isClosed: false },
  { id: 3, dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isClosed: false },
  { id: 4, dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', isClosed: false },
  { id: 5, dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00', isClosed: false },
  { id: 6, dayOfWeek: 'Saturday', startTime: '00:00', endTime: '00:00', isClosed: true },
  { id: 7, dayOfWeek: 'Sunday', startTime: '00:00', endTime: '00:00', isClosed: true },
];

export const clinics = [
  {
    id: 1,
    doctorId: 1,
    name: 'City Heart Center',
    address: '456 Medical Plaza',
    city: 'New York',
    country: 'USA',
    phoneNumber: '+1 (555) 111-2222',
    email: 'info@cityheartcenter.com',
    locationEmbedCode: null,
    isVerified: true,
    operatingHours: defaultHours,
  },
  {
    id: 2,
    doctorId: 2,
    name: 'Neuro Care Clinic',
    address: '789 Health Ave',
    city: 'Los Angeles',
    country: 'USA',
    phoneNumber: '+1 (555) 222-3333',
    email: 'info@neurocareclinic.com',
    locationEmbedCode: null,
    isVerified: true,
    operatingHours: defaultHours,
  },
  {
    id: 3,
    doctorId: 3,
    name: 'Kids Wellness Center',
    address: '321 Care Lane',
    city: 'Chicago',
    country: 'USA',
    phoneNumber: '+1 (555) 333-4444',
    email: 'info@kidswellness.com',
    locationEmbedCode: null,
    isVerified: true,
    operatingHours: defaultHours,
  },
];

export const slots = [
  { slotId: 1, clinicId: 1, startTime: '09:00', endTime: '09:30', disabled: false },
  { slotId: 2, clinicId: 1, startTime: '09:30', endTime: '10:00', disabled: false },
  { slotId: 3, clinicId: 1, startTime: '10:00', endTime: '10:30', disabled: false },
  { slotId: 4, clinicId: 2, startTime: '09:00', endTime: '09:30', disabled: false },
  { slotId: 5, clinicId: 2, startTime: '11:00', endTime: '11:30', disabled: false },
  { slotId: 6, clinicId: 3, startTime: '14:00', endTime: '14:30', disabled: false },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const appointments = [
  {
    id: 1,
    userId: 2,
    patientId: 1,
    patientName: 'John Doe',
    doctorId: 1,
    doctorName: 'Dr. Sarah Johnson',
    clinicId: 1,
    clinicName: 'City Heart Center',
    slotId: 1,
    appointmentDate: tomorrow.toISOString(),
    startTime: '09:00',
    endTime: '09:30',
    status: 'Confirmed',
    notes: 'Annual checkup',
    createdAt: new Date().toISOString(),
  },
];

export const reviews = [
  {
    id: 1,
    patientId: 1,
    patientName: 'John Doe',
    doctorId: 1,
    doctorName: 'Dr. Sarah Johnson',
    rating: 5,
    comment: 'Dr. Johnson is fantastic! Very thorough and caring.',
    createdAt: '2024-12-01T00:00:00Z',
  },
];

export const medicalHistory = [
  {
    id: 1,
    patientId: 1,
    patientName: 'John Doe',
    doctorId: 1,
    doctorName: 'Dr. Sarah Johnson',
    visitDate: '2024-11-15T00:00:00Z',
    diagnosis: 'Hypertension',
    treatment: 'Lifestyle changes and medication',
    prescription: 'Lisinopril 10mg daily',
    notes: 'Follow up in 3 months',
    createdAt: '2024-11-15T00:00:00Z',
  },
];

export const notifications = [
  {
    id: 1,
    userId: 2,
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Sarah Johnson is confirmed.',
    type: 'AppointmentBooked',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 3,
    title: 'New Appointment',
    message: 'John Doe booked an appointment for tomorrow.',
    type: 'AppointmentBooked',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export const messages = [
  {
    id: 1,
    senderId: 2,
    receiverId: 3,
    message: 'Hello Dr. Johnson, I have a question about my prescription.',
    sentAt: '2024-12-10T10:00:00Z',
    isRead: true,
  },
];

export const complaints = [];

export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return users.find((u) => u.id === id);
}

export function findPatientByUserId(userId) {
  return patients.find((p) => p.userId === userId);
}

export function findDoctorByUserId(userId) {
  return doctors.find((d) => d.userId === userId);
}

export function findDoctorById(id) {
  return doctors.find((d) => d.id === id);
}

export function getDoctorSearchDto(doctor) {
  const doctorClinics = clinics.filter((c) => c.doctorId === doctor.id);
  return {
    id: doctor.id,
    userId: doctor.userId,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    specialty: doctor.specialty,
    bio: doctor.bio,
    rating: doctor.rating,
    profileImageUrl: doctor.profileImageUrl,
    isVerified: doctor.isVerified,
    clinicLocations: [...new Set(doctorClinics.map((c) => `${c.city}, ${c.country}`))],
    clinics: doctorClinics.map((c) => ({
      id: c.id,
      doctorId: c.doctorId,
      name: c.name,
      address: c.address,
      city: c.city,
      country: c.country,
      phoneNumber: c.phoneNumber,
      email: c.email,
      locationEmbedCode: c.locationEmbedCode,
      isVerified: c.isVerified,
      operatingHours: c.operatingHours,
    })),
  };
}

export function getUserDisplayName(userId) {
  const patient = findPatientByUserId(userId);
  if (patient) return `${patient.firstName} ${patient.lastName}`;

  const doctor = findDoctorByUserId(userId);
  if (doctor) return `Dr. ${doctor.firstName} ${doctor.lastName}`;

  const user = findUserById(userId);
  return user?.username || 'User';
}

export function getUserRole(userId) {
  return findUserById(userId)?.role || 'Patient';
}

export function nextId(counter) {
  switch (counter) {
    case 'user': return nextUserId++;
    case 'doctor': return nextDoctorId++;
    case 'patient': return nextPatientId++;
    case 'clinic': return nextClinicId++;
    case 'slot': return nextSlotId++;
    case 'appointment': return nextAppointmentId++;
    case 'review': return nextReviewId++;
    case 'medical': return nextMedicalId++;
    case 'notification': return nextNotificationId++;
    case 'message': return nextMessageId++;
    case 'complaint': return nextComplaintId++;
    default: return Date.now();
  }
}

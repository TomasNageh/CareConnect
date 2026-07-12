import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  doctors,
  clinics,
  slots,
  appointments,
  reviews,
  medicalHistory,
  notifications,
  findPatientByUserId,
  findDoctorById,
  findUserById,
  getDoctorSearchDto,
  getUserDisplayName,
  nextId,
} from '../data/store.js';

const router = Router();

router.get('/profile', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  if (!patient) return res.status(404).json('Patient not found.');

  const user = findUserById(req.auth.userId);
  res.json({
    id: patient.id,
    userId: patient.userId,
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: user?.email || '',
    dateOfBirth: patient.dateOfBirth,
    phoneNumber: patient.phoneNumber,
    address: patient.address,
    profileImageUrl: patient.profileImageUrl,
  });
});

router.put('/profile', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  if (!patient) return res.status(404).json('Patient not found.');

  Object.assign(patient, req.body);
  res.json(patient);
});

router.post('/upload-profile-image', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  if (!patient) return res.status(404).json('Patient not found.');

  patient.profileImageUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e';
  res.json({ profileImageUrl: patient.profileImageUrl });
});

router.get('/doctors/search', (req, res) => {
  const { specialty, location, minRating, page = 1, pageSize = 10 } = req.query;

  let results = doctors.filter((d) => d.isVerified);

  if (specialty) {
    results = results.filter((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }

  if (location) {
    const loc = location.toLowerCase();
    results = results.filter((d) =>
      clinics.some(
        (c) => c.doctorId === d.id && (c.city.toLowerCase().includes(loc) || c.country.toLowerCase().includes(loc))
      )
    );
  }

  if (minRating) {
    results = results.filter((d) => d.rating >= Number(minRating));
  }

  const start = (Number(page) - 1) * Number(pageSize);
  const paged = results.slice(start, start + Number(pageSize));

  res.json({
    doctors: paged.map(getDoctorSearchDto),
    totalCount: results.length,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

router.get('/doctors/:doctorId/slots', (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const clinicId = Number(req.query.clinicId);
  const date = req.query.date;

  const clinicSlots = slots.filter((s) => s.clinicId === clinicId && !s.disabled);

  const available = clinicSlots.filter((slot) => {
    if (!date) return true;
    const booked = appointments.some(
      (a) =>
        a.slotId === slot.slotId &&
        a.clinicId === clinicId &&
        a.status !== 'Cancelled' &&
        a.appointmentDate.startsWith(date)
    );
    return !booked;
  });

  res.json(available);
});

router.get('/appointments', authRequired('Patient'), (req, res) => {
  const list = appointments.filter((a) => a.userId === req.auth.userId);
  res.json(list);
});

router.get('/appointments/:id', authRequired('Patient'), (req, res) => {
  const appt = appointments.find((a) => a.id === Number(req.params.id) && a.userId === req.auth.userId);
  if (!appt) return res.status(404).json('Appointment not found.');
  res.json(appt);
});

router.post('/appointments', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  const { clinicId, slotId, appointmentDate, notes } = req.body;
  const clinic = clinics.find((c) => c.id === clinicId);
  const slot = slots.find((s) => s.slotId === slotId && s.clinicId === clinicId);
  const doctor = clinic ? findDoctorById(clinic.doctorId) : null;

  if (!clinic || !slot || !doctor) {
    return res.status(400).json('Invalid clinic or slot.');
  }

  const appt = {
    id: nextId('appointment'),
    userId: req.auth.userId,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId: doctor.id,
    doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    clinicId,
    clinicName: clinic.name,
    slotId,
    appointmentDate,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: 'Confirmed',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  appointments.push(appt);
  res.json(appt);
});

router.put('/appointments/:id', authRequired('Patient'), (req, res) => {
  const appt = appointments.find((a) => a.id === Number(req.params.id) && a.userId === req.auth.userId);
  if (!appt) return res.status(404).json('Appointment not found.');
  Object.assign(appt, req.body);
  res.json(appt);
});

router.delete('/appointments/:id', authRequired('Patient'), (req, res) => {
  const appt = appointments.find((a) => a.id === Number(req.params.id) && a.userId === req.auth.userId);
  if (!appt) return res.status(404).json('Appointment not found.');
  appt.status = 'Cancelled';
  res.json(appt);
});

router.get('/medical-history', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  res.json(medicalHistory.filter((m) => m.patientId === patient?.id));
});

router.get('/medical-history/:id', authRequired('Patient'), (req, res) => {
  const record = medicalHistory.find((m) => m.id === Number(req.params.id));
  if (!record) return res.status(404).json('Record not found.');
  res.json(record);
});

router.post('/medical-history', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  const record = { id: nextId('medical'), patientId: patient.id, patientName: getUserDisplayName(req.auth.userId), ...req.body, createdAt: new Date().toISOString() };
  medicalHistory.push(record);
  res.json(record);
});

router.put('/medical-history/:id', authRequired('Patient'), (req, res) => {
  const record = medicalHistory.find((m) => m.id === Number(req.params.id));
  if (!record) return res.status(404).json('Record not found.');
  Object.assign(record, req.body);
  res.json(record);
});

router.delete('/medical-history/:id', authRequired('Patient'), (req, res) => {
  const idx = medicalHistory.findIndex((m) => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json('Record not found.');
  medicalHistory.splice(idx, 1);
  res.json({ success: true });
});

router.post('/reviews', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  const doctor = findDoctorById(req.body.doctorId);
  const review = {
    id: nextId('review'),
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId: req.body.doctorId,
    doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '',
    rating: req.body.rating,
    comment: req.body.comment,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  res.json(review);
});

router.get('/reviews', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  res.json(reviews.filter((r) => r.patientId === patient?.id));
});

router.put('/reviews/:id', authRequired('Patient'), (req, res) => {
  const review = reviews.find((r) => r.id === Number(req.params.id));
  if (!review) return res.status(404).json('Review not found.');
  Object.assign(review, req.body);
  res.json(review);
});

router.delete('/reviews/:id', authRequired('Patient'), (req, res) => {
  const idx = reviews.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json('Review not found.');
  reviews.splice(idx, 1);
  res.json({ success: true });
});

router.get('/doctors/:doctorId/reviews', (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const doctorReviews = reviews.filter((r) => r.doctorId === doctorId);
  const start = (page - 1) * pageSize;

  res.json({
    reviews: doctorReviews.slice(start, start + pageSize),
    totalCount: doctorReviews.length,
    page,
    pageSize,
  });
});

router.get('/reviews/doctor/:doctorId', authRequired('Patient'), (req, res) => {
  const patient = findPatientByUserId(req.auth.userId);
  const review = reviews.find((r) => r.doctorId === Number(req.params.doctorId) && r.patientId === patient?.id);
  if (!review) return res.status(404).json('Review not found.');
  res.json(review);
});

router.get('/clinics/:clinicId', (req, res) => {
  const clinic = clinics.find((c) => c.id === Number(req.params.clinicId));
  if (!clinic) return res.status(404).json('Clinic not found.');

  const doctor = findDoctorById(clinic.doctorId);
  res.json({
    id: clinic.id,
    doctorId: clinic.doctorId,
    doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '',
    doctorSpecialty: doctor?.specialty,
    doctorRating: doctor?.rating,
    doctorProfileImageUrl: doctor?.profileImageUrl,
    name: clinic.name,
    address: clinic.address,
    city: clinic.city,
    country: clinic.country,
    phoneNumber: clinic.phoneNumber,
    email: clinic.email,
    locationEmbedCode: clinic.locationEmbedCode,
    isVerified: clinic.isVerified,
    operatingHours: clinic.operatingHours,
  });
});

router.get('/notifications', authRequired('Patient'), (req, res) => {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const userNotifs = notifications.filter((n) => n.userId === req.auth.userId);
  const start = (page - 1) * pageSize;

  res.json({
    notifications: userNotifs.slice(start, start + pageSize),
    totalCount: userNotifs.length,
    page,
    pageSize,
  });
});

router.put('/notifications/:id/read', authRequired('Patient'), (req, res) => {
  const notif = notifications.find((n) => n.id === Number(req.params.id) && n.userId === req.auth.userId);
  if (!notif) return res.status(404).json('Notification not found.');
  notif.isRead = true;
  res.json(notif);
});

router.delete('/notifications/:id', authRequired('Patient'), (req, res) => {
  const idx = notifications.findIndex((n) => n.id === Number(req.params.id) && n.userId === req.auth.userId);
  if (idx === -1) return res.status(404).json('Notification not found.');
  notifications.splice(idx, 1);
  res.json({ success: true });
});

export default router;

import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  appointments,
  clinics,
  slots,
  notifications,
  findDoctorByUserId,
  findDoctorById,
  nextId,
} from '../data/store.js';

const router = Router();

router.get('/profile', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  if (!doctor) return res.status(404).json('Doctor not found.');
  res.json(doctor);
});

router.put('/profile', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  if (!doctor) return res.status(404).json('Doctor not found.');
  Object.assign(doctor, req.body);
  res.json(doctor);
});

router.post('/upload-profile-image', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  if (!doctor) return res.status(404).json('Doctor not found.');
  doctor.profileImageUrl = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d';
  res.json({ profileImageUrl: doctor.profileImageUrl });
});

router.post('/clinics', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  const clinic = {
    id: nextId('clinic'),
    doctorId: doctor.id,
    isVerified: false,
    operatingHours: [],
    ...req.body,
  };
  clinics.push(clinic);
  res.json(clinic);
});

router.get('/clinics', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  res.json(clinics.filter((c) => c.doctorId === doctor?.id));
});

router.get('/clinics/:id', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  const clinic = clinics.find((c) => c.id === Number(req.params.id) && c.doctorId === doctor?.id);
  if (!clinic) return res.status(404).json('Clinic not found.');
  res.json(clinic);
});

router.put('/clinics/:id', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  const clinic = clinics.find((c) => c.id === Number(req.params.id) && c.doctorId === doctor?.id);
  if (!clinic) return res.status(404).json('Clinic not found.');
  Object.assign(clinic, req.body);
  res.json(clinic);
});

router.delete('/clinics/:id', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  const idx = clinics.findIndex((c) => c.id === Number(req.params.id) && c.doctorId === doctor?.id);
  if (idx === -1) return res.status(404).json('Clinic not found.');
  clinics.splice(idx, 1);
  res.json({ success: true });
});

router.get('/clinics/:clinicId/slots', authRequired('Doctor'), (req, res) => {
  res.json(slots.filter((s) => s.clinicId === Number(req.params.clinicId)));
});

router.post('/clinics/:clinicId/slots', authRequired('Doctor'), (req, res) => {
  const slot = {
    slotId: nextId('slot'),
    clinicId: Number(req.params.clinicId),
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    disabled: false,
  };
  slots.push(slot);
  res.json(slot);
});

router.put('/clinics/:clinicId/slots/:slotId', authRequired('Doctor'), (req, res) => {
  const slot = slots.find(
    (s) => s.slotId === Number(req.params.slotId) && s.clinicId === Number(req.params.clinicId)
  );
  if (!slot) return res.status(404).json('Slot not found.');
  Object.assign(slot, req.body);
  res.json(slot);
});

router.delete('/clinics/:clinicId/slots/:slotId', authRequired('Doctor'), (req, res) => {
  const idx = slots.findIndex(
    (s) => s.slotId === Number(req.params.slotId) && s.clinicId === Number(req.params.clinicId)
  );
  if (idx === -1) return res.status(404).json('Slot not found.');
  slots.splice(idx, 1);
  res.json({ success: true });
});

router.get('/patients/:patientId/history', authRequired('Doctor'), (req, res) => {
  res.json([]);
});

router.get('/dashboard', authRequired('Doctor'), (req, res) => {
  const doctor = findDoctorByUserId(req.auth.userId);
  const doctorClinics = clinics.filter((c) => c.doctorId === doctor?.id);
  const clinicIds = doctorClinics.map((c) => c.id);
  const doctorAppts = appointments.filter((a) => clinicIds.includes(a.clinicId) && a.status !== 'Cancelled');

  const today = new Date().toISOString().split('T')[0];
  const upcoming = doctorAppts.filter((a) => a.appointmentDate >= new Date().toISOString());

  res.json({
    totalAppointmentsToday: doctorAppts.filter((a) => a.appointmentDate.startsWith(today)).length,
    totalAppointmentsThisWeek: doctorAppts.length,
    totalAppointmentsThisMonth: doctorAppts.length,
    totalPatients: new Set(doctorAppts.map((a) => a.userId)).size,
    averageRating: doctor?.rating || 0,
    upcomingAppointments: upcoming.slice(0, 5),
    recentReviews: [],
  });
});

router.get('/notifications', authRequired('Doctor'), (req, res) => {
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

router.put('/notifications/:id/read', authRequired('Doctor'), (req, res) => {
  const notif = notifications.find((n) => n.id === Number(req.params.id) && n.userId === req.auth.userId);
  if (!notif) return res.status(404).json('Notification not found.');
  notif.isRead = true;
  res.json(notif);
});

router.delete('/notifications/:id', authRequired('Doctor'), (req, res) => {
  const idx = notifications.findIndex((n) => n.id === Number(req.params.id) && n.userId === req.auth.userId);
  if (idx === -1) return res.status(404).json('Notification not found.');
  notifications.splice(idx, 1);
  res.json({ success: true });
});

export default router;

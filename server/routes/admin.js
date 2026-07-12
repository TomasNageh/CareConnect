import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  users,
  doctors,
  clinics,
  appointments,
  complaints,
  findPatientByUserId,
  findDoctorById,
  findDoctorByUserId,
  nextId,
} from '../data/store.js';

const router = Router();

function mapUser(u) {
  const patient = findPatientByUserId(u.id);
  const doctor = findDoctorByUserId(u.id);

  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
    firstName: patient?.firstName || doctor?.firstName || '',
    lastName: patient?.lastName || doctor?.lastName || '',
  };
}

router.get('/users', authRequired('Admin'), (req, res) => {
  const { role, page = 1, pageSize = 10 } = req.query;
  let list = users.map(mapUser);

  if (role) {
    list = list.filter((u) => u.role.toLowerCase() === role.toLowerCase());
  }

  const start = (Number(page) - 1) * Number(pageSize);
  res.json({
    users: list.slice(start, start + Number(pageSize)),
    totalCount: list.length,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

router.get('/users/:id', authRequired('Admin'), (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json('User not found.');
  res.json(mapUser(user));
});

router.put('/users/:id', authRequired('Admin'), (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json('User not found.');
  Object.assign(user, req.body);
  res.json(mapUser(user));
});

router.delete('/users/:id', authRequired('Admin'), (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json('User not found.');
  user.isActive = false;
  res.json(mapUser(user));
});

router.put('/users/:id/activate', authRequired('Admin'), (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json('User not found.');
  user.isActive = true;
  res.json(mapUser(user));
});

router.get('/doctors/pending', authRequired('Admin'), (req, res) => {
  res.json(doctors.filter((d) => !d.isVerified));
});

router.put('/doctors/:id/verify', authRequired('Admin'), (req, res) => {
  const doctor = findDoctorById(Number(req.params.id));
  if (!doctor) return res.status(404).json('Doctor not found.');
  doctor.isVerified = true;
  doctor.rating = doctor.rating || 4.5;
  res.json(doctor);
});

router.get('/clinics/pending', authRequired('Admin'), (req, res) => {
  res.json(clinics.filter((c) => !c.isVerified));
});

router.put('/clinics/:id/verify', authRequired('Admin'), (req, res) => {
  const clinic = clinics.find((c) => c.id === Number(req.params.id));
  if (!clinic) return res.status(404).json('Clinic not found.');
  clinic.isVerified = true;
  res.json(clinic);
});

router.get('/analytics', authRequired('Admin'), (req, res) => {
  res.json({
    totalUsers: users.length,
    totalPatients: users.filter((u) => u.role === 'Patient').length,
    totalDoctors: doctors.length,
    verifiedDoctors: doctors.filter((d) => d.isVerified).length,
    totalClinics: clinics.length,
    totalAppointments: appointments.length,
    pendingDoctors: doctors.filter((d) => !d.isVerified).length,
    pendingClinics: clinics.filter((c) => !c.isVerified).length,
  });
});

router.get('/reports/appointments', authRequired('Admin'), (req, res) => {
  res.json({ appointments, totalCount: appointments.length });
});

router.get('/reports/users', authRequired('Admin'), (req, res) => {
  res.json({ users: users.map(mapUser), totalCount: users.length });
});

router.get('/complaints', authRequired('Admin'), (req, res) => {
  const { status, page = 1, pageSize = 10 } = req.query;
  let list = complaints;
  if (status) list = list.filter((c) => c.status === status);
  const start = (Number(page) - 1) * Number(pageSize);

  res.json({
    complaints: list.slice(start, start + Number(pageSize)),
    totalCount: list.length,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

router.get('/complaints/:id', authRequired('Admin'), (req, res) => {
  const complaint = complaints.find((c) => c.id === Number(req.params.id));
  if (!complaint) return res.status(404).json('Complaint not found.');
  res.json(complaint);
});

router.post('/complaints', authRequired('Admin'), (req, res) => {
  const complaint = {
    id: nextId('complaint'),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  complaints.push(complaint);
  res.json(complaint);
});

router.put('/complaints/:id', authRequired('Admin'), (req, res) => {
  const complaint = complaints.find((c) => c.id === Number(req.params.id));
  if (!complaint) return res.status(404).json('Complaint not found.');
  Object.assign(complaint, req.body);
  res.json(complaint);
});

router.put('/complaints/:id/resolve', authRequired('Admin'), (req, res) => {
  const complaint = complaints.find((c) => c.id === Number(req.params.id));
  if (!complaint) return res.status(404).json('Complaint not found.');
  complaint.status = 'Resolved';
  complaint.resolvedAt = new Date().toISOString();
  res.json(complaint);
});

router.delete('/complaints/:id', authRequired('Admin'), (req, res) => {
  const idx = complaints.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json('Complaint not found.');
  complaints.splice(idx, 1);
  res.json({ success: true });
});

export default router;

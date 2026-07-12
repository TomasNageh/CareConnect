import { Router } from 'express';
import { createToken } from '../middleware/auth.js';
import {
  users,
  patients,
  doctors,
  findUserByEmail,
  findPatientByUserId,
  findDoctorByUserId,
  nextId,
} from '../data/store.js';

const router = Router();

function authResponse(user) {
  const patient = findPatientByUserId(user.id);
  const doctor = findDoctorByUserId(user.id);
  const profile = patient || doctor || {};

  return {
    token: createToken(user, profile),
    userId: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
  };
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json('Invalid email or password.');
  }

  if (!user.isActive) {
    return res.status(401).json('Account is deactivated.');
  }

  res.json(authResponse(user));
});

router.post('/register/patient', (req, res) => {
  const { username, email, password, firstName, lastName, dateOfBirth, phoneNumber, address } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).json('Email already exists.');
  }
  if (users.some((u) => u.username === username)) {
    return res.status(400).json('Username already exists.');
  }

  const user = {
    id: nextId('user'),
    username,
    email,
    password,
    role: 'Patient',
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  users.push(user);

  patients.push({
    id: nextId('patient'),
    userId: user.id,
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    address,
    profileImageUrl: null,
  });

  res.json(authResponse(user));
});

router.post('/register/doctor', (req, res) => {
  const { username, email, password, firstName, lastName, specialty, licenseNumber, bio } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).json('Email already exists.');
  }
  if (users.some((u) => u.username === username)) {
    return res.status(400).json('Username already exists.');
  }

  const user = {
    id: nextId('user'),
    username,
    email,
    password,
    role: 'Doctor',
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  users.push(user);

  doctors.push({
    id: nextId('doctor'),
    userId: user.id,
    firstName,
    lastName,
    specialty,
    licenseNumber,
    bio,
    profileImageUrl: null,
    isVerified: false,
    rating: 0,
  });

  res.json(authResponse(user));
});

router.post('/register/admin', (req, res) => {
  const { username, email, password } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).json('Email already exists.');
  }
  if (users.some((u) => u.username === username)) {
    return res.status(400).json('Username already exists.');
  }

  const user = {
    id: nextId('user'),
    username,
    email,
    password,
    role: 'Admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  users.push(user);

  res.json(authResponse(user));
});

export default router;

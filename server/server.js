import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import doctorRoutes from './routes/doctor.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'CareConnect Mock API',
    status: 'running',
    docs: 'Use the React frontend at http://localhost:5173',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`CareConnect Mock API running at http://localhost:${PORT}`);
  console.log('');
  console.log('Demo accounts:');
  console.log('  Patient: john@example.com / password123');
  console.log('  Doctor:  sarah@medicare.com / password123');
  console.log('  Admin:   admin@careconnect.com / admin123');
});

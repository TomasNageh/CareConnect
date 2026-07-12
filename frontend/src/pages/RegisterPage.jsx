import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useAuth } from '../contexts/AuthContext';
import * as doctorAPI from '../services/doctor';
import { toast } from 'sonner';
import { isValidEmail, validatePassword, isValidPhone } from '../services/validation';
import PatientRegisterFields from '../components/register/PatientRegisterFields';
import DoctorRegisterFields from '../components/register/DoctorRegisterFields';

export default function RegisterPage() {
  const [role, setRole] = useState('Patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    specialty: '',
    licenseNumber: '',
    bio: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (role === 'Patient' && formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (role === 'Doctor') {
      if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      let registrationData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      if (role === 'Patient') {
        registrationData = {
          ...registrationData,
          phoneNumber: formData.phoneNumber || null,
          address: formData.address || null,
          dateOfBirth: formData.dateOfBirth || null,
        };
      } else if (role === 'Doctor') {
        registrationData = {
          ...registrationData,
          specialty: formData.specialty,
          licenseNumber: formData.licenseNumber,
          bio: formData.bio || null,
        };
      }

      await register(registrationData, role);

      if (role === 'Doctor' && profileImage) {
        try {
          await doctorAPI.uploadProfileImage(profileImage);
          toast.success('Profile image uploaded successfully!');
        } catch (error) {
          console.error('Error uploading profile image:', error);
          toast.error('Registration successful, but failed to upload profile image.');
        }
      }

      toast.success('Registration successful!');

      if (role === 'Doctor') {
        navigate('/dashboard/doctor');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG or PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Card className="w-full max-w-2xl p-8 my-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 rounded-lg p-3 mb-4">
          <Heart className="w-8 h-8 text-white" fill="white" />
        </div>
        <h1 className="text-3xl text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join CareConnect today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>I am a</Label>
          <RadioGroup value={role} onValueChange={setRole} className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Patient" id="patient" />
              <Label htmlFor="patient">Patient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Doctor" id="doctor" />
              <Label htmlFor="doctor">Doctor</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
          </div>
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            minLength={6}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        {role === 'Patient' && (
          <PatientRegisterFields formData={formData} errors={errors} onChange={handleChange} />
        )}

        {role === 'Doctor' && (
          <DoctorRegisterFields
            formData={formData}
            errors={errors}
            imagePreview={imagePreview}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onRemoveImage={() => {
              setProfileImage(null);
              setImagePreview(null);
            }}
          />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </Card>
  );
}

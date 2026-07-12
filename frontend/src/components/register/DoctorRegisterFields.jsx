import { Upload, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const specialties = [
  'Cardiology',
  'Neurology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Pharmacy',
  'Dentistry',
  'Dermatology',
  'Psychiatry',
  'Gynecology',
  'Urology',
  'Oncology',
  'Endocrinology',
  'Gastroenterology',
  'Pulmonology',
  'Rheumatology',
  'Nephrology',
  'Hematology',
  'Anesthesiology',
];

export default function DoctorRegisterFields({
  formData,
  errors,
  imagePreview,
  onChange,
  onImageChange,
  onRemoveImage,
}) {
  return (
    <>
      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Select
          value={formData.specialty}
          onValueChange={(value) => onChange('specialty', value)}
        >
          <SelectTrigger id="specialty" className={errors.specialty ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your specialty..." />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.specialty && <p className="text-sm text-red-500 mt-1">{errors.specialty}</p>}
      </div>
      <div>
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => onChange('licenseNumber', e.target.value)}
          required
          placeholder="Enter your medical license number"
          className={errors.licenseNumber ? 'border-red-500' : ''}
        />
        {errors.licenseNumber && <p className="text-sm text-red-500 mt-1">{errors.licenseNumber}</p>}
      </div>
      <div>
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          rows={4}
          placeholder="Tell patients about your experience..."
        />
      </div>
      <div>
        <Label htmlFor="profileImage">Profile Image (Optional)</Label>
        <div className="mt-2">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="profileImage"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
              </div>
              <input
                id="profileImage"
                type="file"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png"
                onChange={onImageChange}
              />
            </label>
          )}
        </div>
      </div>
    </>
  );
}

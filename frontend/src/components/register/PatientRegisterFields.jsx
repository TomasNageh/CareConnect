import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function PatientRegisterFields({ formData, errors, onChange }) {
  return (
    <>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          className={errors.phoneNumber ? 'border-red-500' : ''}
        />
        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => onChange('dateOfBirth', e.target.value)}
        />
      </div>
    </>
  );
}

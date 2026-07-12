import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Label } from './ui/label';

const specialties = [
  { name: 'Cardiology', value: 'Cardiology' },
  { name: 'Neurology', value: 'Neurology' },
  { name: 'Ophthalmology', value: 'Ophthalmology' },
  { name: 'Orthopedics', value: 'Orthopedics' },
  { name: 'Pediatrics', value: 'Pediatrics' },
  { name: 'General Medicine', value: 'General Medicine' },
  { name: 'Pharmacy', value: 'Pharmacy' },
  { name: 'Dentistry', value: 'Dentistry' },
];

export function SpecialtiesSection() {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value);
  };

  const handleSearch = () => {
    if (selectedSpecialty) {
      navigate(`/doctors?specialty=${encodeURIComponent(selectedSpecialty)}`);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl text-gray-900 mb-3">Browse by Specialty</h2>
          <p className="text-lg text-gray-600">Find the right specialist for your health needs</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="specialty-select" className="text-base font-medium text-gray-700 mb-2 block">
                  Select a Specialty
                </Label>
                <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
                  <SelectTrigger id="specialty-select" className="w-full h-12">
                    <SelectValue placeholder="Choose a specialty..." />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                size="lg" 
                className="w-full h-12" 
                onClick={handleSearch}
                disabled={!selectedSpecialty}
              >
                Search Doctors
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


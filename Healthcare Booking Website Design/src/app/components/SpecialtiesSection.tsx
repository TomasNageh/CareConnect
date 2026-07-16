import { Stethoscope, Heart, Brain, Eye, Bone, Baby, Pill, Smile } from 'lucide-react';
import { Card } from './ui/card';

const specialties = [
  { name: 'Cardiology', icon: Heart, color: 'bg-red-100 text-red-600', count: '324 Doctors' },
  { name: 'Neurology', icon: Brain, color: 'bg-purple-100 text-purple-600', count: '215 Doctors' },
  { name: 'Ophthalmology', icon: Eye, color: 'bg-blue-100 text-blue-600', count: '189 Doctors' },
  { name: 'Orthopedics', icon: Bone, color: 'bg-orange-100 text-orange-600', count: '267 Doctors' },
  { name: 'Pediatrics', icon: Baby, color: 'bg-pink-100 text-pink-600', count: '298 Doctors' },
  { name: 'General Medicine', icon: Stethoscope, color: 'bg-teal-100 text-teal-600', count: '542 Doctors' },
  { name: 'Pharmacy', icon: Pill, color: 'bg-green-100 text-green-600', count: '156 Doctors' },
  { name: 'Dentistry', icon: Smile, color: 'bg-indigo-100 text-indigo-600', count: '387 Doctors' },
];

export function SpecialtiesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-3">Browse by Specialty</h2>
          <p className="text-lg text-gray-600">Find the right specialist for your health needs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {specialties.map((specialty) => {
            const Icon = specialty.icon;
            return (
              <Card
                key={specialty.name}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`${specialty.color} rounded-full p-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{specialty.name}</h3>
                    <p className="text-sm text-gray-500">{specialty.count}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

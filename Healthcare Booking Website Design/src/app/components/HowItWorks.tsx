import { Search, Calendar, Stethoscope, Star } from 'lucide-react';
import { Card } from './ui/card';

const steps = [
  {
    icon: Search,
    title: 'Find a Doctor',
    description: 'Search for doctors by specialty, location, or insurance coverage',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Calendar,
    title: 'Book Appointment',
    description: 'Choose a convenient time slot and book your appointment instantly',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Stethoscope,
    title: 'Visit Doctor',
    description: 'Attend your appointment online or in-person at the clinic',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Star,
    title: 'Leave Review',
    description: 'Share your experience to help other patients make informed decisions',
    color: 'bg-orange-100 text-orange-600',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-3">How It Works</h2>
          <p className="text-lg text-gray-600">Book your appointment in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="p-6 text-center border-gray-200 bg-white">
                <div className="relative mb-6">
                  <div className={`${step.color} rounded-full p-4 inline-block`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2" />
                  )}
                </div>
                <div className="text-2xl text-gray-400 mb-3">Step {index + 1}</div>
                <h3 className="text-xl text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

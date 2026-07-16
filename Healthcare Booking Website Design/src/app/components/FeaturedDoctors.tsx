import { Star, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nfGVufDF8fHx8MTc2NjQwNDc0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviews: 127,
    experience: '15 years',
    location: 'City Hospital, New York',
    fee: 150,
    available: 'Today',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    image: 'https://images.unsplash.com/photo-1575654402720-0af3480d1fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NjMzNzgwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviews: 98,
    experience: '12 years',
    location: 'Medical Center, Los Angeles',
    fee: 175,
    available: 'Tomorrow',
  },
  {
    id: 3,
    name: 'Dr. Emily Williams',
    specialty: 'Pediatrician',
    image: 'https://images.unsplash.com/photo-1758691463331-2ac00e6f676f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWRpYXRyaWNpYW4lMjBjaGlsZHJlbiUyMGRvY3RvcnxlbnwxfHx8fDE3NjY0MTI1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5.0,
    reviews: 145,
    experience: '10 years',
    location: 'Children Hospital, Chicago',
    fee: 120,
    available: 'Today',
  },
];

export function FeaturedDoctors() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl text-gray-900 mb-3">Featured Doctors</h2>
            <p className="text-lg text-gray-600">Top-rated healthcare professionals</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <ImageWithFallback
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover"
                />
                {doctor.available === 'Today' && (
                  <Badge className="absolute top-4 right-4 bg-green-500">
                    Available Today
                  </Badge>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-blue-600">{doctor.specialty}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-900">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">({doctor.reviews} reviews)</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{doctor.experience} exp</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">${doctor.fee}</span>
                    <span className="text-sm text-gray-500">consultation</span>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

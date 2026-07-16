import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, Percent } from 'lucide-react';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

const promotions = [
  {
    id: 1,
    title: 'First Visit Discount',
    description: 'Get 25% off on your first consultation with any doctor',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1631507623104-aa66944677aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzY2NDEyNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    validUntil: 'Dec 31, 2024',
  },
  {
    id: 2,
    title: 'Free Health Checkup',
    description: 'Complete health screening package for new patients',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwb2ZmaWNlfGVufDF8fHx8MTc2NjQxMjUwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    validUntil: 'Limited Time',
  },
];

export function PromotionsSection() {
  const navigate = useNavigate();

  const handleClaimOffer = () => {
    navigate('/register');
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-3">Special Offers</h2>
          <p className="text-lg text-gray-600">Don't miss out on our exclusive healthcare deals</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <ImageWithFallback
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500 text-lg px-4 py-2">
                    {promo.discount}
                  </Badge>
                </div>

                <div className="p-6 flex flex-col justify-center">
                  <h3 className="text-2xl text-gray-900 mb-3">{promo.title}</h3>
                  <p className="text-gray-600 mb-6">{promo.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Clock className="w-4 h-4" />
                    <span>Valid until: {promo.validUntil}</span>
                  </div>

                  <Button className="gap-2" onClick={handleClaimOffer}>
                    <Percent className="w-4 h-4" />
                    Claim Offer
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


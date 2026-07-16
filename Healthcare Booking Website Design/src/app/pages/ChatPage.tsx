import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl text-gray-900 mb-6">Messages</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Chat features are being developed.</p>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="about" className="bg-gray-900 text-gray-300 mt-64 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold text-white">CareConnect</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted healthcare partner. Find and book appointments with the best doctors near you.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/doctors" className="hover:text-blue-400 transition-colors">Find Doctors</Link>
              </li>
              <li>
                <a
                  href="/#specialties"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('specialties');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/#specialties');
                    }
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Specialties
                </a>
              </li>
              <li>
                <Link to="/clinics" className="hover:text-blue-400 transition-colors">Find Clinics</Link>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h3 className="text-white text-lg mb-4">For Doctors</h3>
            <ul className="space-y-2">
              <li>
                <a href="/register" className="hover:text-blue-400 transition-colors">Join as Doctor</a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-400 transition-colors">Doctor Login</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@careconnect.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Healthcare Ave<br />Cairo,Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 CareConnect. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


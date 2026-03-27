import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import { APP_NAME, WHATSAPP_NUMBER } from '../../utils/constants';

const Contact: React.FC = () => {
  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent(`Hello ${APP_NAME} Team! I need some help/information regarding...`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-dark-900 text-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Get in Touch
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            Have questions about our products or your order? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-2">Phone</h3>
              <p className="text-dark-400 mb-4">Mon-Sat from 10am to 8pm.</p>
              <a href="tel:+919999999999" className="text-primary-600 font-semibold hover:underline">+91 99999 99999</a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-500 mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-2">Email</h3>
              <p className="text-dark-400 mb-4">We'll respond within 24 hours.</p>
              <a href="mailto:info@supercollection.in" className="text-primary-600 font-semibold hover:underline">info@supercollection.in</a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 animate-slide-up sm:col-span-2" style={{ animationDelay: '400ms' }}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500 mb-6">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-800 mb-2">WhatsApp Support</h3>
                  <p className="text-dark-400 mb-6">The fastest way to reach us for order tracking and product inquiries.</p>
                  <Button variant="whatsapp" onClick={handleWhatsAppSupport}>
                    Chat on WhatsApp
                  </Button>
                </div>
                
                <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <h3 className="font-bold text-dark-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-dark-400" />
                    Store Hours
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-dark-500">Monday - Saturday</span>
                      <span className="font-medium text-dark-800">10:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between pb-2">
                      <span className="text-dark-500">Sunday</span>
                      <span className="font-medium text-red-500">Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Map/Location */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 flex flex-col animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-dark-600">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-800">Visit Our Store</h3>
                <p className="text-dark-400">Main Market, Your City, India</p>
              </div>
            </div>
            
            <div className="flex-grow rounded-xl bg-gray-100 overflow-hidden relative min-h-[300px]">
              {/* Note: In a real app, replace this with an actual Google Maps iframe */}
              <div className="absolute inset-0 flex items-center justify-center flex-col text-dark-400 p-8 text-center bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=India&zoom=4&size=600x400&maptype=roadmap&key=mock')] bg-cover bg-center">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                  <MapPin size={32} className="text-primary-500 mx-auto mb-3" />
                  <p className="font-medium text-dark-800 mb-1">{APP_NAME}</p>
                  <p className="text-sm">Main Market location would appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, Mail, MapPin } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-dark-300 text-sm leading-relaxed">
              Your one-stop shop for mobile accessories, custom gifts, and mobile recharge services. Quality products at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark-300 hover:text-primary-400 transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-dark-300 hover:text-primary-400 transition-colors text-sm">Products</Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark-300 hover:text-primary-400 transition-colors text-sm">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-dark-300">
                <Phone size={16} className="text-primary-400" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-300">
                <Mail size={16} className="text-primary-400" />
                <span>info@supercollection.in</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-dark-300">
                <MapPin size={16} className="text-primary-400 mt-0.5" />
                <span>Main Market, Your City, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-600 mt-8 pt-8 text-center">
          <p className="text-dark-400 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

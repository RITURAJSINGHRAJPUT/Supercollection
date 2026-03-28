import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, Mail, MapPin } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-dark-300 text-xs leading-relaxed max-w-sm">
              Your one-stop shop for mobile accessories, custom gifts, and mobile recharge services. Quality products at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-3">Quick Links</h3>
            <ul className="space-y-1.5">
              <li>
                <Link to="/" className="text-dark-300 hover:text-primary-400 transition-colors text-xs">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-dark-300 hover:text-primary-400 transition-colors text-xs">Products</Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark-300 hover:text-primary-400 transition-colors text-xs">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-3">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-dark-300">
                <Phone size={14} className="text-primary-400 shrink-0" />
                <span className="truncate">+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-dark-300">
                <Mail size={14} className="text-primary-400 shrink-0" />
                <span className="truncate">info@supercollection.in</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-dark-300">
                <MapPin size={14} className="text-primary-400 mt-0.5 shrink-0" />
                <span className="leading-tight">Main Market, Your City, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-600 mt-6 pt-6 text-center">
          <p className="text-dark-400 text-[10px] sm:text-xs">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

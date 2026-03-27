import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { APP_NAME } from '../../utils/constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      // Clean up Firebase error messages
      const errorMsg = err.code?.replace('auth/', '').replace(/-/g, ' ') || 'Failed to login';
      setError(errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex text-dark-800 bg-gray-50">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-dark-900 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-900 to-secondary-900 z-0 opacity-80" />
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-primary-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 rounded-full bg-secondary-600/30 blur-3xl" />
        
        <div className="relative z-10 w-full flex flex-col justify-center px-16 xl:px-24">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-10 shadow-2xl">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Manage your store <br />
            with <span className="text-primary-400">precision</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-lg leading-relaxed mb-12">
            The complete administrative suite for {APP_NAME}. Track sales, manage inventory, and monitor your business growth.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-1">Real-time Analytics</h3>
              <p className="text-dark-300 text-sm">Monitor your store's performance Instantly</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-1">Stock Tracking</h3>
              <p className="text-dark-300 text-sm">Never miss an order with live inventory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Side */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 w-full max-w-md lg:max-w-none mx-auto relative relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-0 right-0 flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <ShoppingBag size={24} className="text-white" />
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-dark-800 mb-2">Welcome back</h2>
            <p className="text-dark-400">Please enter your admin credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@supercollection.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={20} />}
                required
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} />}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg shadow-xl shadow-primary-500/20 py-3.5"
              loading={isSubmitting}
              icon={<ArrowRight size={20} />}
            >
              Sign in to Dashboard
            </Button>
          </form>

          <div className="mt-12 text-center lg:text-left">
            <p className="text-sm text-dark-400">
              Secure access for authorized personnel only. Return to{' '}
              <a href="/" className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors">
                Public Site
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

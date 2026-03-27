import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import Layout from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductList from '../../components/product/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { APP_NAME } from '../../utils/constants';

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  const features = [
    {
      icon: <Star className="text-amber-500" size={24} />,
      title: 'Premium Quality',
      description: 'We source only the best products for our customers.',
    },
    {
      icon: <Zap className="text-secondary-500" size={24} />,
      title: 'Fast Delivery',
      description: 'Quick order processing and dispatch within 24 hours.',
    },
    {
      icon: <Shield className="text-green-500" size={24} />,
      title: 'Secure Ordering',
      description: 'Direct WhatsApp ordering for a personalized experience.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Layout />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 z-0" />
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary-200/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-secondary-200/50 blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-primary-100 text-primary-600 font-medium text-sm mb-8 animate-slide-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              New collections available now
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-dark-800 tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Welcome to <span className="text-gradient block mt-2">{APP_NAME}</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-dark-500 mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              Your ultimate destination for premium mobile accessories, custom gifting, and more. Quality products delivered straight to you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/products" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="btn-outline w-full sm:w-auto text-lg px-8 py-4 bg-white/50 backdrop-blur-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-dark-800 mb-3">{feature.title}</h3>
                  <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-4">
                  Featured Products
                </h2>
                <p className="text-dark-400 text-lg">Handpicked essentials just for you</p>
              </div>
              <Link 
                to="/products" 
                className="hidden md:flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors"
              >
                View All <ArrowRight size={18} />
              </Link>
            </div>

            <ProductList products={featuredProducts} loading={loading} />
            
            <div className="mt-12 text-center md:hidden">
              <Link to="/products" className="btn-outline inline-flex">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

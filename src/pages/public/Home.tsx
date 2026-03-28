import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import Layout from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductList from '../../components/product/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { APP_NAME } from '../../utils/constants';

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);



  return (
    <div className="min-h-screen flex flex-col">
      <Layout />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 z-0" />
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-80 h-80 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-secondary-200/30 blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-primary-100 text-primary-600 font-medium text-xs mb-6 animate-slide-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New collections available now
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-dark-800 tracking-tight mb-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Welcome to <span className="text-gradient block mt-1">{APP_NAME}</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base md:text-lg text-dark-500 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              Your ultimate destination for premium mobile accessories, custom gifting, and more. Quality products delivered straight to you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/products" className="btn-primary w-full sm:w-auto text-base px-8 py-3 flex items-center justify-center gap-2">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="btn-outline w-full sm:w-auto text-base px-8 py-3 bg-white/50 backdrop-blur-sm flex items-center justify-center gap-2">
                Contact Us <Phone size={20} className="text-primary-500" />
              </Link>
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

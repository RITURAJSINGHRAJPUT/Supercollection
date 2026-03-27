import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductList from '../../components/product/ProductList';
import CategoryFilter from '../../components/product/CategoryFilter';
import Input from '../../components/common/Input';
import { useProducts, useCategories } from '../../hooks/useProducts';

const Products: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-800 mb-4 animate-slide-up">
            Our Products
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            Browse our complete collection of mobile accessories, custom gifts, and tech essentials.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="w-full md:w-2/3 xl:w-3/4">
            {!categoriesLoading && (
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
            )}
          </div>
          
          <div className="w-full md:w-1/3 xl:w-1/4">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
              className="bg-white"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-dark-500 font-medium">
            Showing <span className="font-bold text-dark-800">{filteredProducts.length}</span> products
            {selectedCategory && <span> in <span className="text-primary-500">{selectedCategory}</span></span>}
          </p>
        </div>

        <ProductList products={filteredProducts} loading={productsLoading} />
      </main>

      <Footer />
    </div>
  );
};

export default Products;

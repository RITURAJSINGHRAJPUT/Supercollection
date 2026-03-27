import React from 'react';
import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';
import { formatCurrency } from '../../utils/formatDate';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleWhatsAppOrder = () => {
    openWhatsApp(product.name, product.price);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md card-hover group animate-fade-in">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-dark-700 shadow-sm">
          {product.category}
        </span>
        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm">Out of Stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-dark-800 text-base mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-gradient mb-3">
          {formatCurrency(product.price)}
        </p>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppOrder}
          disabled={product.stock <= 0}
          className="w-full btn-whatsapp justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle size={18} />
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';
import { formatCurrency } from '../../utils/formatDate';
import { getDriveImageUrl, FALLBACK_IMAGE } from '../../utils/imageUtils';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleWhatsAppOrder = () => {
    openWhatsApp(product.name, product.price);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group animate-fade-in flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={getDriveImageUrl(product.imageUrl) || FALLBACK_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null; // Prevent infinite loops
            img.src = FALLBACK_IMAGE;
          }}
        />
        {/* Category Badge - More subtle */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/90 backdrop-blur-sm text-dark-600 shadow-sm border border-gray-100">
          {product.category}
        </span>
        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-red-500 text-white rounded-md font-bold text-xs uppercase tracking-wider">Out of Stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Last {product.stock}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-grow">
        <h3 className="font-semibold text-dark-800 text-sm mb-0.5 line-clamp-2 min-h-[34px] leading-tight group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-1">
          <p className="text-lg font-black text-dark-900 mb-2">
            {formatCurrency(product.price)}
          </p>

          {/* WhatsApp Button - Extra Compact */}
          <button
            onClick={handleWhatsAppOrder}
            disabled={product.stock <= 0}
            className="w-full py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 bg-green-500 text-white hover:bg-green-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <MessageCircle size={14} />
            Quick Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

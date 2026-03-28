import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { addProduct, updateProduct, deleteProduct } from '../../services/productService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatDate';
import { getDriveImageUrl, FALLBACK_IMAGE } from '../../utils/imageUtils';
import type { Product, ProductFormData } from '../../types/product';

const Products: React.FC = () => {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: ProductFormData = {
    name: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: '',
  };
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);

  const filteredProducts = products.filter(
    p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      if (categories.length > 0) {
        setFormData(prev => ({ ...prev, category: categories[0].name }));
      }
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await addProduct(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleImageHelp = () => {
    alert('To get a Google Drive direct link:\n1. Upload image to Drive\n2. Right click -> Share -> Anyone with link\n3. Copy the link\n4. Paste it here (it will auto-convert)');
  };

  const formatGoogleDriveUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/(.*?)\//);
      if (match && match[1]) {
        return `https://drive.google.com/uc?id=${match[1]}`;
      }
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Products</h1>
          <p className="text-dark-400">Manage your product catalog and inventory</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={20} />}>
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="max-w-md relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-dark-500 text-sm">
                <th className="py-3 px-6 font-semibold">Product</th>
                <th className="py-3 px-6 font-semibold">Category</th>
                <th className="py-3 px-6 font-semibold">Price</th>
                <th className="py-3 px-6 font-semibold">Stock</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-dark-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getDriveImageUrl(product.imageUrl) || FALLBACK_IMAGE} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.onerror = null;
                            img.src = FALLBACK_IMAGE;
                          }}
                        />
                        <span className="font-medium text-dark-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-dark-600">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 font-medium text-dark-800">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Fast Charger 20W"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              min="0"
              required
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
            
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-1.5">Category</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-dark-600">Image URL</label>
              <button 
                type="button" 
                onClick={handleImageHelp}
                className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
              >
                <ExternalLink size={12} /> How to get Drive Link
              </button>
            </div>
            <Input
              type="url"
              placeholder="https://drive.google.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: formatGoogleDriveUrl(e.target.value) })}
            />
            {formData.imageUrl && (
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Link formatted correctly
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingId ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;

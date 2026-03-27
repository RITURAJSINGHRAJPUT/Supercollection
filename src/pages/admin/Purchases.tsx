import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { subscribeToPurchases, addPurchase, deletePurchase } from '../../services/purchaseService';
import { updateStock } from '../../services/productService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { getToday, formatCurrency, formatDateTime } from '../../utils/formatDate';
import type { Purchase, PurchaseFormData } from '../../types/purchase';

const Purchases: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PurchaseFormData>({
    productId: '',
    quantity: 1,
    costPrice: 0,
    date: getToday(),
  });

  useEffect(() => {
    const unsub = subscribeToPurchases((data) => {
      setPurchases(data);
      setPurchasesLoading(false);
    }, (error) => {
      console.error('Purchase subscription error:', error);
      setPurchasesLoading(false);
    });
    return unsub;
  }, []);

  const handleProductSelect = (productId: string) => {
    setFormData(prev => ({ ...prev, productId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity <= 0 || formData.costPrice <= 0) {
      alert('Please fill out all fields correctly');
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    try {
      setIsSubmitting(true);
      
      // 1. Add Purchase
      await addPurchase({
        ...formData,
        date: new Date(formData.date).toISOString()
      });

      // 2. Increase Stock
      await updateStock(product.id, product.stock + formData.quantity);

      setFormData({
        productId: '',
        quantity: 1,
        costPrice: 0,
        date: getToday(),
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error recording purchase:', error);
      alert('Failed to record purchase');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (purchaseId: string, productId: string, quantity: number) => {
    if (window.confirm('Delete this purchase record? Note: This will deduct the stock quantity.')) {
      try {
        await deletePurchase(purchaseId);
        
        // Deduct stock
        const product = products.find(p => p.id === productId);
        if (product) {
          const newStock = Math.max(0, product.stock - quantity);
          await updateStock(productId, newStock);
        }
      } catch (error) {
        console.error('Error deleting purchase:', error);
        alert('Failed to delete record');
      }
    }
  };

  if (productsLoading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Purchase Register</h1>
          <p className="text-dark-400">Record stock incoming and supplier purchases</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />} variant="secondary">
          New Purchase
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-dark-500 text-sm">
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold">Product</th>
                <th className="py-3 px-6 font-semibold text-right">Quantity</th>
                <th className="py-3 px-6 font-semibold text-right">Cost Price</th>
                <th className="py-3 px-6 font-semibold text-right">Total</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchasesLoading ? (
                <tr>
                   <td colSpan={6} className="py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-dark-400">
                    <ShoppingCart size={48} className="mx-auto text-dark-200 mb-4" />
                    No purchases recorded yet.
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => {
                  const product = products.find(p => p.id === purchase.productId);
                  return (
                    <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6 whitespace-nowrap text-dark-600 text-sm">
                        {formatDateTime(purchase.date)}
                      </td>
                      <td className="py-3 px-6 font-medium text-dark-800">
                        {product?.name || purchase.productName || 'Unknown Product'}
                      </td>
                      <td className="py-3 px-6 text-right font-medium">
                        {purchase.quantity}
                      </td>
                      <td className="py-3 px-6 text-right text-dark-600">
                        {formatCurrency(purchase.costPrice)}
                      </td>
                      <td className="py-3 px-6 text-right font-bold text-blue-600">
                        {formatCurrency(purchase.total)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleDelete(purchase.id, purchase.productId, purchase.quantity)}
                          className="p-1.5 text-dark-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 mx-auto"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Purchase"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-dark-600 mb-1.5">Select Product</label>
             <select
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
               required
               value={formData.productId}
               onChange={(e) => handleProductSelect(e.target.value)}
             >
               <option value="" disabled>Search or select product...</option>
               {products.map(p => (
                 <option key={p.id} value={p.id}>
                   {p.name} (Current Stock: {p.stock})
                 </option>
               ))}
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity Purchased"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            />
            
            <Input
              label="Cost Price per unit (₹)"
              type="number"
              min="0"
              required
              value={formData.costPrice || ''}
              onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Purchase Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={getToday()}
          />

          {formData.quantity > 0 && formData.costPrice > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
              <span className="text-dark-500 font-medium">Total Cost:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(formData.quantity * formData.costPrice)}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} variant="secondary">
              Record Purchase
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Purchases;

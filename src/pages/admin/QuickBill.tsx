import React, { useState, useEffect } from 'react';
import { Zap, ShoppingCart, TrendingUp, History, Trash2, CheckCircle2 } from 'lucide-react';
import { useCategories } from '../../hooks/useProducts';
import { 
  addQuickSale, 
  addQuickPurchase, 
  subscribeToQuickSales, 
  subscribeToQuickPurchases,
  deleteQuickSale,
  deleteQuickPurchase 
} from '../../services/quickBillService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { getToday, formatCurrency, formatDateTime } from '../../utils/formatDate';
import type { QuickEntry, QuickEntryFormData } from '../../types/quickBill';

const QuickBill: React.FC = () => {
  const { categories } = useCategories();
  const [type, setType] = useState<'sale' | 'purchase'>('sale');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<QuickEntryFormData>({
    category: '',
    price: 0,
    quantity: 1,
    date: getToday(),
  });

  const [recentSales, setRecentSales] = useState<QuickEntry[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<QuickEntry[]>([]);

  useEffect(() => {
    const unsubSales = subscribeToQuickSales((data) => setRecentSales(data.slice(0, 5)));
    const unsubPurchases = subscribeToQuickPurchases((data) => setRecentPurchases(data.slice(0, 5)));
    return () => {
      unsubSales();
      unsubPurchases();
    };
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || formData.price <= 0 || formData.quantity <= 0) {
      alert('Please fill all fields with valid data');
      return;
    }

    try {
      setIsSubmitting(true);
      if (type === 'sale') {
        await addQuickSale(formData);
        setSuccessMessage('Quick Sale recorded successfully!');
      } else {
        await addQuickPurchase(formData);
        setSuccessMessage('Quick Purchase recorded successfully!');
      }

      // Reset form but keep category and date
      setFormData(prev => ({
        ...prev,
        price: 0,
        quantity: 1,
      }));

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving quick bill:', error);
      alert('Failed to save entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, entryType: 'sale' | 'purchase') => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        if (entryType === 'sale') {
          await deleteQuickSale(id);
        } else {
          await deleteQuickPurchase(id);
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry');
      }
    }
  };

  const totalAmount = formData.price * formData.quantity;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800 flex items-center gap-2">
            <Zap className="text-primary-500 fill-primary-500/10" size={28} />
            Quick Bill
          </h1>
          <p className="text-dark-400">Record transactions instantly without product entry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Billing Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-1 px-1 bg-gray-50/50 flex border-b border-gray-100">
              <button
                onClick={() => setType('sale')}
                className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 font-bold transition-all duration-200 ${
                  type === 'sale' 
                    ? 'bg-white text-primary-600 shadow-sm rounded-t-xl' 
                    : 'text-dark-400 hover:text-dark-600'
                }`}
              >
                <TrendingUp size={18} />
                New Sale
              </button>
              <button
                onClick={() => setType('purchase')}
                className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 font-bold transition-all duration-200 ${
                  type === 'purchase' 
                    ? 'bg-white text-secondary-600 shadow-sm rounded-t-xl' 
                    : 'text-dark-400 hover:text-dark-600'
                }`}
              >
                <ShoppingCart size={18} />
                New Purchase
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 size={18} />
                  <span className="font-medium text-sm">{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Select Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 bg-white"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="" disabled>Choose a category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Price per Unit (₹)"
                    type="number"
                    min="0"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="Enter amount"
                  />
                  
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>

                <Input
                  label="Transaction Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={getToday()}
                />

                <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center space-y-2 ${
                  type === 'sale' ? 'bg-primary-50/30 border-primary-100' : 'bg-secondary-50/30 border-secondary-100'
                }`}>
                  <span className="text-dark-500 text-sm font-medium">Total Payable Amount</span>
                  <span className={`text-4xl font-black ${
                    type === 'sale' ? 'text-primary-600' : 'text-secondary-600'
                  }`}>
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <Button 
                  type="submit" 
                  loading={isSubmitting} 
                  className={`w-full py-4 text-lg shadow-lg ${
                    type === 'sale' 
                      ? 'shadow-primary-500/20' 
                      : 'bg-secondary-600 hover:bg-secondary-700 shadow-secondary-500/20'
                  }`}
                >
                  {type === 'sale' ? 'Confirm Sale Entry' : 'Confirm Purchase Entry'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-dark-800 mb-5 flex items-center gap-2">
              <History size={20} className="text-primary-500" />
              Recent Transactions
            </h3>

            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-bold text-dark-400 uppercase tracking-widest">Recent Sales</p>
                {recentSales.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-bold text-dark-800 text-sm">{entry.category}</p>
                        <p className="text-[10px] text-dark-400">{formatDateTime(entry.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-sm">+{formatCurrency(entry.total)}</p>
                        <p className="text-[10px] text-dark-400">Qty: {entry.quantity}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(entry.id, 'sale')}
                        className="p-1.5 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {recentSales.length === 0 && (
                  <p className="text-center py-4 text-sm text-dark-300 italic">No recent sales</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-dark-400 uppercase tracking-widest">Recent Purchases</p>
                {recentPurchases.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        P
                      </div>
                      <div>
                        <p className="font-bold text-dark-800 text-sm">{entry.category}</p>
                        <p className="text-[10px] text-dark-400">{formatDateTime(entry.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-blue-600 text-sm">-{formatCurrency(entry.total)}</p>
                        <p className="text-[10px] text-dark-400">Qty: {entry.quantity}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(entry.id, 'purchase')}
                        className="p-1.5 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {recentPurchases.length === 0 && (
                  <p className="text-center py-4 text-sm text-dark-300 italic">No recent purchases</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBill;

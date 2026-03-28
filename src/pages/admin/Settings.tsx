import React, { useState } from 'react';
import { AlertTriangle, FileJson, FileSpreadsheet } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { useSales } from '../../hooks/useSales';
import { getPurchases } from '../../services/purchaseService';
import { clearAllSales } from '../../services/salesService';
import { clearAllPurchases } from '../../services/purchaseService';
import { 
  getQuickSales, 
  getQuickPurchases, 
  clearAllQuickSales, 
  clearAllQuickPurchases 
} from '../../services/quickBillService';
import { exportToJSON, exportToCSV } from '../../utils/dataExport';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Settings: React.FC = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { sales } = useSales();
  
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearConfirmation, setClearConfirmation] = useState('');

  const handleExportData = async (type: 'json' | 'csv') => {
    try {
      const [purchases, quickSales, quickPurchases] = await Promise.all([
        getPurchases(),
        getQuickSales(),
        getQuickPurchases()
      ]);
      
      const fullData = {
        products,
        categories,
        sales,
        purchases,
        quickSales,
        quickPurchases,
      };

      if (type === 'json') {
        exportToJSON(fullData, `SuperCollection_Backup_${new Date().toISOString().split('T')[0]}`);
      } else {
        // For CSV, export just sales/products as multiple files or a combined flat structure
        // Let's just export sales for the simplified CSV
        if (sales.length > 0) {
          exportToCSV(sales, `SuperCollection_Sales_${new Date().toISOString().split('T')[0]}`);
        } else {
          alert('No sales data to export to CSV.');
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const handleClearData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clearConfirmation !== 'DELETE') return;

    try {
      setIsClearing(true);
      
      // Clear all sales and purchases (standard and quick)
      await Promise.all([
        clearAllSales(),
        clearAllPurchases(),
        clearAllQuickSales(),
        clearAllQuickPurchases()
      ]);
      
      setClearConfirmation('');
      setIsClearModalOpen(false);
      alert('All transactional data (including Quick Bill entries) cleared successfully. Products and Categories were kept intact.');
    } catch (error) {
      console.error('Clear data failed:', error);
      alert('Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-dark-800">Settings & Admin Tools</h1>
        <p className="text-dark-400">Manage data exports and system resets</p>
      </div>

      {/* Export Data Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-slide-up">
        <h2 className="text-xl font-bold text-dark-800 mb-2">Data Export</h2>
        <p className="text-dark-400 mb-6">
          Download a complete backup of your store's data including products, categories, sales, and purchases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => handleExportData('json')} 
            variant="outline" 
            icon={<FileJson size={20} />}
            className="flex-1"
          >
            Export All as JSON (Backup)
          </Button>
          <Button 
            onClick={() => handleExportData('csv')} 
            variant="outline" 
            icon={<FileSpreadsheet size={20} />}
            className="flex-1"
          >
            Export Sales as CSV
          </Button>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 md:p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="text-red-500" size={24} />
          <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-dark-400 mb-6">
          Irreversible actions that affect your entire store database. Proceed with extreme caution.
        </p>

        <div className="p-5 border border-red-200 bg-red-50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-dark-800">Clear Transactional Data</h3>
            <p className="text-sm text-dark-500 mt-1">
              Deletes ALL Sales and Purchases. <br className="hidden md:block"/>
              <strong>Products and Categories will NOT be deleted.</strong>
            </p>
          </div>
          <Button 
            variant="danger" 
            onClick={() => setIsClearModalOpen(true)}
            className="whitespace-nowrap"
          >
            Clear Records
          </Button>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => {
          setIsClearModalOpen(false);
          setClearConfirmation('');
        }}
        title="⚠️ Destructive Action Warning"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-1">What happens when you confirm?</h4>
            <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
              <li>Every single Sale record will be permanently deleted.</li>
              <li>Every single Purchase record will be permanently deleted.</li>
              <li>Every single Quick Bill entry will be permanently deleted.</li>
              <li>Your Analytics dashboard will be completely reset.</li>
              <li>Your Products and Categories will remain unchanged.</li>
              <li>Your Product stock counts will remain at their current numbers.</li>
            </ul>
          </div>

          <p className="text-dark-600 font-medium pt-2">
            To confirm this action, please type <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-bold">DELETE</span> in the box below:
          </p>

          <form onSubmit={handleClearData}>
            <input
              type="text"
              value={clearConfirmation}
              onChange={(e) => setClearConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 mb-6 font-mono text-center tracking-widest uppercase"
              required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => {
                  setIsClearModalOpen(false);
                  setClearConfirmation('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="danger" 
                loading={isClearing}
                disabled={clearConfirmation !== 'DELETE'}
              >
                I understand, delete data
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCategories } from '../../hooks/useProducts';
import { addCategory, deleteCategory } from '../../services/categoryService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const Categories: React.FC = () => {
  const { categories, loading } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await addCategory({ name: name.trim() });
      setName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Categories</h1>
          <p className="text-dark-400">Manage product categories</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-dark-400">
            <p className="mb-4">No categories created yet.</p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" size="sm">Create First Category</Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li key={category.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center font-bold text-lg">
                    {category.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-dark-800 text-lg">{category.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-dark-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 self-end sm:self-auto"
                  title="Delete Category"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mobile Accessories"
            autoFocus
          />
          
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;

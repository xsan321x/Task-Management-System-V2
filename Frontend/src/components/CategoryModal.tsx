import { useState, useEffect } from 'react';
import { categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { AVAILABLE_COLORS } from './CategorySection';

interface CategoryModalProps {
  onClose: () => void;
  onSave: () => void;
}

const DEFAULT_CATEGORIES = [
  'Work', 'Personal', 'Family', 'Health', 'Finance', 
  'Education', 'Shopping', 'Travel', 'Custom'
];

export default function CategoryModal({ onClose, onSave }: CategoryModalProps) {
  const [step, setStep] = useState<'select' | 'custom'>('select');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch existing categories to check for duplicates
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        setExistingCategories(response.data.categories.map((cat: any) => cat.name.toLowerCase()));
      } catch (error) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    if (category === 'Custom') {
      setStep('custom');
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const name = step === 'custom' ? customName : selectedCategory;
      
      // Check for duplicate categories
      if (existingCategories.includes(name.toLowerCase())) {
        toast.error(`Category "${name}" already exists`);
        setLoading(false);
        return;
      }

      await categoryAPI.createCategory({ name, color: selectedColor });
      toast.success('Category created successfully');
      onSave();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'select' ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Choose a category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCategory === category
                          ? 'border-yellow-500 bg-yellow-500/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-300">{category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCategory && selectedCategory !== 'Custom' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Choose a color
                    </label>
                    <div className="grid grid-cols-9 gap-2">
                      {AVAILABLE_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-500' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      {loading ? 'Creating...' : 'Create Category'}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  placeholder="Enter category name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Choose a color
                </label>
                <div className="grid grid-cols-9 gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

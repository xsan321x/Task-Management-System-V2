import { useState, useEffect } from 'react';
import { Task, Category } from '@/types';
import { taskAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
  preselectedDate?: Date;
}

export default function TaskModal({ task, onClose, onSave, categories, preselectedDate }: TaskModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'not-started' | 'in-progress' | 'review' | 'completed';
    dueDate: string;
    categories: string[];
  }>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'not-started',
    dueDate: '',
    categories: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        categories: task.categories || [],
      });
    } else if (preselectedDate) {
      const dateStr = preselectedDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, dueDate: dateStr }));
    }
  }, [task, preselectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task) {
        await taskAPI.updateTask(task._id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskAPI.createTask(formData);
        toast.success('Task created successfully');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter(c => c !== categoryName)
        : [...prev.categories, categoryName]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 pb-3">
          <h2 className="text-xl font-bold text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Status
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'not-started' | 'in-progress' | 'review' | 'completed' })}
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Categories
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      formData.categories.includes(category.name)
                        ? 'text-white border-2'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                    }`}
                    style={formData.categories.includes(category.name) ? { backgroundColor: category.color, borderColor: category.color } : {}}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2.5 pt-3">
            <button type="button" onClick={onClose} className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm">
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

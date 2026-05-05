'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { taskAPI, categoryAPI } from '@/lib/api';
import { Task, Category } from '@/types';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Calendar from '@/components/Calendar';
import CategorySection from '@/components/CategorySection';
import TaskModal from '@/components/TaskModal';
import CategoryModal from '@/components/CategoryModal';
import SettingsModal from '@/components/SettingsModal';
import FilterPanel, { FilterOptions } from '@/components/FilterPanel';
import Tooltip from '@/components/Tooltip';
import SimpleTaskCard from '@/components/SimpleTaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import { format } from 'date-fns';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });
  const [filters, setFilters] = useState<FilterOptions>({
    priority: [],
    taskStatus: [],
    dueDate: 'all',
    sortBy: 'newest',
  });
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    fetchTasks();
    fetchCategories();
  }, [router]);

  useEffect(() => {
    applyFilters();
  }, [tasks, selectedDate, selectedCategory, searchQuery, filters, selectedDate]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filter by priority
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // Filter by task status (new status field)
    if (filters.taskStatus.length > 0) {
      filtered = filtered.filter(task => filters.taskStatus.includes(task.status));
    }

    // Filter by due date (from filter panel)
    if (filters.dueDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filters.dueDate === 'overdue') {
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
      } else if (filters.dueDate === 'today') {
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (filters.dueDate === 'upcoming') {
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today;
        });
      } else if (filters.dueDate === 'no-date') {
        filtered = filtered.filter(task => !task.dueDate);
      }
    }

    // Filter by selected date from calendar (only if user explicitly selected a date)
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate.startsWith(dateStr);
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => 
        task.categories && task.categories.includes(selectedCategory)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks
    switch (filters.sortBy) {
      case 'priority-high':
        filtered.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                 priorityOrder[a.priority as keyof typeof priorityOrder];
        });
        break;
      case 'priority-low':
        filtered.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        });
        break;
      case 'due-date':
        filtered.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredTasks(filtered);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      // If the task object has a status property, use it; otherwise toggle completed
      const updateData = task.status 
        ? { status: task.status }
        : { completed: !task.completed };
      
      await taskAPI.updateTask(task._id, updateData);
      setTasks(tasks.map(t => t._id === task._id ? task : t));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setPreselectedDate(undefined);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskAPI.deleteTask(id);
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleDateSelect = (date: Date) => {
    setCalendarDate(date);
    setSelectedDate(date);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setPreselectedDate(selectedDate || undefined);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setPreselectedDate(undefined);
  };

  const handleTaskSaved = () => {
    fetchTasks();
    handleTaskModalClose();
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategorySaved = () => {
    fetchCategories();
    handleCategoryModalClose();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryAPI.deleteCategory(id);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleUserUpdate = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser({ name: userData.name, email: userData.email });
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
      const updatedTasks = tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t);
      setTasks(updatedTasks);
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  // Bulk actions
  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const selectAllTasks = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t._id)));
    }
  };

  const deleteSelectedTasks = async () => {
    if (selectedTasks.size === 0) return;
    if (!confirm(`Delete ${selectedTasks.size} task(s)?`)) return;

    try {
      await Promise.all(Array.from(selectedTasks).map(id => taskAPI.deleteTask(id)));
      const updatedTasks = tasks.filter(t => !selectedTasks.has(t._id));
      setTasks(updatedTasks);
      setSelectedTasks(new Set());
      toast.success(`${selectedTasks.size} task(s) deleted`);
    } catch (error) {
      toast.error('Failed to delete tasks');
    }
  };

  // Task duplication
  const duplicateTask = async (task: Task) => {
    try {
      const newTask = {
        title: `${task.title} (Copy)`,
        description: task.description,
        priority: task.priority,
        status: 'not-started' as const,
        dueDate: task.dueDate,
        categories: task.categories,
      };
      const response = await taskAPI.createTask(newTask);
      const updatedTasks = [...tasks, response.data.task];
      setTasks(updatedTasks);
      toast.success('Task duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate task');
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      callback: handleNewTask,
    },
    {
      key: 'a',
      ctrlKey: true,
      callback: selectAllTasks,
    },
  ]);

  // Drag and Drop Handlers - Native HTML Drag & Drop
  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDragEnd = () => {
    // Reset any drag state
  };

  const handleColumnDragOver = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStatus(null);
  };

  const handleColumnDrop = async (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    setDragOverStatus(null);

    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const draggedTask = tasks.find(t => t._id === taskId);
    if (!draggedTask || draggedTask.status === targetStatus) return;

    await handleStatusChange(draggedTask, targetStatus);
  };

  const tasksWithDates = tasks
    .filter(task => task.dueDate)
    .map(task => format(new Date(task.dueDate!), 'yyyy-MM-dd'));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Left Sidebar - Compact */}
      <Sidebar onSettingsClick={() => setIsSettingsModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 ml-20 md:ml-20 sm:ml-16 flex flex-col">
        {/* Top Bar - STICKY */}
        <div className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700 px-2 sm:px-4 py-2">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* App Name */}
            <h1 className="text-base sm:text-lg font-bold text-white whitespace-nowrap">TaskFlow</h1>
            
            {/* Search and Controls */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Search Bar */}
              <div className="flex-1 relative min-w-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-2 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all text-xs sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Clear Filters Button - Shows when filters are active */}
              {(selectedDate || selectedCategory) && (
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedCategory(null);
                    setCalendarDate(new Date());
                  }}
                  className="px-2 sm:px-4 py-2 sm:py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 border border-red-800 whitespace-nowrap"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}

              {/* Filter Button */}
              <FilterPanel 
                onFilterChange={setFilters}
                selectedFilters={filters}
              />

              {/* Add New Task Button */}
              <button onClick={handleNewTask} className="px-2 sm:px-4 py-2 sm:py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-colors shadow-lg whitespace-nowrap text-xs sm:text-sm">
                <span className="text-base sm:text-lg">+</span>
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-2 sm:p-4 overflow-auto">
          {/* Calendar and Category Section - Responsive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-4">
            {/* Calendar Section - Compact (1 column) */}
            <div className="bg-gray-800 border border-gray-700 p-2 sm:p-2.5 rounded-xl overflow-hidden flex flex-col shadow-lg">
              <Calendar
                selectedDate={calendarDate}
                onDateSelect={handleDateSelect}
                tasksWithDates={tasksWithDates}
              />
            </div>

            {/* Category Section - Takes remaining columns */}
            <div className="sm:col-span-1 lg:col-span-3 bg-gray-800 border border-gray-700 p-2 sm:p-2.5 rounded-xl overflow-hidden flex flex-col shadow-lg">
              <CategorySection
                categories={categories}
                onAddCategory={() => setIsCategoryModalOpen(true)}
                onSelectCategory={(cat) => setSelectedCategory(cat === selectedCategory ? null : cat)}
                selectedCategory={selectedCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
          </div>

          {/* Kanban Board - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 h-full">
            {(['not-started', 'in-progress', 'review', 'completed'] as const).map((status) => {
              const statusTasks = filteredTasks.filter(task => task.status === status);
              const statusLabels = {
                'not-started': 'Not Started',
                'in-progress': 'In Progress',
                'review': 'Review',
                'completed': 'Completed'
              };
              const statusColors = {
                'not-started': { 
                  header: 'bg-gray-700 border-gray-600',
                  accent: 'text-gray-300',
                  button: 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                },
                'in-progress': { 
                  header: 'bg-blue-900/40 border-blue-700',
                  accent: 'text-blue-300',
                  button: 'bg-blue-900/40 hover:bg-blue-900/60 text-blue-300'
                },
                'review': { 
                  header: 'bg-purple-900/40 border-purple-700',
                  accent: 'text-purple-300',
                  button: 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300'
                },
                'completed': { 
                  header: 'bg-green-900/40 border-green-700',
                  accent: 'text-green-300',
                  button: 'bg-green-900/40 hover:bg-green-900/60 text-green-300'
                }
              };

              return (
                <div
                  key={status}
                  className={`flex flex-col bg-gray-800 border-2 rounded-xl overflow-hidden shadow-lg transition-all ${
                    dragOverStatus === status
                      ? 'border-yellow-400 ring-2 ring-yellow-400/50 bg-gray-750'
                      : 'border-gray-700 hover:shadow-xl'
                  }`}
                  onDragOver={(e) => handleColumnDragOver(e, status)}
                  onDragLeave={handleColumnDragLeave}
                  onDrop={(e) => handleColumnDrop(e, status)}
                >
                  {/* Column Header */}
                  <div className={`${statusColors[status].header} border-b border-gray-700 p-2 sm:p-3`}>
                    <h3 className={`font-bold text-xs sm:text-base ${statusColors[status].accent}`}>{statusLabels[status]}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{statusTasks.length} {statusTasks.length === 1 ? 'task' : 'tasks'}</p>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 min-h-64 sm:min-h-96">
                    {statusTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-gray-500">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-xs sm:text-sm font-medium">No tasks</p>
                      </div>
                    ) : (
                      statusTasks.map((task) => (
                        <SimpleTaskCard
                          key={task._id}
                          task={task}
                          isSelected={selectedTasks.has(task._id)}
                          onSelectTask={toggleTaskSelection}
                          onEditTask={handleEditTask}
                          onDeleteTask={handleDeleteTask}
                          onDuplicateTask={duplicateTask}
                          onStatusChange={handleStatusChange}
                          status={status}
                          statusColors={statusColors}
                          onDragStart={handleTaskDragStart}
                          onDragEnd={handleTaskDragEnd}
                          onViewDetails={setSelectedTaskForDetail}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isTaskModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleTaskModalClose}
          onSave={handleTaskSaved}
          categories={categories}
          preselectedDate={preselectedDate}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          onClose={handleCategoryModalClose}
          onSave={handleCategorySaved}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          onClose={() => setIsSettingsModalOpen(false)}
          currentUser={currentUser}
          onUpdate={handleUserUpdate}
        />
      )}

      {/* Bulk Actions Bar */}
      {selectedTasks.size > 0 && (
        <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 right-2 sm:right-auto bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-2 sm:p-3 flex flex-wrap items-center gap-1.5 sm:gap-3 z-40 animate-slide-up max-w-sm sm:max-w-none">
          <span className="text-white font-semibold text-xs sm:text-sm">{selectedTasks.size} selected</span>
          <button
            onClick={selectAllTasks}
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors"
          >
            {selectedTasks.size === filteredTasks.length ? 'Deselect' : 'Select All'}
          </button>
          <button
            onClick={deleteSelectedTasks}
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs transition-colors border border-red-800"
          >
            Delete
          </button>
          <button
            onClick={() => setSelectedTasks(new Set())}
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTaskForDetail && (
        <TaskDetailModal
          task={selectedTaskForDetail}
          onClose={() => setSelectedTaskForDetail(null)}
          onEdit={(task) => {
            setEditingTask(task);
            setPreselectedDate(undefined);
            setIsTaskModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

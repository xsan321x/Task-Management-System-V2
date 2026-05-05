'use client';

import { Task } from '@/types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export default function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onStatusChange,
}: TaskDetailModalProps) {
  const [currentTask, setCurrentTask] = useState(task);

  // Update local state when task prop changes
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(currentTask.dueDate);

  const statusLabels = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'review': 'Review',
    'completed': 'Completed',
  };

  const statusColors = {
    'not-started': 'bg-gray-600 text-gray-200',
    'in-progress': 'bg-blue-600 text-blue-100',
    'review': 'bg-purple-600 text-purple-100',
    'completed': 'bg-green-600 text-green-100',
  };

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  const statusOrder = ['not-started', 'in-progress', 'review', 'completed'] as const;

  const handleStatusClick = (newStatus: Task['status']) => {
    setCurrentTask({ ...currentTask, status: newStatus });
    onStatusChange(currentTask, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Just Title */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-750 border-b border-gray-700 p-5">
          <h2 className="text-2xl font-bold text-white">{currentTask.title}</h2>
        </div>

        {/* Progress Slider */}
        <div className="bg-gray-800 border-b border-gray-700 px-5 py-4">
          <p className="text-gray-300 text-xs font-semibold mb-3">Progress</p>
          <div className="flex gap-2">
            {statusOrder.map((status) => {
              const statusButtonColors = {
                'not-started': 'bg-gray-600 hover:bg-gray-500 text-gray-100',
                'in-progress': 'bg-blue-600 hover:bg-blue-500 text-blue-100',
                'review': 'bg-purple-600 hover:bg-purple-500 text-purple-100',
                'completed': 'bg-green-600 hover:bg-green-500 text-green-100',
              };
              
              return (
                <button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all transform hover:scale-105 ${
                    currentTask.status === status
                      ? `${statusButtonColors[status as keyof typeof statusButtonColors]} ring-2 ring-offset-2 ring-offset-gray-800 shadow-lg`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {statusLabels[status as keyof typeof statusLabels]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description */}
          {currentTask.description && (
            <div>
              <h3 className="text-base font-semibold text-gray-200 mb-2">Description</h3>
              <div 
                className="text-gray-400 leading-relaxed text-sm prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: currentTask.description }}
              />
            </div>
          )}

          {/* Categories */}
          {currentTask.categories && currentTask.categories.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-200 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {currentTask.categories.map((cat, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-full text-xs font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          {currentTask.dueDate && (
            <div>
              <h3 className="text-base font-semibold text-gray-200 mb-2">Due Date</h3>
              <div
                className={`px-4 py-2 rounded-lg inline-block font-semibold text-sm ${
                  daysUntilDue !== null && daysUntilDue < 0
                    ? 'text-red-300 bg-red-900/30 border border-red-800'
                    : daysUntilDue === 0
                    ? 'text-yellow-300 bg-yellow-900/30 border border-yellow-800'
                    : daysUntilDue && daysUntilDue <= 3
                    ? 'text-yellow-300 bg-yellow-900/30 border border-yellow-800'
                    : 'text-gray-300 bg-gray-700 border border-gray-600'
                }`}
              >
                {format(new Date(currentTask.dueDate), 'MMM d, yyyy')}
                {daysUntilDue !== null && (
                  <span className="ml-2 text-xs">
                    {daysUntilDue < 0 && `(${Math.abs(daysUntilDue)} days overdue)`}
                    {daysUntilDue === 0 && '(Due today)'}
                    {daysUntilDue > 0 && `(${daysUntilDue} days left)`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div>
            <h3 className="text-base font-semibold text-gray-200 mb-2">Created</h3>
            <p className="text-gray-400 text-sm">{format(new Date(currentTask.createdAt), 'MMM d, yyyy h:mm a')}</p>
          </div>
        </div>

        {/* Footer: Status, Priority, and Action Buttons */}
        <div className="bg-gray-800 border-t border-gray-700 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                statusColors[currentTask.status as keyof typeof statusColors]
              }`}
            >
              {statusLabels[currentTask.status as keyof typeof statusLabels]}
            </span>
            <span className={`text-xs font-semibold ${priorityColors[currentTask.priority as keyof typeof priorityColors]}`}>
              {currentTask.priority.charAt(0).toUpperCase() + currentTask.priority.slice(1)} Priority
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-semibold transition-colors text-sm"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(currentTask);
                onClose();
              }}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

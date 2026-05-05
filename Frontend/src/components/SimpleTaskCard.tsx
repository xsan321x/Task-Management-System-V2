'use client';

import { Task } from '@/types';
import Tooltip from './Tooltip';
import { useState } from 'react';

interface SimpleTaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelectTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
  status: Task['status'];
  statusColors: any;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onViewDetails: (task: Task) => void;
}

export default function SimpleTaskCard({
  task,
  isSelected,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onStatusChange,
  status,
  statusColors,
  onDragStart,
  onDragEnd,
  onViewDetails,
}: SimpleTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(task.dueDate);

  const handleDragStart = (e: React.DragEvent) => {
    // Add a small delay to prevent instant drag
    setTimeout(() => {
      setIsDragging(true);
    }, 100);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task._id);
    e.dataTransfer.setData('currentStatus', status);
    
    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.left = '-9999px';
    dragImage.style.backgroundColor = '#374151';
    dragImage.style.border = '2px solid #eab308';
    dragImage.style.borderRadius = '0.5rem';
    dragImage.style.padding = '1rem';
    dragImage.style.color = 'white';
    dragImage.style.fontSize = '0.875rem';
    dragImage.style.fontWeight = '600';
    dragImage.style.maxWidth = '200px';
    dragImage.textContent = task.title;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
    
    onDragStart(e, task);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd(e);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('input, button')) {
          return;
        }
        onViewDetails(task);
      }}
      className={`bg-gray-700 border-2 rounded-lg p-2 sm:p-3 transition-all cursor-move group ${
        isSelected ? 'border-yellow-500 ring-2 ring-yellow-500/50' : 'border-gray-600'
      } ${isDragging ? 'opacity-50 shadow-2xl scale-105 border-yellow-400 ring-2 ring-yellow-400/50' : 'hover:border-gray-500 hover:shadow-lg'}`}
    >
      {/* Header with Checkbox */}
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <div className="flex items-start gap-1 sm:gap-1.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectTask(task._id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 rounded border-gray-500 bg-gray-600 text-yellow-500 cursor-pointer accent-yellow-500"
          />
          <div
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 mt-1 sm:mt-1.5 ${
              task.priority === 'high'
                ? 'bg-red-500'
                : task.priority === 'medium'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
          />
        </div>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content="Duplicate" position="left">
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateTask(task);
                }}
                className="p-0.5 sm:p-1 hover:bg-blue-900/30 rounded-lg transition-colors"
                type="button"
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </Tooltip>

          <Tooltip content="Delete" position="left">
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task._id);
                }}
                className="p-0.5 sm:p-1 hover:bg-red-900/30 rounded-lg transition-colors"
                type="button"
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-xs sm:text-xs text-white line-clamp-2 mb-1 sm:mb-1.5">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-1.5 sm:mb-2">{task.description}</p>
      )}

      {/* Categories */}
      {task.categories && task.categories.length > 0 && (
        <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2 flex-wrap">
          {task.categories.slice(0, 2).map((cat, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-600 text-gray-200 px-1.5 sm:px-2 py-0.5 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
          {task.categories.length > 2 && (
            <span className="text-xs bg-gray-600 text-gray-200 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
              +{task.categories.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div
          className={`text-xs font-semibold mb-1.5 sm:mb-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg inline-block ${
            daysUntilDue !== null && daysUntilDue < 0
              ? 'text-red-300 bg-red-900/30 border border-red-800'
              : daysUntilDue === 0
              ? 'text-yellow-300 bg-yellow-900/30 border border-yellow-800'
              : daysUntilDue && daysUntilDue <= 3
              ? 'text-yellow-300 bg-yellow-900/30 border border-yellow-800'
              : 'text-gray-300 bg-gray-600/30 border border-gray-600'
          }`}
        >
          {daysUntilDue !== null && (
            <>
              {daysUntilDue < 0 && `${Math.abs(daysUntilDue)}d overdue`}
              {daysUntilDue === 0 && 'Due today'}
              {daysUntilDue > 0 && `${daysUntilDue}d left`}
            </>
          )}
        </div>
      )}

      {/* Status Transition Buttons */}
      <div className="flex gap-1 sm:gap-1.5 pt-1.5 sm:pt-2 border-t border-gray-600">
        {status !== 'not-started' && (
          <Tooltip content="Move to previous stage" position="top">
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const prevStatus =
                    status === 'in-progress'
                      ? 'not-started'
                      : status === 'review'
                      ? 'in-progress'
                      : status === 'completed'
                      ? 'review'
                      : 'not-started';
                  onStatusChange(task, prevStatus);
                }}
                className={`flex-1 text-xs px-1 sm:px-1.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors ${statusColors[status].button}`}
                type="button"
              >
                Back
              </button>
            </div>
          </Tooltip>
        )}
        {status !== 'completed' && (
          <Tooltip content="Move to next stage" position="top">
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextStatus =
                    status === 'not-started'
                      ? 'in-progress'
                      : status === 'in-progress'
                      ? 'review'
                      : 'completed';
                  onStatusChange(task, nextStatus);
                }}
                className="flex-1 text-xs px-1 sm:px-1.5 py-1 sm:py-1.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors"
                type="button"
              >
                Next
              </button>
            </div>
          </Tooltip>
        )}
        <Tooltip content="Edit task" position="top">
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task);
              }}
              className="flex-1 text-xs px-1 sm:px-1.5 py-1 sm:py-1.5 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg font-semibold transition-colors"
              type="button"
            >
              Edit
            </button>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

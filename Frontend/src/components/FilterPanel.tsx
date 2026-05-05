'use client';

import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  selectedFilters: FilterOptions;
}

export interface FilterOptions {
  priority: string[];
  taskStatus: string[];
  dueDate: string;
  sortBy: string;
}

export default function FilterPanel({ onFilterChange, selectedFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = selectedFilters.priority.includes(priority)
      ? selectedFilters.priority.filter(p => p !== priority)
      : [...selectedFilters.priority, priority];
    
    onFilterChange({
      ...selectedFilters,
      priority: newPriorities,
    });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = selectedFilters.taskStatus.includes(status)
      ? selectedFilters.taskStatus.filter(s => s !== status)
      : [...selectedFilters.taskStatus, status];
    
    onFilterChange({
      ...selectedFilters,
      taskStatus: newStatuses,
    });
  };

  const handleDueDateChange = (dueDate: string) => {
    onFilterChange({
      ...selectedFilters,
      dueDate: selectedFilters.dueDate === dueDate ? 'all' : dueDate,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({
      ...selectedFilters,
      sortBy,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      priority: [],
      taskStatus: [],
      dueDate: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = 
    selectedFilters.priority.length > 0 || 
    selectedFilters.taskStatus.length > 0 || 
    selectedFilters.dueDate !== 'all' ||
    selectedFilters.sortBy !== 'newest';

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-sm font-medium text-gray-200">Filters</span>
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/30">
            {selectedFilters.priority.length + selectedFilters.taskStatus.length + (selectedFilters.dueDate !== 'all' ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 p-4">
          {/* Priority Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Priority</h3>
            <div className="space-y-2">
              {['high', 'medium', 'low'].map((priority) => (
                <label key={priority} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.priority.includes(priority)}
                    onChange={() => handlePriorityToggle(priority)}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm text-gray-300 capitalize">
                    {priority === 'high' && 'High'}
                    {priority === 'medium' && 'Medium'}
                    {priority === 'low' && 'Low'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Task Status</h3>
            <div className="space-y-2">
              {[
                { value: 'not-started', label: 'Not Started' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'review', label: 'Review' },
                { value: 'completed', label: 'Completed' },
              ].map((status) => (
                <label key={status.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.taskStatus.includes(status.value)}
                    onChange={() => handleStatusChange(status.value)}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm text-gray-300">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Date Filter */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Due Date</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Dates' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'today', label: 'Today' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'no-date', label: 'No Due Date' },
              ].map((date) => (
                <label key={date.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dueDate"
                    checked={selectedFilters.dueDate === date.value}
                    onChange={() => handleDueDateChange(date.value)}
                    className="w-4 h-4 text-yellow-500 focus:ring-yellow-500 bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm text-gray-300">{date.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Sort By</h3>
            <select
              value={selectedFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority-high">Priority: High to Low</option>
              <option value="priority-low">Priority: Low to High</option>
              <option value="due-date">Due Date (Earliest First)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-900 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Close panel when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

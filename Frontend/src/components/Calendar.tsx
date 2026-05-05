'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasksWithDates: string[]; // Array of date strings that have tasks
}

export default function Calendar({ selectedDate, onDateSelect, tasksWithDates }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hasTask = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasksWithDates.includes(dateStr);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header with Month and Navigation */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-white">
            {format(currentMonth, 'MMMM')}
          </h3>
          <p className="text-xs text-gray-400">
            {format(currentMonth, 'yyyy')}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-300 transition-colors"
            title="Previous month"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-300 transition-colors"
            title="Next month"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-0.5 mb-1.5 flex-shrink-0">
        {weekDaysShort.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 py-0.5">
            {day.charAt(0)}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-0.5 flex-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const dayHasTask = hasTask(day);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
                relative p-0.5 rounded text-xs font-semibold transition-all duration-200
                ${!isCurrentMonth ? 'text-gray-600 bg-gray-900/30 cursor-default' : ''}
                ${isSelected ? 'bg-yellow-500 text-gray-900 shadow-lg ring-1 ring-yellow-400' : ''}
                ${!isSelected && isCurrentMonth ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : ''}
                ${isToday && !isSelected ? 'border border-yellow-500 text-yellow-400' : ''}
                ${!isCurrentMonth ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={!isCurrentMonth}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{format(day, 'd')}</span>
                {dayHasTask && (
                  <div className={`w-0.5 h-0.5 rounded-full ${isSelected ? 'bg-gray-900' : 'bg-yellow-400'}`}></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Today Button */}
      <button
        onClick={() => {
          const today = new Date();
          setCurrentMonth(today);
          onDateSelect(today);
        }}
        className="mt-2 w-full px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
      >
        Today
      </button>
    </div>
  );
}

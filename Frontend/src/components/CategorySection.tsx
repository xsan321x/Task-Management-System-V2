'use client';

import { useState, useEffect, useRef } from 'react';
import { Category } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  onAddCategory: () => void;
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string | null;
  onDeleteCategory: (id: string) => void;
}

const AVAILABLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#FF8FAB', '#6C5CE7', '#00B894', '#FDCB6E', '#E17055',
  '#74B9FF', '#A29BFE'
];

export default function CategorySection({ categories, onAddCategory, onSelectCategory, selectedCategory, onDeleteCategory }: CategorySectionProps) {
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h3 className="text-xs font-bold text-gray-300">My categories</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <div
              key={category._id}
              className={`relative p-2 rounded-lg transition-all cursor-pointer border-2 ${
                selectedCategory === category.name 
                  ? 'bg-yellow-500/20 border-yellow-500 shadow-sm' 
                  : 'border-gray-700 hover:bg-gray-700'
              }`}
            >
              <button
                onClick={() => onSelectCategory(category.name)}
                className="flex items-center gap-2 w-full"
              >
                <div
                  className="w-3.5 h-3.5 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: category.color + '30' }}
                >
                  <div
                    className="w-2 h-2 rounded"
                    style={{ backgroundColor: category.color }}
                  ></div>
                </div>
                <span className={`text-xs font-medium truncate ${
                  selectedCategory === category.name 
                    ? 'text-yellow-300 font-bold' 
                    : 'text-gray-300'
                }`}>{category.name}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(showMenu === category._id ? null : category._id);
                }}
                className="absolute top-1 right-1 p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-gray-300"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {showMenu === category._id && (
                <div className="absolute right-0 top-7 mt-0.5 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-10 min-w-[100px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category._id);
                      setShowMenu(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onAddCategory}
        className="w-full flex items-center justify-center gap-1.5 p-2 mt-2 rounded-lg border-2 border-dashed border-gray-600 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all flex-shrink-0 text-xs"
      >
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-medium text-gray-400">Add more</span>
      </button>
    </div>
  );
}

export { AVAILABLE_COLORS };

'use client';

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  shortcut?: string;
}

export default function Tooltip({ content, children, position = 'top', shortcut }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div className="relative inline-block group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div className={`absolute ${positionClasses[position]} z-50 animate-fade-in`}>
          <div className="bg-gray-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap relative">
            <div>
              {content}
              {shortcut && (
                <div className="text-gray-300 text-xs mt-0.5">
                  {shortcut}
                </div>
              )}
            </div>
            <div className={`absolute w-2 h-2 bg-gray-700 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
}

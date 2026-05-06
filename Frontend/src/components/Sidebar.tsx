'use client';

import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

interface SidebarProps {
  onSettingsClick: () => void;
}

export default function Sidebar({ onSettingsClick }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="w-20 bg-gray-900 border-r border-gray-800 h-screen flex flex-col items-center py-6 fixed left-0 top-0 shadow-xl">
      {/* Logo - Compact */}
      <div 
        onClick={() => router.push('/dashboard')}
        className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-8 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
        title="Go to Dashboard"
      >
        <span className="text-xl font-bold text-gray-900">✓</span>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Items - Icon Only */}
      <div className="space-y-4 flex flex-col items-center">
        <button
          onClick={onSettingsClick}
          className="w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 text-xl border border-gray-700"
          title="Settings"
        >
          ⚙️
        </button>
        <button
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl bg-red-900/30 hover:bg-red-900/50 flex items-center justify-center transition-all hover:scale-110 text-xl border border-red-800"
          title="Log out"
        >
          🚪
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Home,
  Award,
  CheckSquare,
  Code2,
  User,
  Plus,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface BottomNavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeTasksCount: number;
  onQuickAdd: () => void;
  isDarkMode: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  activeTasksCount,
  onQuickAdd,
  isDarkMode,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'certificates' as NavigationTab,
      label: 'Sertifikat',
      icon: Award,
    },
    {
      id: 'notes-tasks' as NavigationTab,
      label: 'Catatan & Tugas',
      icon: CheckSquare,
      badge: activeTasksCount > 0 ? activeTasksCount : undefined,
    },
    {
      id: 'coding' as NavigationTab,
      label: 'Coding',
      icon: Code2,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <div
      className={`w-full border-t px-2 py-1.5 shrink-0 z-30 transition-colors backdrop-blur-lg ${
        isDarkMode
          ? 'bg-[#0E1322]/95 border-slate-800/80 text-slate-400'
          : 'bg-white/95 border-slate-200 text-slate-500'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all duration-200 rounded-xl ${
                isActive
                  ? isDarkMode
                    ? 'text-cyan-400 font-semibold'
                    : 'text-purple-600 font-semibold'
                  : 'hover:text-slate-200'
              }`}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <div
                  className={`absolute -top-1 w-8 h-1 rounded-full ${
                    isDarkMode ? 'bg-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-purple-600'
                  }`}
                />
              )}

              <div className="relative p-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />

                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0B0F19]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 line-clamp-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

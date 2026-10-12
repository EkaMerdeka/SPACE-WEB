import React from 'react';
import {
  ArrowLeft,
  Search,
  FolderArchive,
  Calendar,
  Settings,
  Bell,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
  onBack?: () => void;
  onOpenSearch: () => void;
  onOpenDocuments: () => void;
  onOpenSchedule: () => void;
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  onOpenAndroidExport: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  isDarkMode: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  canGoBack,
  onBack,
  onOpenSearch,
  onOpenDocuments,
  onOpenSchedule,
  onOpenSettings,
  onOpenBackup,
  onOpenAndroidExport,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  isDarkMode,
}) => {
  return (
    <div
      className={`w-full px-4 py-2.5 flex items-center justify-between border-b shrink-0 z-20 backdrop-blur-md transition-colors ${
        isDarkMode
          ? 'bg-[#0B0F19]/80 border-slate-800/80 text-white'
          : 'bg-white/80 border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {canGoBack ? (
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-sm shadow-purple-500/20">
            <div
              className={`w-full h-full rounded-[11px] flex items-center justify-center font-black text-sm text-cyan-300 ${
                isDarkMode ? 'bg-[#0E1322]' : 'bg-slate-900'
              }`}
            >
              E
            </div>
          </div>
        )}

        <div>
          <h1 className="font-bold text-sm tracking-tight leading-tight line-clamp-1">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-slate-400 font-medium tracking-wide line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-1">
        {/* Bell Notification Icon */}
        <button
          onClick={onOpenNotifications}
          className={`p-2 rounded-xl transition-all relative ${
            isDarkMode ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Notifikasi Kampus"
        >
          <Bell className="w-4 h-4 text-purple-400" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0B0F19]" />
          )}
        </button>

        <button
          onClick={onOpenSearch}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Pencarian Global"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenDocuments}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Dokumen Kampus Vault"
        >
          <FolderArchive className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={onOpenSchedule}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Jadwal Kuliah Mingguan"
        >
          <Calendar className="w-4 h-4 text-purple-400" />
        </button>

        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Pengaturan"
        >
          <Settings className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  CheckCircle2,
  Calendar,
  CheckSquare,
  Award,
  Info,
  Trash2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AppNotification, NavigationTab } from '../../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  isDarkMode: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-4 h-4 text-cyan-400" />;
      case 'schedule':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'cert':
        return <Award className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-amber-400" />;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${Math.max(1, mins)}m lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}j lalu`;
    return `${Math.floor(hours / 24)}h lalu`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 select-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`w-full max-w-sm rounded-3xl p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border ${
          isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-bold text-sm flex items-center gap-1.5 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>Notifikasi Kampus</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full font-mono">
                    {unreadCount} Baru
                  </span>
                )}
              </h3>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pengingat deadline, jadwal, dan sistem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action controls */}
        {notifications.length > 0 && (
          <div
            className={`flex items-center justify-between py-2 text-[11px] border-b ${
              isDarkMode ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-100'
            }`}
          >
            <button
              onClick={onMarkAllAsRead}
              className="hover:text-purple-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>
            <button
              onClick={onClearAll}
              className="hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="py-2 overflow-y-auto space-y-2 flex-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  notif.isRead
                    ? isDarkMode
                      ? 'bg-[#111728]/70 border-slate-800/60 opacity-80'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                    : isDarkMode
                    ? 'bg-[#141C32] border-purple-500/30 shadow-sm'
                    : 'bg-white border-purple-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDarkMode ? 'bg-slate-800/80' : 'bg-slate-100'
                    }`}
                  >
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold leading-tight line-clamp-1 ${
                          notif.isRead
                            ? isDarkMode
                              ? 'text-slate-300'
                              : 'text-slate-700'
                            : isDarkMode
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {notif.message}
                    </p>

                    <div
                      className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                        isDarkMode ? 'border-slate-800/60' : 'border-slate-100'
                      }`}
                    >
                      <span className="text-purple-600 dark:text-cyan-400 font-medium group-hover:underline flex items-center gap-0.5">
                        <span>Buka Halaman</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-cyan-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Tidak ada notifikasi
              </div>
              <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Semua tugas dan jadwal Anda terpantau aman.
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

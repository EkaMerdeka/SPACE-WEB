import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  FileText,
  CheckSquare,
  BookOpen,
  Code2,
  Calendar,
  Search,
  Plus,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  ProfileData,
  CertificateItem,
  DocumentItem,
  NoteItem,
  TaskItem,
  ScheduleItem,
  SnippetItem,
  NavigationTab,
} from '../../types';

interface DashboardScreenProps {
  profile: ProfileData;
  certificates: CertificateItem[];
  documents: DocumentItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  schedules: ScheduleItem[];
  snippets: SnippetItem[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickAdd: () => void;
  onOpenSearch: () => void;
  onSelectCertificate: (cert: CertificateItem) => void;
  onSelectTask: (task: TaskItem) => void;
  onSelectSnippet: (snip: SnippetItem) => void;
  isDarkMode: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  profile,
  certificates,
  documents,
  notes,
  tasks,
  schedules,
  snippets,
  onNavigate,
  onOpenQuickAdd,
  onOpenSearch,
  onSelectCertificate,
  onSelectTask,
  onSelectSnippet,
  isDarkMode,
}) => {
  // Indonesian date formatter
  const todayDateString = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const activeTasks = tasks.filter((t) => t.status !== 'Selesai');
  const favoriteCerts = certificates.filter((c) => c.isFavorite);

  // Find next class today or first in schedule
  const nextClass = schedules.length > 0 ? schedules[0] : null;

  // Compile recent activities across vaults
  const recentActivities = [
    ...certificates.slice(0, 2).map((c) => ({
      id: c.id,
      title: c.title,
      type: 'certificate',
      label: 'Sertifikat Ditambahkan',
      time: c.createdAt,
      icon: Award,
      color: 'text-purple-400',
      action: () => onSelectCertificate(c),
    })),
    ...tasks.slice(0, 2).map((t) => ({
      id: t.id,
      title: t.title,
      type: 'task',
      label: `Tugas: ${t.priority} Deadline`,
      time: t.createdAt,
      icon: CheckSquare,
      color: 'text-cyan-400',
      action: () => onSelectTask(t),
    })),
    ...snippets.slice(0, 2).map((s) => ({
      id: s.id,
      title: s.title,
      type: 'snippet',
      label: `Snippet ${s.language}`,
      time: s.createdAt,
      icon: Code2,
      color: 'text-emerald-400',
      action: () => onSelectSnippet(s),
    })),
  ].sort((a, b) => b.time - a.time).slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 space-y-4 pb-12"
    >
      {/* 1. Header Profile & Date */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {todayDateString}
          </span>
          <h2
            className={`text-xl font-black tracking-tight flex items-center gap-1.5 mt-0.5 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>Welcome To Apps Eka</span>
            <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {profile.fullName ? (
              <span className="font-semibold text-purple-500">{profile.fullName} · </span>
            ) : (
              <span className="text-slate-400 italic">Biodata Mahasiswa · </span>
            )}
            {profile.major || 'Teknik Informatika'} · {profile.university || 'Universitas'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="relative group p-0.5 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 shadow-md shadow-purple-500/20"
        >
          <div
            className={`w-12 h-12 rounded-[14px] overflow-hidden flex items-center justify-center ring-2 ${
              isDarkMode ? 'bg-[#0E1424] ring-[#0B0F19]' : 'bg-slate-100 ring-white'
            }`}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-purple-400" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0B0F19] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </button>
      </motion.div>

      {/* 2. Global Search Bar Trigger */}
      <motion.div variants={itemVariants}>
        <button
          onClick={onOpenSearch}
          className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition-all group ${
            isDarkMode
              ? 'bg-[#121828] border-slate-800/80 hover:border-purple-500/50 text-slate-400 hover:text-slate-200'
              : 'bg-white border-slate-200 hover:border-purple-400 text-slate-600 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Cari sertifikat, dokumen, catatan, kode...</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
              isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
            }`}
          >
            ⌘K
          </span>
        </button>
      </motion.div>

      {/* 3. Next Class Schedule Card */}
      {nextClass && (
        <motion.div variants={itemVariants}>
          <div
            className={`p-4 rounded-3xl border shadow-lg relative overflow-hidden ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#1B1A38] via-[#131B32] to-[#0E1626] border-purple-500/30 shadow-purple-950/40 text-white'
                : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 border-purple-200 shadow-purple-100/50 text-slate-800'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                <span
                  className={`font-bold uppercase tracking-wider text-[10px] ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}
                >
                  Jadwal Kuliah Berikutnya
                </span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDarkMode
                    ? 'bg-purple-500/20 text-purple-200'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {nextClass.day}
              </span>
            </div>

            <h3
              className={`font-extrabold text-base tracking-tight leading-snug ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {nextClass.courseName}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs mt-2.5">
              <div
                className={`flex items-center gap-1 font-mono text-[11px] font-semibold ${
                  isDarkMode ? 'text-cyan-300' : 'text-cyan-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {nextClass.startTime} - {nextClass.endTime}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                <span>
                  {nextClass.room} ({nextClass.building})
                </span>
              </div>
            </div>

            {nextClass.lecturer && (
              <p
                className={`text-[11px] mt-2 italic ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Dosen: {nextClass.lecturer}
              </p>
            )}

            <div
              className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${
                isDarkMode ? 'border-white/10' : 'border-purple-200/60'
              }`}
            >
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                {nextClass.notes || 'Persiapkan catatan'}
              </span>
              <button
                onClick={() => onNavigate('schedule')}
                className="text-purple-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Lihat Jadwal Penuh</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. Vault Statistics Matrix */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vault Mahasiswa
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Tersimpan Offline</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Certificate Vault Card */}
          <button
            onClick={() => onNavigate('certificates')}
            className={`p-3.5 rounded-2xl border text-left transition-all group ${
              isDarkMode
                ? 'bg-[#111728] border-slate-800/80 hover:border-purple-500/50'
                : 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
            </div>
            <div
              className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {certificates.length}
            </div>
            <div
              className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Sertifikat Vault
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {favoriteCerts.length} Favorit terpilih
            </div>
          </button>

          {/* Campus Documents Card */}
          <button
            onClick={() => onNavigate('documents')}
            className={`p-3.5 rounded-2xl border text-left transition-all group ${
              isDarkMode
                ? 'bg-[#111728] border-slate-800/80 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div
              className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {documents.length}
            </div>
            <div
              className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Dokumen Kampus
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Materi, KRS, Modul</div>
          </button>

          {/* Active Tasks Card */}
          <button
            onClick={() => onNavigate('notes-tasks')}
            className={`p-3.5 rounded-2xl border text-left transition-all group ${
              isDarkMode
                ? 'bg-[#111728] border-slate-800/80 hover:border-amber-500/50'
                : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </div>
            <div
              className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {activeTasks.length}
            </div>
            <div
              className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Tugas & Deadline
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {activeTasks.filter((t) => t.priority === 'Tinggi').length} Prioritas tinggi
            </div>
          </button>

          {/* Coding Vault Card */}
          <button
            onClick={() => onNavigate('coding')}
            className={`p-3.5 rounded-2xl border text-left transition-all group ${
              isDarkMode
                ? 'bg-[#111728] border-slate-800/80 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div
              className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {snippets.length}
            </div>
            <div
              className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Coding Vault
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Kotlin, Py, SQL, JS</div>
          </button>
        </div>
      </motion.div>

      {/* 5. Quick Actions Row */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Akses Cepat
          </span>
          <button
            onClick={onOpenQuickAdd}
            className="text-xs font-bold text-purple-500 hover:text-purple-600 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Data</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => onNavigate('certificates')}
            className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isDarkMode
                ? 'bg-[#141C30] hover:bg-purple-950/40 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-purple-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span>+ Sertifikat</span>
          </button>

          <button
            onClick={() => onNavigate('notes-tasks')}
            className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isDarkMode
                ? 'bg-[#141C30] hover:bg-cyan-950/40 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-cyan-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <span>+ Tugas Kuliah</span>
          </button>

          <button
            onClick={() => onNavigate('notes-tasks')}
            className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isDarkMode
                ? 'bg-[#141C30] hover:bg-amber-950/40 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>+ Catatan</span>
          </button>

          <button
            onClick={() => onNavigate('coding')}
            className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isDarkMode
                ? 'bg-[#141C30] hover:bg-emerald-950/40 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>+ Snippet Kode</span>
          </button>
        </div>
      </motion.div>

      {/* 6. Recent Activity Feed */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Aktivitas Terkini
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Realtime Event</span>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-2">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={`${act.type}-${act.id}`}
                  onClick={act.action}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all group ${
                    isDarkMode
                      ? 'bg-[#111728] border-slate-800/70 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDarkMode ? 'bg-slate-800/80' : 'bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${act.color}`} />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold line-clamp-1 transition-colors ${
                          isDarkMode
                            ? 'text-white group-hover:text-cyan-300'
                            : 'text-slate-900 group-hover:text-purple-600'
                        }`}
                      >
                        {act.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{act.label}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className={`p-6 rounded-2xl border border-dashed text-center ${
              isDarkMode ? 'bg-[#111728] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <div
              className={`text-xs font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Belum ada aktivitas baru
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Tambahkan sertifikat, catatan, atau tugas untuk memulai.
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

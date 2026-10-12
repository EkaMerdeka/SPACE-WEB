import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { ScheduleItem, DayOfWeek } from '../../types';

interface ScheduleScreenProps {
  schedules: ScheduleItem[];
  onAddSchedule: (schedule: ScheduleItem) => void;
  onUpdateSchedule: (schedule: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  isDarkMode: boolean;
}

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#6366F1', // Indigo
];

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  isDarkMode,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formCourse, setFormCourse] = useState('');
  const [formLecturer, setFormLecturer] = useState('');
  const [formDay, setFormDay] = useState<DayOfWeek>('Senin');
  const [formStart, setFormStart] = useState('08:00');
  const [formEnd, setFormEnd] = useState('10:30');
  const [formRoom, setFormRoom] = useState('Lab 304');
  const [formBuilding, setFormBuilding] = useState('Gedung C');
  const [formColor, setFormColor] = useState(COLORS[0]);
  const [formNotes, setFormNotes] = useState('');

  // Collision detection logic
  const checkCollision = (day: DayOfWeek, start: string, end: string, excludeId?: string) => {
    return schedules.find((s) => {
      if (s.id === excludeId || s.day !== day) return false;
      const sStart = s.startTime;
      const sEnd = s.endTime;
      // Overlap condition: start < sEnd && end > sStart
      return start < sEnd && end > sStart;
    });
  };

  const currentCollision = checkCollision(
    formDay,
    formStart,
    formEnd,
    editingSchedule ? editingSchedule.id : undefined
  );

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormCourse('');
    setFormLecturer('');
    setFormDay(selectedDay);
    setFormStart('08:00');
    setFormEnd('10:30');
    setFormRoom('Lab Komputer 304');
    setFormBuilding('Gedung C');
    setFormColor(COLORS[schedules.length % COLORS.length]);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch: ScheduleItem) => {
    setEditingSchedule(sch);
    setFormCourse(sch.courseName);
    setFormLecturer(sch.lecturer || '');
    setFormDay(sch.day);
    setFormStart(sch.startTime);
    setFormEnd(sch.endTime);
    setFormRoom(sch.room);
    setFormBuilding(sch.building || '');
    setFormColor(sch.color);
    setFormNotes(sch.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCourse.trim()) return;

    if (editingSchedule) {
      onUpdateSchedule({
        ...editingSchedule,
        courseName: formCourse,
        lecturer: formLecturer,
        day: formDay,
        startTime: formStart,
        endTime: formEnd,
        room: formRoom,
        building: formBuilding,
        color: formColor,
        notes: formNotes,
      });
    } else {
      const newSch: ScheduleItem = {
        id: `sch-${Date.now()}`,
        courseName: formCourse,
        lecturer: formLecturer,
        day: formDay,
        startTime: formStart,
        endTime: formEnd,
        room: formRoom,
        building: formBuilding,
        color: formColor,
        notes: formNotes,
      };
      onAddSchedule(newSch);
    }
    setIsModalOpen(false);
  };

  const daySchedules = schedules
    .filter((s) => s.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="p-4 space-y-4 pb-16">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-lg font-black tracking-tight flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>Jadwal Kuliah Mingguan</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono font-bold">
              {schedules.length} Kelas
            </span>
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Deteksi bentrok otomatis & info ruangan kuliah
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* 2. Day Selector Tabs */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
        {DAYS.map((day) => {
          const count = schedules.filter((s) => s.day === day).length;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[54px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-600/30 scale-105'
                  : isDarkMode
                  ? 'bg-[#121828] text-slate-400 hover:text-slate-200 border border-slate-800'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-xs font-bold leading-tight">{day.slice(0, 3)}</span>
              <span
                className={`text-[9px] mt-0.5 rounded-full px-1.5 font-mono ${
                  isSelected ? 'bg-black/30 text-cyan-200' : 'text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Schedule Cards for Selected Day */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span
            className={`font-bold uppercase tracking-wider text-[11px] ${
              isDarkMode ? 'text-purple-300' : 'text-purple-700'
            }`}
          >
            Jadwal {selectedDay}
          </span>
          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
            {daySchedules.length} mata kuliah
          </span>
        </div>

        {daySchedules.length > 0 ? (
          daySchedules.map((sch) => {
            // Check if this item has collision with another on the same day
            const conflict = schedules.find(
              (s) =>
                s.id !== sch.id &&
                s.day === sch.day &&
                sch.startTime < s.endTime &&
                sch.endTime > s.startTime
            );

            return (
              <div
                key={sch.id}
                onClick={() => handleOpenEdit(sch)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isDarkMode
                    ? 'bg-[#111728] border-slate-800 hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
                }`}
              >
                {/* Left accent color strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: sch.color }}
                />

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className={`font-bold text-sm transition-colors ${
                        isDarkMode
                          ? 'text-white group-hover:text-cyan-300'
                          : 'text-slate-900 group-hover:text-purple-600'
                      }`}
                    >
                      {sch.courseName}
                    </h3>
                    {sch.lecturer && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sch.lecturer}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSchedule(sch.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Time & Room badges */}
                <div
                  className={`flex flex-wrap items-center gap-3 text-xs mt-3 pt-2 border-t ${
                    isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-cyan-600 dark:text-cyan-300 font-semibold text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {sch.startTime} - {sch.endTime}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-[11px] ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    <span>
                      {sch.room} {sch.building ? `(${sch.building})` : ''}
                    </span>
                  </div>
                </div>

                {sch.notes && (
                  <p
                    className={`text-[11px] mt-2 p-2 rounded-lg italic ${
                      isDarkMode ? 'bg-[#0E1424] text-slate-400' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {sch.notes}
                  </p>
                )}

                {/* Conflict warning badge */}
                {conflict && (
                  <div className="mt-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Bentrok jam dengan: {conflict.courseName}!</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div
            className={`p-8 rounded-3xl border border-dashed text-center ${
              isDarkMode
                ? 'bg-[#111728] border-slate-800'
                : 'bg-white border-slate-300 shadow-sm'
            }`}
          >
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Tidak ada jadwal di hari {selectedDay}
            </div>
            <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Hari bebas kuliah atau tambahkan jadwal baru.
            </div>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Schedule Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`w-full max-w-lg rounded-3xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto border ${
                isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200 dark:border-slate-800">
                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {editingSchedule ? 'Edit Jadwal Kuliah' : 'Tambah Jadwal Kuliah'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-purple-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {currentCollision && (
                <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-500 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Perhatian: Jam bertabrakan dengan kelas "{currentCollision.courseName}" (
                    {currentCollision.startTime}-{currentCollision.endTime})
                  </span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Mata Kuliah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    placeholder="Contoh: Pemrograman Piranti Bergerak"
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Nama Dosen Pengampu
                  </label>
                  <input
                    type="text"
                    value={formLecturer}
                    onChange={(e) => setFormLecturer(e.target.value)}
                    placeholder="Contoh: Dr. Hendra Saputra, M.T."
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Hari
                    </label>
                    <select
                      value={formDay}
                      onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Mulai
                    </label>
                    <input
                      type="time"
                      value={formStart}
                      onChange={(e) => setFormStart(e.target.value)}
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Selesai
                    </label>
                    <input
                      type="time"
                      value={formEnd}
                      onChange={(e) => setFormEnd(e.target.value)}
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Ruangan
                    </label>
                    <input
                      type="text"
                      value={formRoom}
                      onChange={(e) => setFormRoom(e.target.value)}
                      placeholder="Contoh: Lab 304"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Gedung / Kampus
                    </label>
                    <input
                      type="text"
                      value={formBuilding}
                      onChange={(e) => setFormBuilding(e.target.value)}
                      placeholder="Contoh: Gedung C Lt 3"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Color selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
                    Warna Label
                  </label>
                  <div className="flex items-center gap-2">
                    {COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setFormColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          formColor === c ? 'scale-125 border-purple-500' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Catatan Kelas
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Bawa laptop, kabel USB, kuis bab 3..."
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

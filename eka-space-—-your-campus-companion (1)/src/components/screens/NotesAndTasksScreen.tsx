import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckSquare,
  Plus,
  Search,
  Pin,
  Star,
  Copy,
  Download,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';
import { NoteItem, TaskItem, TaskPriority, TaskStatus } from '../../types';

interface NotesAndTasksScreenProps {
  notes: NoteItem[];
  tasks: TaskItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onAddTask: (task: TaskItem) => void;
  onUpdateTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  isDarkMode: boolean;
  initialTab?: 'notes' | 'tasks';
}

export const NotesAndTasksScreen: React.FC<NotesAndTasksScreenProps> = ({
  notes,
  tasks,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  isDarkMode,
  initialTab = 'tasks',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'notes'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Task filter states
  const [taskStatusFilter, setTaskStatusFilter] = useState<'Semua' | TaskStatus>('Semua');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<'Semua' | TaskPriority>('Semua');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form states - Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCourse, setTaskCourse] = useState('');
  const [taskDeadlineDate, setTaskDeadlineDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [taskDeadlineTime, setTaskDeadlineTime] = useState('23:59');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Sedang');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('Belum dimulai');

  // Form states - Note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCourse, setNoteCourse] = useState('');
  const [noteCategory, setNoteCategory] = useState('Algoritma');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Kuliah');

  // Completed task celebration flash
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Tasks filtering
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.courseName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        taskStatusFilter === 'Semua' || task.status === taskStatusFilter;
      const matchesPriority =
        taskPriorityFilter === 'Semua' || task.priority === taskPriorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  // Notes filtering
  const filteredNotes = notes
    .filter((note) => {
      return (
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updatedAt - a.updatedAt);

  // Task Handlers
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskCourse('');
    setTaskDeadlineDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setTaskDeadlineTime('23:59');
    setTaskPriority('Sedang');
    setTaskStatus('Belum dimulai');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskCourse(task.courseName);
    const d = new Date(task.deadline);
    setTaskDeadlineDate(d.toISOString().split('T')[0]);
    setTaskDeadlineTime(
      `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    );
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const deadlineISO = new Date(`${taskDeadlineDate}T${taskDeadlineTime}:00`).toISOString();

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: taskTitle,
        description: taskDesc,
        courseName: taskCourse,
        deadline: deadlineISO,
        priority: taskPriority,
        status: taskStatus,
        completedAt: taskStatus === 'Selesai' ? Date.now() : undefined,
      });
    } else {
      const newTask: TaskItem = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        description: taskDesc,
        courseName: taskCourse || 'Umum',
        deadline: deadlineISO,
        priority: taskPriority,
        status: taskStatus,
        createdAt: Date.now(),
        completedAt: taskStatus === 'Selesai' ? Date.now() : undefined,
      };
      onAddTask(newTask);
    }
    setIsTaskModalOpen(false);
  };

  const toggleTaskStatus = (task: TaskItem) => {
    const isNowDone = task.status !== 'Selesai';
    if (isNowDone) {
      setJustCompletedId(task.id);
      setTimeout(() => setJustCompletedId(null), 1500);
    }
    onUpdateTask({
      ...task,
      status: isNowDone ? 'Selesai' : 'Sedang dikerjakan',
      completedAt: isNowDone ? Date.now() : undefined,
    });
  };

  // Note Handlers
  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteCourse('');
    setNoteCategory('Algoritma');
    setNoteContent('');
    setNoteTags('Kuliah');
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNote = (note: NoteItem) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteCourse(note.courseName);
    setNoteCategory(note.category);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const tagsArray = noteTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: noteTitle,
        courseName: noteCourse,
        category: noteCategory,
        content: noteContent,
        tags: tagsArray,
        updatedAt: Date.now(),
      });
    } else {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitle,
        courseName: noteCourse || 'Umum',
        category: noteCategory,
        content: noteContent,
        tags: tagsArray,
        isPinned: false,
        isFavorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      onAddNote(newNote);
    }
    setIsNoteModalOpen(false);
  };

  const copyNoteContent = (note: NoteItem) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
  };

  const exportNoteToTxt = (note: NoteItem) => {
    const text = `CATATAN KULIAH: ${note.title}\nMata Kuliah: ${note.courseName}\nKategori: ${note.category}\n\n${note.content}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = tasks.filter((t) => t.status === 'Selesai').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="p-4 space-y-4 pb-16">
      {/* 1. Header with Tab Switcher */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center border p-1 rounded-2xl ${
            isDarkMode ? 'bg-[#121828] border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}
        >
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tasks'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tugas & Deadline</span>
            <span className="text-[10px] bg-black/30 text-white px-1.5 py-0.2 rounded-full font-mono">
              {tasks.filter((t) => t.status !== 'Selesai').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'notes'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catatan Kuliah</span>
            <span className="text-[10px] bg-black/30 text-white px-1.5 py-0.2 rounded-full font-mono">
              {notes.length}
            </span>
          </button>
        </div>

        <button
          onClick={activeSubTab === 'tasks' ? handleOpenAddTask : handleOpenAddNote}
          className={`px-3 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer ${
            activeSubTab === 'tasks'
              ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30'
              : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeSubTab === 'tasks'
              ? 'Cari tugas, matkul, atau deadline...'
              : 'Cari materi kuliah, algoritma, ringkasan...'
          }
          className={`w-full border text-xs rounded-xl py-2.5 pl-9 pr-3 outline-none transition-colors ${
            isDarkMode
              ? 'bg-[#121828] border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-600'
              : 'bg-white border-slate-300 focus:border-cyan-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
          }`}
        />
      </div>

      {/* 3. SUBTAB CONTENT: TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-3">
          {/* Progress Card */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDarkMode
                ? 'bg-gradient-to-r from-[#141E34] to-[#0E1528] border-cyan-500/20 text-white'
                : 'bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Kemajuan Tugas Semester
              </span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">
                {progressPercent}% Selesai
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
              <span>{completedCount} tugas terselesaikan</span>
              <span>{tasks.length - completedCount} menunggu dikerjakan</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {(['Semua', 'Belum dimulai', 'Sedang dikerjakan', 'Selesai'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setTaskStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs transition-colors ${
                  taskStatusFilter === st
                    ? 'bg-cyan-600 text-white'
                    : isDarkMode
                    ? 'bg-[#121828] text-slate-400 border border-slate-800'
                    : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const isOverdue =
                  task.status !== 'Selesai' && new Date(task.deadline).getTime() < Date.now();
                const deadlineDate = new Date(task.deadline);
                const isDone = task.status === 'Selesai';

                return (
                  <motion.div
                    key={task.id}
                    layout
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isDone
                        ? isDarkMode
                          ? 'bg-[#0E1424]/60 border-slate-800/60 opacity-75'
                          : 'bg-slate-100 border-slate-200 opacity-75'
                        : isOverdue
                        ? 'bg-rose-500/10 border-rose-500/40 shadow-sm'
                        : isDarkMode
                        ? 'bg-[#111728] border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : isDarkMode
                            ? 'border-slate-600 hover:border-cyan-400 bg-slate-900/50'
                            : 'border-slate-300 hover:border-cyan-500 bg-white'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0" onClick={() => handleOpenEditTask(task)}>
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`font-bold text-xs leading-snug line-clamp-1 ${
                              isDone
                                ? 'line-through text-slate-400'
                                : isDarkMode
                                ? 'text-white'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              task.priority === 'Tinggi'
                                ? 'bg-rose-500/20 text-rose-500'
                                : task.priority === 'Sedang'
                                ? 'bg-amber-500/20 text-amber-500'
                                : 'bg-slate-500/20 text-slate-500'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-2">
                          <span className="text-cyan-300 font-medium">{task.courseName}</span>
                          <span>·</span>
                          <span
                            className={`flex items-center gap-1 font-mono ${
                              isOverdue ? 'text-rose-400 font-bold' : ''
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>
                              {deadlineDate.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                              })}{' '}
                              {deadlineDate.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>

                          {isOverdue && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold">
                              TERLAMBAT
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {justCompletedId === task.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Hebat! Tugas Berhasil Diselesaikan!</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 rounded-3xl bg-[#111728] border border-dashed border-slate-800 text-center">
                <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Tidak ada tugas ditemukan</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Tambahkan tugas dan deadline baru agar tidak terlewat.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SUBTAB CONTENT: NOTES */}
      {activeSubTab === 'notes' && (
        <div className="space-y-2">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                  isDarkMode
                    ? 'bg-[#111728] border-slate-800 hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
                }`}
                onClick={() => handleOpenEditNote(note)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {note.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 rotate-45 shrink-0" />
                    )}
                    <h4
                      className={`font-bold text-xs line-clamp-1 transition-colors ${
                        isDarkMode
                          ? 'text-white group-hover:text-cyan-300'
                          : 'text-slate-900 group-hover:text-purple-600'
                      }`}
                    >
                      {note.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => copyNoteContent(note)}
                      className="p-1 text-slate-400 hover:text-purple-600"
                      title="Salin isi catatan"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => exportNoteToTxt(note)}
                      className="p-1 text-slate-400 hover:text-cyan-600"
                      title="Ekspor ke TXT"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Hapus catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-purple-600 font-semibold mt-1">
                  {note.courseName} · {note.category}
                </div>

                <p
                  className={`text-xs mt-2 line-clamp-3 leading-relaxed font-sans p-2.5 rounded-xl border ${
                    isDarkMode
                      ? 'bg-[#0E1424] border-slate-800/60 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {note.content}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1.5 py-0.2 rounded border ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span>
                    Diperbarui{' '}
                    {new Date(note.updatedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`p-8 rounded-3xl border border-dashed text-center ${
                isDarkMode ? 'bg-[#111728] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Belum ada catatan kuliah
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Buat ringkasan materi, rumus, atau konsep penting.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Add / Edit Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`w-full max-w-lg rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto border ${
                isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h3 className={`font-bold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {editingTask ? 'Edit Tugas Kuliah' : 'Tambah Tugas Baru'}
              </h3>
              <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Judul Tugas *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Contoh: Implementasi Repository Pattern Room"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Mata Kuliah
                  </label>
                  <input
                    type="text"
                    value={taskCourse}
                    onChange={(e) => setTaskCourse(e.target.value)}
                    placeholder="Contoh: Pemrograman Piranti Bergerak"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Tanggal Deadline
                    </label>
                    <input
                      type="date"
                      value={taskDeadlineDate}
                      onChange={(e) => setTaskDeadlineDate(e.target.value)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Jam
                    </label>
                    <input
                      type="time"
                      value={taskDeadlineTime}
                      onChange={(e) => setTaskDeadlineTime(e.target.value)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Prioritas
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                    >
                      <option value="Rendah">Rendah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Tinggi">Tinggi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Status Pengerjaan
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as any)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                    >
                      <option value="Belum dimulai">Belum dimulai</option>
                      <option value="Sedang dikerjakan">Sedang dikerjakan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Deskripsi Tugas & Kriteria
                  </label>
                  <textarea
                    rows={3}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Detail instruksi tugas, tautan pengumpulan, dsb."
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    Simpan Tugas
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Add / Edit Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-lg bg-[#0E1424] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-bold text-sm text-white mb-3">
                {editingNote ? 'Edit Catatan Kuliah' : 'Buat Catatan Baru'}
              </h3>
              <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Judul Catatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Contoh: Rangkuman Teorema Graf & Dijkstra"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Mata Kuliah
                    </label>
                    <input
                      type="text"
                      value={noteCourse}
                      onChange={(e) => setNoteCourse(e.target.value)}
                      placeholder="Contoh: Desain Analisis Algoritma"
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value)}
                      placeholder="Contoh: Algoritma / Basis Data"
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Isi Catatan Kuliah
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Tuliskan materi kuliah, poin-poin penjelasan dosen, atau rumus di sini..."
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 font-mono text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Tags (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={noteTags}
                    onChange={(e) => setNoteTags(e.target.value)}
                    placeholder="Algoritma, Teori, Ujian"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Simpan Catatan
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

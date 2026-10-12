import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Award,
  FileText,
  BookOpen,
  CheckSquare,
  Calendar,
  Code2,
  Clock,
  Trash2,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import {
  CertificateItem,
  DocumentItem,
  NoteItem,
  TaskItem,
  ScheduleItem,
  SnippetItem,
  NavigationTab,
} from '../../types';
import { AppStorageRepository } from '../../data/storage';

interface SearchScreenProps {
  certificates: CertificateItem[];
  documents: DocumentItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  schedules: ScheduleItem[];
  snippets: SnippetItem[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectCertificate: (cert: CertificateItem) => void;
  isDarkMode: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  certificates,
  documents,
  notes,
  tasks,
  schedules,
  snippets,
  onNavigate,
  onSelectCertificate,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  useEffect(() => {
    setHistory(AppStorageRepository.getSearchHistory());
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
      if (query.trim()) {
        const updated = AppStorageRepository.addSearchHistory(query.trim());
        setHistory(updated);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const clearHistory = () => {
    AppStorageRepository.clearSearchHistory();
    setHistory([]);
  };

  const q = debouncedQuery.toLowerCase();

  // Search Results
  const matchedCertificates = q
    ? certificates.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.issuer.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const matchedDocuments = q
    ? documents.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.courseName && d.courseName.toLowerCase().includes(q)) ||
          d.category.toLowerCase().includes(q)
      )
    : [];

  const matchedNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.courseName.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    : [];

  const matchedTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.courseName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    : [];

  const matchedSchedules = q
    ? schedules.filter(
        (s) =>
          s.courseName.toLowerCase().includes(q) ||
          (s.lecturer && s.lecturer.toLowerCase().includes(q)) ||
          s.room.toLowerCase().includes(q)
      )
    : [];

  const matchedSnippets = q
    ? snippets.filter(
        (sn) =>
          sn.title.toLowerCase().includes(q) ||
          sn.language.toLowerCase().includes(q) ||
          sn.description.toLowerCase().includes(q) ||
          sn.code.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedCertificates.length +
    matchedDocuments.length +
    matchedNotes.length +
    matchedTasks.length +
    matchedSchedules.length +
    matchedSnippets.length;

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Header & Input */}
      <div>
        <h2
          className={`text-lg font-black tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          Pencarian Global
        </h2>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Temukan berkas sertifikat, modul, catatan kuliah, tugas, dan kode dalam satu waktu.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik apa saja: Kotlin, Algoritma, Hackathon, KRS..."
          className={`w-full text-xs rounded-xl py-3 pl-9 pr-9 outline-none shadow-sm border transition-colors ${
            isDarkMode
              ? 'bg-[#121828] border-slate-800 focus:border-purple-500 text-white placeholder:text-slate-600'
              : 'bg-white border-slate-300 focus:border-purple-600 text-slate-900 placeholder:text-slate-400'
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. History Chips (when query is empty) */}
      {!debouncedQuery && history.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Riwayat Pencarian</span>
            </span>
            <button
              onClick={clearHistory}
              className="text-[11px] text-slate-500 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h) => (
              <button
                key={h}
                onClick={() => setQuery(h)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#121828] border-slate-800 text-slate-300 hover:border-purple-500/50 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:text-purple-600 shadow-sm'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search Results Sections */}
      {debouncedQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? 'font-bold text-slate-400' : 'font-bold text-slate-500'}>
              HASIL PENCARIAN UNTUK: "{debouncedQuery}"
            </span>
            <span className="font-mono text-purple-600 dark:text-cyan-300 font-bold">{totalResults} Ditemukan</span>
          </div>

          {totalResults === 0 ? (
            <div
              className={`p-8 rounded-3xl border border-dashed text-center ${
                isDarkMode
                  ? 'bg-[#111728] border-slate-800'
                  : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Tidak ada hasil yang sesuai
              </div>
              <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Coba gunakan kata kunci umum seperti mata kuliah atau bahasa pemrograman.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Certificates Results */}
              {matchedCertificates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
                    <Award className="w-4 h-4" />
                    <span>Sertifikat ({matchedCertificates.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => {
                          onNavigate('certificates');
                          onSelectCertificate(cert);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                          isDarkMode
                            ? 'bg-[#111728] border-slate-800 hover:border-purple-500/50'
                            : 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
                        }`}
                      >
                        <div>
                          <div
                            className={`text-xs font-bold line-clamp-1 transition-colors ${
                              isDarkMode
                                ? 'text-white group-hover:text-cyan-300'
                                : 'text-slate-900 group-hover:text-purple-600'
                            }`}
                          >
                            {cert.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {cert.issuer} · {cert.category}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Results */}
              {matchedDocuments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    <FileText className="w-4 h-4" />
                    <span>Dokumen Kampus ({matchedDocuments.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => onNavigate('documents')}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                          isDarkMode
                            ? 'bg-[#111728] border-slate-800 hover:border-cyan-500/50'
                            : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                        }`}
                      >
                        <div>
                          <div
                            className={`text-xs font-bold line-clamp-1 transition-colors ${
                              isDarkMode
                                ? 'text-white group-hover:text-cyan-300'
                                : 'text-slate-900 group-hover:text-cyan-600'
                            }`}
                          >
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {doc.category} · {doc.courseName || '-'}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Results */}
              {matchedNotes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                    <BookOpen className="w-4 h-4" />
                    <span>Catatan Kuliah ({matchedNotes.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => onNavigate('notes-tasks')}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                          isDarkMode
                            ? 'bg-[#111728] border-slate-800 hover:border-amber-500/50'
                            : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                        }`}
                      >
                        <div>
                          <div
                            className={`text-xs font-bold line-clamp-1 transition-colors ${
                              isDarkMode
                                ? 'text-white group-hover:text-amber-300'
                                : 'text-slate-900 group-hover:text-amber-600'
                            }`}
                          >
                            {note.title}
                          </div>
                          <div className="text-[10px] text-slate-400">{note.courseName}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Results */}
              {matchedTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                    <CheckSquare className="w-4 h-4" />
                    <span>Tugas & Deadline ({matchedTasks.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onNavigate('notes-tasks')}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                          isDarkMode
                            ? 'bg-[#111728] border-slate-800 hover:border-rose-500/50'
                            : 'bg-white border-slate-200 hover:border-rose-400 shadow-sm'
                        }`}
                      >
                        <div>
                          <div
                            className={`text-xs font-bold line-clamp-1 transition-colors ${
                              isDarkMode
                                ? 'text-white group-hover:text-rose-300'
                                : 'text-slate-900 group-hover:text-rose-600'
                            }`}
                          >
                            {t.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t.courseName} · Prioritas {t.priority} · {t.status}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Snippets Results */}
              {matchedSnippets.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                    <Code2 className="w-4 h-4" />
                    <span>Coding Vault ({matchedSnippets.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedSnippets.map((sn) => (
                      <div
                        key={sn.id}
                        onClick={() => onNavigate('coding')}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                          isDarkMode
                            ? 'bg-[#111728] border-slate-800 hover:border-emerald-500/50'
                            : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
                        }`}
                      >
                        <div>
                          <div
                            className={`text-xs font-bold line-clamp-1 transition-colors ${
                              isDarkMode
                                ? 'text-white group-hover:text-emerald-300'
                                : 'text-slate-900 group-hover:text-emerald-600'
                            }`}
                          >
                            {sn.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {sn.language} · {sn.category}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

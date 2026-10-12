import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Copy,
  Check,
  Search,
  Plus,
  Star,
  Download,
  Share2,
  Trash2,
  Edit3,
  ExternalLink,
  Terminal,
  FileCode,
  X,
  AlertTriangle,
} from 'lucide-react';
import { SnippetItem, ProgrammingLanguage, SnippetCategory } from '../../types';

interface CodingScreenProps {
  snippets: SnippetItem[];
  onAddSnippet: (snip: SnippetItem) => void;
  onUpdateSnippet: (snip: SnippetItem) => void;
  onDeleteSnippet: (id: string) => void;
  isDarkMode: boolean;
}

const LANGUAGES: ProgrammingLanguage[] = [
  'Kotlin',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'C',
  'C++',
  'HTML',
  'CSS',
  'SQL',
  'PHP',
  'Dart',
  'Bash',
  'JSON',
];

const CATEGORIES: SnippetCategory[] = [
  'Algoritma',
  'Struktur data',
  'UI',
  'API',
  'Database',
  'Authentication',
  'Debugging',
  'Utility',
  'Tugas kuliah',
  'Project pribadi',
];

export const CodingScreen: React.FC<CodingScreenProps> = ({
  snippets,
  onAddSnippet,
  onUpdateSnippet,
  onDeleteSnippet,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<SnippetItem | null>(null);
  const [viewingSnippet, setViewingSnippet] = useState<SnippetItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formLang, setFormLang] = useState<ProgrammingLanguage>('Kotlin');
  const [formCategory, setFormCategory] = useState<SnippetCategory>('UI');
  const [formDesc, setFormDesc] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formTags, setFormTags] = useState('Android, Compose');

  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang = selectedLang === 'Semua' || s.language === selectedLang;
    const matchesCat = selectedCategory === 'Semua' || s.category === selectedCategory;

    return matchesSearch && matchesLang && matchesCat;
  });

  const handleCopyCode = (snippet: SnippetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSnippet = (snippet: SnippetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const extMap: Record<ProgrammingLanguage, string> = {
      Kotlin: 'kt',
      Java: 'java',
      Python: 'py',
      JavaScript: 'js',
      TypeScript: 'ts',
      C: 'c',
      'C++': 'cpp',
      HTML: 'html',
      CSS: 'css',
      SQL: 'sql',
      PHP: 'php',
      Dart: 'dart',
      Bash: 'sh',
      JSON: 'json',
    };
    const ext = extMap[snippet.language] || 'txt';
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.replace(/\s+/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenAdd = () => {
    setEditingSnippet(null);
    setFormTitle('');
    setFormLang('Kotlin');
    setFormCategory('UI');
    setFormDesc('');
    setFormCode('// Tulis kode program Anda di sini\n');
    setFormTags('Android');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (snip: SnippetItem) => {
    setEditingSnippet(snip);
    setFormTitle(snip.title);
    setFormLang(snip.language);
    setFormCategory(snip.category);
    setFormDesc(snip.description);
    setFormCode(snip.code);
    setFormTags(snip.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCode.trim()) return;

    const tagsArray = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingSnippet) {
      const updated: SnippetItem = {
        ...editingSnippet,
        title: formTitle,
        language: formLang,
        category: formCategory,
        description: formDesc,
        code: formCode,
        tags: tagsArray,
        updatedAt: Date.now(),
      };
      onUpdateSnippet(updated);
    } else {
      const newSnip: SnippetItem = {
        id: `snip-${Date.now()}`,
        title: formTitle,
        language: formLang,
        category: formCategory,
        description: formDesc,
        code: formCode,
        tags: tagsArray,
        isFavorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      onAddSnippet(newSnip);
    }
    setIsModalOpen(false);
  };

  const toggleFavorite = (snip: SnippetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateSnippet({
      ...snip,
      isFavorite: !snip.isFavorite,
    });
  };

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
            <span>Coding Vault</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-mono font-bold">
              {snippets.length}
            </span>
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Kumpulan algoritma, komponen UI, & snippet solusi kuliah
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kode</span>
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari algoritma, fungsi, query SQL, atau tag..."
          className={`w-full border text-xs rounded-xl py-2.5 pl-9 pr-3 outline-none transition-colors ${
            isDarkMode
              ? 'bg-[#121828] border-slate-800 focus:border-emerald-500 text-white placeholder:text-slate-600'
              : 'bg-white border-slate-300 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
          }`}
        />
      </div>

      {/* 3. Language Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setSelectedLang('Semua')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs transition-colors cursor-pointer ${
            selectedLang === 'Semua'
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : isDarkMode
              ? 'bg-[#121828] text-slate-400 border border-slate-800'
              : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
          }`}
        >
          Semua Bahasa
        </button>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs transition-colors cursor-pointer ${
              selectedLang === lang
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : isDarkMode
                ? 'bg-[#121828] text-slate-400 border border-slate-800'
                : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* 4. Snippets List */}
      <div className="space-y-3">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map((snip) => (
            <div
              key={snip.id}
              onClick={() => setViewingSnippet(snip)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                isDarkMode
                  ? 'bg-[#111728] border-slate-800 hover:border-emerald-500/50'
                  : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-xs line-clamp-1 transition-colors ${
                        isDarkMode
                          ? 'text-white group-hover:text-emerald-300'
                          : 'text-slate-900 group-hover:text-emerald-600'
                      }`}
                    >
                      {snip.title}
                    </h3>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="text-emerald-500 font-mono font-bold">
                        {snip.language}
                      </span>
                      <span>·</span>
                      <span>{snip.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => toggleFavorite(snip, e)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        snip.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => handleCopyCode(snip, e)}
                    className="p-1.5 text-slate-400 hover:text-emerald-500 cursor-pointer"
                    title="Salin Kode"
                  >
                    {copiedId === snip.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {snip.description && (
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {snip.description}
                </p>
              )}

              {/* Code Preview Box with Monospace font */}
              <div
                className={`mt-2.5 p-2.5 rounded-xl border font-mono text-[11px] overflow-x-auto max-h-28 leading-snug ${
                  isDarkMode
                    ? 'bg-[#090D18] border-slate-800/80 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <pre>{snip.code.split('\n').slice(0, 5).join('\n')}</pre>
                {snip.code.split('\n').length > 5 && (
                  <div className="text-[9px] text-slate-400 pt-1 italic">
                    + {snip.code.split('\n').length - 5} baris lainnya...
                  </div>
                )}
              </div>

              {/* Tags & Action Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  {snip.tags.map((t) => (
                    <span
                      key={t}
                      className={`px-1.5 py-0.2 rounded border ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-400'
                          : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-emerald-500 font-medium">Buka Snippet →</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-3xl bg-[#111728] border border-dashed border-slate-800 text-center">
            <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-white">Tidak ada kode yang cocok</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Simpan kode Kotlin, Python, atau algoritma yang sering digunakan.
            </div>
          </div>
        )}
      </div>

      {/* 5. Snippet Viewer Modal */}
      <AnimatePresence>
        {viewingSnippet && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-lg bg-[#0E1424] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[92vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-1">
                      {viewingSnippet.title}
                    </h3>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      {viewingSnippet.language} · {viewingSnippet.category}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingSnippet(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-3 space-y-3 flex-1">
                {viewingSnippet.description && (
                  <p className="text-xs text-slate-400 bg-[#121828] p-3 rounded-xl">
                    {viewingSnippet.description}
                  </p>
                )}

                {/* Monospace Full Code View with Line Numbers */}
                <div className="rounded-2xl bg-[#080D1A] border border-slate-800 p-3 font-mono text-xs overflow-x-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                    <span>{viewingSnippet.language} Source</span>
                    <span>{viewingSnippet.code.split('\n').length} Baris Kode</span>
                  </div>
                  <pre className="text-slate-200 leading-relaxed whitespace-pre font-mono">
                    {viewingSnippet.code}
                  </pre>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const id = viewingSnippet.id;
                      setViewingSnippet(null);
                      setDeletingId(id);
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const s = viewingSnippet;
                      setViewingSnippet(null);
                      handleOpenEdit(s);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadSnippet(viewingSnippet)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File</span>
                  </button>
                  <button
                    onClick={() => handleCopyCode(viewingSnippet)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    {copiedId === viewingSnippet.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Add / Edit Snippet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-lg bg-[#0E1424] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              <h3 className="font-bold text-sm text-white mb-3">
                {editingSnippet ? 'Edit Snippet Kode' : 'Tambah Snippet Baru'}
              </h3>
              <form onSubmit={handleSaveSnippet} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Judul Kode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Room Database DAO Coroutine Flow"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Bahasa Pemrograman
                    </label>
                    <select
                      value={formLang}
                      onChange={(e) => setFormLang(e.target.value as any)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500 font-mono"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Kategori
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Deskripsi & Catatan
                  </label>
                  <input
                    type="text"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Penjelasan fungsi dan cara pakai..."
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Kode Program (Monospace) *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Tempel atau ketik kode di sini..."
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Tags (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Kotlin, Jetpack, Database"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Simpan Snippet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Delete Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#121828] border border-rose-500/40 rounded-3xl p-5 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Hapus Snippet Ini?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kode akan dihapus secara permanen dari database lokal.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDeleteSnippet(deletingId);
                    setDeletingId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

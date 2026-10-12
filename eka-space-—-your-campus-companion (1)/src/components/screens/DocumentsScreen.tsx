import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderArchive,
  Folder,
  FolderPlus,
  FileText,
  Search,
  Plus,
  Star,
  Download,
  Trash2,
  Edit3,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Image,
  AlertTriangle,
  X,
  Eye,
  File,
} from 'lucide-react';
import { DocumentItem, DocumentFolder, DocumentCategory } from '../../types';

interface DocumentsScreenProps {
  documents: DocumentItem[];
  folders: DocumentFolder[];
  onAddDocument: (doc: DocumentItem) => void;
  onUpdateDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
  onAddFolder: (folder: DocumentFolder) => void;
  onDeleteFolder: (folderId: string) => void;
  isDarkMode: boolean;
}

const CATEGORIES: DocumentCategory[] = [
  'Materi kuliah',
  'Modul praktikum',
  'Tugas',
  'Laporan',
  'Presentasi',
  'Jurnal',
  'Referensi',
  'Administrasi kampus',
  'Dokumen pribadi',
  'Lainnya',
];

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  documents,
  folders,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onAddFolder,
  onDeleteFolder,
  isDarkMode,
}) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  // Modals
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Form for document
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Materi kuliah');
  const [docCourse, setDocCourse] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docFileType, setDocFileType] = useState<DocumentItem['fileType']>('pdf');
  const [docFileName, setDocFileName] = useState('');
  const [docFileSize, setDocFileSize] = useState(1500000);
  const [docTargetFolder, setDocTargetFolder] = useState<string>('');

  const currentFolder = folders.find((f) => f.id === currentFolderId);

  // Filtered docs
  const filteredDocuments = documents
    .filter((doc) => {
      const inCurrentFolder = currentFolderId ? doc.folderId === currentFolderId : true;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.courseName && doc.courseName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'Semua' || doc.category === selectedCategory;

      return inCurrentFolder && matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.fileSize - a.fileSize;
      return b.updatedAt - a.updatedAt;
    });

  const getFileIcon = (type: DocumentItem['fileType']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'pptx':
        return <FileSpreadsheet className="w-5 h-5 text-orange-400" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'zip':
        return <FileArchive className="w-5 h-5 text-amber-400" />;
      case 'jpg':
      case 'png':
        return <Image className="w-5 h-5 text-cyan-400" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folder: DocumentFolder = {
      id: `fld-${Date.now()}`,
      name: newFolderName.trim(),
      color: '#8B5CF6',
      createdAt: Date.now(),
    };
    onAddFolder(folder);
    setNewFolderName('');
    setIsAddFolderOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocFileName(file.name);
    setDocName(file.name.replace(/\.[^/.]+$/, ''));
    setDocFileSize(file.size);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setDocFileType('pdf');
    else if (ext === 'docx' || ext === 'doc') setDocFileType('docx');
    else if (ext === 'pptx' || ext === 'ppt') setDocFileType('pptx');
    else if (ext === 'xlsx' || ext === 'xls') setDocFileType('xlsx');
    else if (ext === 'zip' || ext === 'rar') setDocFileType('zip');
    else if (ext === 'jpg' || ext === 'jpeg') setDocFileType('jpg');
    else if (ext === 'png') setDocFileType('png');
    else if (ext === 'txt') setDocFileType('txt');
    else setDocFileType('other');
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: docName,
      folderId: docTargetFolder || currentFolderId || null,
      category: docCategory,
      fileType: docFileType,
      fileName: docFileName || `${docName}.${docFileType}`,
      fileSize: docFileSize,
      courseName: docCourse || undefined,
      description: docDescription || undefined,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onAddDocument(newDoc);
    setIsAddDocOpen(false);
  };

  const toggleFavoriteDoc = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateDocument({
      ...doc,
      isFavorite: !doc.isFavorite,
    });
  };

  const downloadDocFile = (doc: DocumentItem) => {
    const content = `DOKUMEN KAMPUS EKA SPACE\nNama Dokumen: ${doc.name}\nKategori: ${doc.category}\nMata Kuliah: ${doc.courseName || '-'}\nUkuran: ${formatFileSize(doc.fileSize)}\nDeskripsi: ${doc.description || '-'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    a.click();
    URL.revokeObjectURL(url);
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
            <span>Dokumen Kampus Vault</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono font-bold">
              {documents.length}
            </span>
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Materi kuliah, modul praktikum, slide, dan laporan akademik
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAddFolderOpen(true)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#121828] border-slate-800 text-slate-300 hover:text-cyan-400'
                : 'bg-white border-slate-200 text-slate-700 hover:text-cyan-600 shadow-sm'
            }`}
            title="Buat Folder Baru"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDocTargetFolder(currentFolderId || '');
              setDocName('');
              setDocFileName('');
              setIsAddDocOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah</span>
          </button>
        </div>
      </div>

      {/* 2. Folder Navigation Breadcrumbs */}
      {currentFolder && (
        <div
          className={`flex items-center gap-2 text-xs p-2.5 rounded-xl border ${
            isDarkMode ? 'bg-[#121828] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <button
            onClick={() => setCurrentFolderId(null)}
            className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua Folder</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`font-bold line-clamp-1 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {currentFolder.name}
          </span>
        </div>
      )}

      {/* 3. Folders Grid (shown when at root) */}
      {!currentFolderId && folders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Direktori Folder
            </span>
            <span className="text-[10px] text-slate-400">{folders.length} folder aktif</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {folders.map((folder) => {
              const count = documents.filter((d) => d.folderId === folder.id).length;
              return (
                <div
                  key={folder.id}
                  onClick={() => setCurrentFolderId(folder.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer group transition-all ${
                    isDarkMode
                      ? 'bg-[#111728] border-slate-800 hover:border-cyan-500/50'
                      : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Folder className="w-5 h-5 fill-cyan-400/20 text-cyan-500" />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold line-clamp-1 transition-colors ${
                          isDarkMode
                            ? 'text-white group-hover:text-cyan-300'
                            : 'text-slate-900 group-hover:text-cyan-600'
                        }`}
                      >
                        {folder.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{count} berkas</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Search and Sort Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, modul, slide..."
            className={`w-full text-xs rounded-xl py-2.5 pl-9 pr-3 outline-none border transition-colors ${
              isDarkMode
                ? 'bg-[#121828] border-slate-800 text-white focus:border-cyan-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600 shadow-sm'
            }`}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className={`border text-xs rounded-xl px-2.5 py-2.5 outline-none cursor-pointer ${
            isDarkMode
              ? 'bg-[#121828] border-slate-800 text-slate-300'
              : 'bg-white border-slate-300 text-slate-700 shadow-sm'
          }`}
        >
          <option value="date">Terbaru</option>
          <option value="name">Nama A-Z</option>
          <option value="size">Ukuran File</option>
        </select>
      </div>

      {/* 5. Documents List */}
      <div className="space-y-2">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setPreviewDoc(doc)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer group transition-all ${
                isDarkMode
                  ? 'bg-[#111728] border-slate-800/80 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDarkMode ? 'bg-slate-800/80' : 'bg-slate-100'
                  }`}
                >
                  {getFileIcon(doc.fileType)}
                </div>
                <div>
                  <h3
                    className={`text-xs font-bold line-clamp-1 transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-cyan-300'
                        : 'text-slate-900 group-hover:text-cyan-600'
                    }`}
                  >
                    {doc.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{doc.category}</span>
                    <span>·</span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-300">
                      {formatFileSize(doc.fileSize)}
                    </span>
                    {doc.courseName && (
                      <>
                        <span>·</span>
                        <span className="text-purple-600 dark:text-purple-300 font-medium">
                          {doc.courseName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => toggleFavoriteDoc(doc, e)}
                  className="p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      doc.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                    }`}
                  />
                </button>
                <Eye className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div
            className={`p-8 rounded-3xl border border-dashed text-center ${
              isDarkMode
                ? 'bg-[#111728] border-slate-800'
                : 'bg-white border-slate-300 shadow-sm'
            }`}
          >
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Tidak ada dokumen di folder ini
            </div>
            <div className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Impor PDF, modul, atau presentasi praktikum kuliah Anda.
            </div>
          </div>
        )}
      </div>

      {/* 6. Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className={`w-full max-w-lg rounded-3xl p-5 shadow-2xl space-y-4 border ${
                isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {getFileIcon(previewDoc.fileType)}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {previewDoc.name}
                    </h3>
                    <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">{previewDoc.category}</div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`flex justify-between py-1 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Nama Berkas Fisik</span>
                  <span className={`font-mono text-[11px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{previewDoc.fileName}</span>
                </div>
                <div className={`flex justify-between py-1 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Ukuran Berkas</span>
                  <span className="text-cyan-600 dark:text-cyan-300 font-mono font-medium">
                    {formatFileSize(previewDoc.fileSize)}
                  </span>
                </div>
                {previewDoc.courseName && (
                  <div className={`flex justify-between py-1 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Mata Kuliah</span>
                    <span className="text-purple-600 dark:text-purple-300 font-medium">{previewDoc.courseName}</span>
                  </div>
                )}
                {previewDoc.description && (
                  <div>
                    <div className={`mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Catatan Dokumen</div>
                    <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#121828] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                      {previewDoc.description}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const id = previewDoc.id;
                    setPreviewDoc(null);
                    setDeletingDocId(id);
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => downloadDocFile(previewDoc)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-600/30 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. New Folder Modal */}
      <AnimatePresence>
        {isAddFolderOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-xs rounded-3xl p-5 shadow-2xl border ${
                isDarkMode ? 'bg-[#121828] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h3 className={`font-bold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Buat Folder Baru</h3>
              <form onSubmit={handleCreateFolder} className="space-y-3">
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Contoh: Modul Lab Basis Data"
                  className={`w-full border text-xs rounded-xl p-2.5 outline-none focus:border-cyan-500 ${
                    isDarkMode
                      ? 'bg-[#162036] border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddFolderOpen(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs ${
                      isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Buat Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Upload Doc Modal */}
      <AnimatePresence>
        {isAddDocOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`w-full max-w-lg rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto border ${
                isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200 dark:border-slate-800">
                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Impor Dokumen Kampus</h3>
                <button
                  onClick={() => setIsAddDocOpen(false)}
                  className="text-slate-400 hover:text-cyan-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
                <div
                  className={`p-3 rounded-2xl border border-dashed text-center ${
                    isDarkMode
                      ? 'border-cyan-500/40 bg-cyan-950/20'
                      : 'border-cyan-400 bg-cyan-50/60'
                  }`}
                >
                  <input
                    type="file"
                    id="doc-file-input"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="doc-file-input" className="cursor-pointer block">
                    <FileText className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {docFileName || 'Pilih Berkas (PDF, DOCX, PPTX, dsb.)'}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Penyimpanan dokumen lokal Android Storage
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Nama Dokumen *
                  </label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Contoh: Modul Lab 3 Algoritma"
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-cyan-500 ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Kategori
                    </label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value as any)}
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-cyan-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Folder Tujuan
                    </label>
                    <select
                      value={docTargetFolder}
                      onChange={(e) => setDocTargetFolder(e.target.value)}
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-cyan-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">(Root / Tanpa Folder)</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Mata Kuliah
                  </label>
                  <input
                    type="text"
                    value={docCourse}
                    onChange={(e) => setDocCourse(e.target.value)}
                    placeholder="Contoh: Sistem Terdistribusi"
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-cyan-500 ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddDocOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30 cursor-pointer"
                  >
                    Simpan Dokumen
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. Delete Confirmation */}
      <AnimatePresence>
        {deletingDocId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl border ${
                isDarkMode ? 'bg-[#121828] border-rose-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Hapus Dokumen Ini?</h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Dokumen akan dihapus dari penyimpanan internal perangkat Anda.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeletingDocId(null)}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDeleteDocument(deletingDocId);
                    setDeletingDocId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
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

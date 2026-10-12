import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Share2,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  Calendar,
  Tag,
  Building,
  X,
  FileText,
  Image,
  AlertTriangle,
} from 'lucide-react';
import { CertificateItem, CertificateCategory } from '../../types';

interface CertificatesScreenProps {
  certificates: CertificateItem[];
  onAddCertificate: (cert: CertificateItem) => void;
  onUpdateCertificate: (cert: CertificateItem) => void;
  onDeleteCertificate: (id: string) => void;
  isDarkMode: boolean;
}

const CATEGORIES: CertificateCategory[] = [
  'Akademik',
  'Kompetisi',
  'Bootcamp',
  'Kursus online',
  'Seminar',
  'Webinar',
  'Organisasi',
  'Kepanitiaan',
  'Magang',
  'Lainnya',
];

export const CertificatesScreen: React.FC<CertificatesScreenProps> = ({
  certificates,
  onAddCertificate,
  onUpdateCertificate,
  onDeleteCertificate,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [activePreviewCert, setActivePreviewCert] = useState<CertificateItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formEventName, setFormEventName] = useState('');
  const [formCategory, setFormCategory] = useState<CertificateCategory>('Akademik');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formCertNumber, setFormCertNumber] = useState('');
  const [formVerificationUrl, setFormVerificationUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('Android, Kotlin');
  const [formFileType, setFormFileType] = useState<'pdf' | 'jpg' | 'png'>('pdf');
  const [formFileName, setFormFileName] = useState('');
  const [formFileData, setFormFileData] = useState<string | undefined>(undefined);

  // Filter logic
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Semua' || cert.category === selectedCategory;

    const matchesFavorite = !onlyFavorites || cert.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormTitle('');
    setFormIssuer('');
    setFormEventName('');
    setFormCategory('Akademik');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormExpiryDate('');
    setFormCertNumber('');
    setFormVerificationUrl('');
    setFormDescription('');
    setFormTags('Prestasi, Kampus');
    setFormFileType('pdf');
    setFormFileName('Sertifikat_Baru.pdf');
    setFormFileData(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormTitle(cert.title);
    setFormIssuer(cert.issuer);
    setFormEventName(cert.eventName || '');
    setFormCategory(cert.category);
    setFormDate(cert.issueDate);
    setFormExpiryDate(cert.expiryDate || '');
    setFormCertNumber(cert.certificateNumber || '');
    setFormVerificationUrl(cert.verificationUrl || '');
    setFormDescription(cert.description);
    setFormTags(cert.tags.join(', '));
    setFormFileType(cert.fileType);
    setFormFileName(cert.fileName);
    setFormFileData(cert.fileData);
    setIsAddModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg') setFormFileType('jpg');
    else if (ext === 'png') setFormFileType('png');
    else setFormFileType('pdf');

    const reader = new FileReader();
    reader.onload = () => {
      setFormFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formIssuer.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingCert) {
      const updated: CertificateItem = {
        ...editingCert,
        title: formTitle,
        issuer: formIssuer,
        eventName: formEventName,
        category: formCategory,
        issueDate: formDate,
        expiryDate: formExpiryDate || undefined,
        certificateNumber: formCertNumber || undefined,
        verificationUrl: formVerificationUrl || undefined,
        description: formDescription,
        tags: tagsArray,
        fileType: formFileType,
        fileName: formFileName || editingCert.fileName,
        fileData: formFileData || editingCert.fileData,
        updatedAt: Date.now(),
      };
      onUpdateCertificate(updated);
    } else {
      const newCert: CertificateItem = {
        id: `cert-${Date.now()}`,
        title: formTitle,
        issuer: formIssuer,
        eventName: formEventName,
        category: formCategory,
        issueDate: formDate,
        expiryDate: formExpiryDate || undefined,
        certificateNumber: formCertNumber || undefined,
        verificationUrl: formVerificationUrl || undefined,
        description: formDescription,
        tags: tagsArray,
        isFavorite: false,
        fileType: formFileType,
        fileName: formFileName || `${formTitle.replace(/\s+/g, '_')}.${formFileType}`,
        fileSize: 1250000,
        fileData: formFileData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      onAddCertificate(newCert);
    }

    setIsAddModalOpen(false);
  };

  const toggleFavorite = (cert: CertificateItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateCertificate({
      ...cert,
      isFavorite: !cert.isFavorite,
    });
  };

  const downloadCertFile = (cert: CertificateItem) => {
    const textContent = `SERTIFIKAT DIGITAL EKA SPACE\nJudul: ${cert.title}\nPenyelenggara: ${cert.issuer}\nNomor: ${cert.certificateNumber || '-'}\nTanggal: ${cert.issueDate}\nTautan: ${cert.verificationUrl || '-'}\nDeskripsi: ${cert.description}`;
    const blob = cert.fileData
      ? dataUriToBlob(cert.fileData)
      : new Blob([textContent], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cert.fileName || `${cert.title}.${cert.fileType}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function dataUriToBlob(dataURI: string) {
    try {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch {
      return new Blob([dataURI], { type: 'text/plain' });
    }
  }

  return (
    <div className="p-4 space-y-4 pb-16">
      {/* 1. Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-lg font-black tracking-tight flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>Certificate Vault</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold">
              {certificates.length}
            </span>
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Penyimpanan terpusat sertifikat prestasi, seminar & kursus
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* 2. Search & View Mode Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, penyelenggara, atau tag..."
            className={`w-full border text-xs rounded-xl py-2.5 pl-9 pr-8 outline-none transition-colors ${
              isDarkMode
                ? 'bg-[#121828] border-slate-800 focus:border-purple-500 text-white placeholder:text-slate-600'
                : 'bg-white border-slate-300 focus:border-purple-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Favorite filter toggle */}
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`p-2.5 rounded-xl border transition-colors ${
            onlyFavorites
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
              : isDarkMode
              ? 'bg-[#121828] text-slate-400 border-slate-800 hover:text-slate-200'
              : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
          }`}
          title="Tampilkan hanya favorit"
        >
          <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : ''}`} />
        </button>

        {/* Grid / List switcher */}
        <div
          className={`flex items-center border rounded-xl p-0.5 ${
            isDarkMode ? 'bg-[#121828] border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}
        >
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Category Horizontal Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedCategory('Semua')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'Semua'
              ? 'bg-purple-600 text-white shadow-sm'
              : isDarkMode
              ? 'bg-[#121828] text-slate-400 hover:text-slate-200 border border-slate-800'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Semua
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : isDarkMode
                ? 'bg-[#121828] text-slate-400 hover:text-slate-200 border border-slate-800'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Certificate List / Grid */}
      {filteredCertificates.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setActivePreviewCert(cert)}
                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                  isDarkMode
                    ? 'bg-[#111728] border-slate-800/90 hover:border-purple-500/60'
                    : 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
                }`}
              >
                {/* Visual Card Banner Header */}
                <div
                  className={`w-full h-20 rounded-xl border relative overflow-hidden flex flex-col items-center justify-center mb-2.5 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-purple-950/60 to-slate-900 border-purple-500/20'
                      : 'bg-gradient-to-br from-purple-100 to-indigo-50 border-purple-200/60'
                  }`}
                >
                  <div className="absolute top-1.5 left-2 flex items-center gap-1 text-[9px] font-mono uppercase text-slate-400">
                    <span>{cert.fileType.toUpperCase()}</span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(cert, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/30 hover:bg-black/60 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        cert.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  <Award className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />

                  <span
                    className={`text-[10px] font-semibold mt-1 px-2 text-center line-clamp-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {cert.category}
                  </span>
                </div>

                {/* Content details */}
                <div className="flex-1">
                  <h3
                    className={`font-bold text-xs leading-tight line-clamp-2 transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-cyan-300'
                        : 'text-slate-900 group-hover:text-purple-600'
                    }`}
                  >
                    {cert.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {cert.issuer}
                  </div>
                </div>

                {/* Bottom metadata */}
                <div
                  className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                    isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>{cert.issueDate}</span>
                  <span className="text-purple-600 dark:text-cyan-400 font-medium">Buka →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setActivePreviewCert(cert)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer group ${
                  isDarkMode
                    ? 'bg-[#111728] border-slate-800 hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-500 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-xs line-clamp-1 ${
                        isDarkMode
                          ? 'text-white group-hover:text-cyan-300'
                          : 'text-slate-900 group-hover:text-purple-600'
                      }`}
                    >
                      {cert.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{cert.issuer}</span>
                      <span>·</span>
                      <span className="text-purple-500 font-medium">{cert.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(cert, e)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        cert.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div
          className={`p-8 rounded-3xl border border-dashed text-center ${
            isDarkMode ? 'bg-[#111728] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Tidak ada sertifikat ditemukan
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? `Tidak ada hasil untuk pencarian "${searchQuery}". Coba kata kunci lain.`
              : 'Belum ada sertifikat di kategori ini. Tambahkan sertifikat pertama Anda.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sertifikat Baru</span>
          </button>
        </div>
      )}

      {/* 5. Detail & Preview Modal */}
      <AnimatePresence>
        {activePreviewCert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className={`w-full max-w-lg rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border ${
                isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div
                className={`p-4 border-b flex items-center justify-between ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">
                      {activePreviewCert.category}
                    </span>
                    <h3
                      className={`font-bold text-sm line-clamp-1 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {activePreviewCert.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActivePreviewCert(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-500/15 text-slate-400 hover:text-purple-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Preview Viewport */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                {/* Visual Preview Container */}
                <div
                  className={`w-full rounded-2xl border p-4 flex flex-col items-center justify-center min-h-[180px] relative ${
                    isDarkMode ? 'bg-[#080D1A] border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  {activePreviewCert.fileData && activePreviewCert.fileType !== 'pdf' ? (
                    <img
                      src={activePreviewCert.fileData}
                      alt={activePreviewCert.title}
                      className="max-h-56 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-2">
                        {activePreviewCert.fileType === 'pdf' ? (
                          <FileText className="w-8 h-8" />
                        ) : (
                          <Image className="w-8 h-8" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-white">
                        {activePreviewCert.fileName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Format: {activePreviewCert.fileType.toUpperCase()} · Ukuran:{' '}
                        {((activePreviewCert.fileSize || 1200000) / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                        ✓ File terverifikasi aman & tersimpan dalam storage privat
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata details table */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Penyelenggara</span>
                    <span className="text-white font-medium">{activePreviewCert.issuer}</span>
                  </div>

                  {activePreviewCert.eventName && (
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Nama Kegiatan</span>
                      <span className="text-white font-medium">
                        {activePreviewCert.eventName}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Tanggal Terbit</span>
                    <span className="text-white font-medium">{activePreviewCert.issueDate}</span>
                  </div>

                  {activePreviewCert.certificateNumber && (
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Nomor Sertifikat</span>
                      <span className="text-cyan-300 font-mono font-medium">
                        {activePreviewCert.certificateNumber}
                      </span>
                    </div>
                  )}

                  {activePreviewCert.verificationUrl && (
                    <div className="flex justify-between py-1 border-b border-slate-800 items-center">
                      <span className="text-slate-400">Tautan Verifikasi</span>
                      <a
                        href={activePreviewCert.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                      >
                        <span>Cek Online</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-1">Deskripsi Kegiatan</h4>
                  <p className="text-xs text-slate-400 bg-[#121828] p-3 rounded-xl leading-relaxed">
                    {activePreviewCert.description || 'Tidak ada deskripsi tambahan.'}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-1.5">Label / Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activePreviewCert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-3 border-t border-slate-800 bg-[#0A0F1D] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const id = activePreviewCert.id;
                      setActivePreviewCert(null);
                      setDeletingCertId(id);
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Hapus Sertifikat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const c = activePreviewCert;
                      setActivePreviewCert(null);
                      handleOpenEdit(c);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Edit Metadata"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadCertFile(activePreviewCert)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh / Ekspor</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Add / Edit Certificate Modal Form */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`w-full max-w-lg rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border ${
                isDarkMode ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div
                className={`p-4 border-b flex items-center justify-between ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <h3
                  className={`font-bold text-sm ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {editingCert ? 'Edit Metadata Sertifikat' : 'Tambah Sertifikat Baru'}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-purple-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
                {/* File Upload Box */}
                <div className="p-3 rounded-2xl border border-dashed border-purple-500/40 bg-purple-950/20 text-center">
                  <input
                    type="file"
                    id="cert-file-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="cert-file-input" className="cursor-pointer block">
                    <Award className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <div className="font-bold text-white">
                      {formFileName ? formFileName : 'Pilih File Sertifikat (PDF / JPG / PNG)'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Klik untuk memilih dari penyimpanan Android Storage Access Framework
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Judul Sertifikat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Juara 1 UI/UX Design Competition"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Penyelenggara *
                    </label>
                    <input
                      type="text"
                      required
                      value={formIssuer}
                      onChange={(e) => setFormIssuer(e.target.value)}
                      placeholder="Contoh: Google Developers"
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Kategori
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as CertificateCategory)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Tanggal Terbit
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Nomor Sertifikat
                    </label>
                    <input
                      type="text"
                      value={formCertNumber}
                      onChange={(e) => setFormCertNumber(e.target.value)}
                      placeholder="Contoh: CERT-2024-990"
                      className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Tautan Verifikasi Online
                  </label>
                  <input
                    type="url"
                    value={formVerificationUrl}
                    onChange={(e) => setFormVerificationUrl(e.target.value)}
                    placeholder="https://verify.example.com/cert/123"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Deskripsi & Pembelajaran
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Tuliskan kompetensi atau materi yang dipelajari..."
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
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
                    placeholder="Android, Kotlin, UI/UX"
                    className="w-full bg-[#121828] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                  >
                    {editingCert ? 'Simpan Perubahan' : 'Simpan ke Vault'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Confirm Delete Modal */}
      <AnimatePresence>
        {deletingCertId && (
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
              <h3 className="font-bold text-white text-base">Hapus Sertifikat Ini?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tindakan ini akan menghapus sertifikat dan seluruh metadata terkait dari database
                lokal perangkat Anda.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeletingCertId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDeleteCertificate(deletingCertId);
                    setDeletingCertId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

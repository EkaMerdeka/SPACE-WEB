import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Upload,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileArchive,
  Database,
  ArrowRight,
  Info,
} from 'lucide-react';
import JSZip from 'jszip';
import { AppStorageRepository } from '../../data/storage';

interface BackupScreenProps {
  onDataRestored: () => void;
  isDarkMode: boolean;
}

export const BackupScreen: React.FC<BackupScreenProps> = ({ onDataRestored, isDarkMode }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'json' | 'zip'>('zip');
  const [includeFiles, setIncludeFiles] = useState(true);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

  // Restore states
  const [restorePayload, setRestorePayload] = useState<any | null>(null);
  const [restoreSummary, setRestoreSummary] = useState<any | null>(null);
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Storage breakdown
  const storageInfo = AppStorageRepository.getStorageBreakdown();

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccessMsg('');

    try {
      const backup = AppStorageRepository.generateBackup();
      const dateStr = new Date().toISOString().split('T')[0];

      if (exportType === 'zip') {
        const zip = new JSZip();
        // manifest JSON
        zip.file('ekaspace_manifest.json', JSON.stringify(backup, null, 2));

        // Folders structure
        const certFolder = zip.folder('certificates');
        backup.certificates.forEach((c) => {
          certFolder?.file(
            `${c.id}_${c.fileName || 'cert.txt'}`,
            c.fileData || `Sertifikat: ${c.title}\nPenyelenggara: ${c.issuer}\nNomor: ${c.certificateNumber || '-'}`
          );
        });

        const docFolder = zip.folder('documents');
        backup.documents.forEach((d) => {
          docFolder?.file(
            `${d.id}_${d.fileName || 'doc.txt'}`,
            `Dokumen Kampus: ${d.name}\nKategori: ${d.category}\nMata Kuliah: ${d.courseName || '-'}`
          );
        });

        const codeFolder = zip.folder('code_snippets');
        backup.snippets.forEach((s) => {
          codeFolder?.file(`${s.id}_${s.title.replace(/\s+/g, '_')}.txt`, s.code);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EKA_SPACE_Backup_${dateStr}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EKA_SPACE_Backup_${dateStr}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setExportSuccessMsg('Paket cadangan berhasil dibuat dan diunduh ke perangkat Anda!');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreError('');
    setRestoreSuccessMsg('');
    setRestorePayload(null);
    setRestoreSummary(null);

    try {
      if (file.name.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(file);
        const manifestFile = zip.file('ekaspace_manifest.json');
        if (!manifestFile) {
          setRestoreError('File ZIP tidak memiliki berkas manifest valid (ekaspace_manifest.json).');
          return;
        }
        const jsonText = await manifestFile.async('text');
        const parsed = JSON.parse(jsonText);
        setRestorePayload(parsed);
        setRestoreSummary({
          certificates: parsed.certificates?.length || 0,
          documents: parsed.documents?.length || 0,
          notes: parsed.notes?.length || 0,
          tasks: parsed.tasks?.length || 0,
          snippets: parsed.snippets?.length || 0,
          schedules: parsed.schedules?.length || 0,
        });
        setIsConfirmModalOpen(true);
      } else if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result as string);
            setRestorePayload(parsed);
            setRestoreSummary({
              certificates: parsed.certificates?.length || 0,
              documents: parsed.documents?.length || 0,
              notes: parsed.notes?.length || 0,
              tasks: parsed.tasks?.length || 0,
              snippets: parsed.snippets?.length || 0,
              schedules: parsed.schedules?.length || 0,
            });
            setIsConfirmModalOpen(true);
          } catch {
            setRestoreError('File JSON rusak atau tidak dapat diuraikan.');
          }
        };
        reader.readAsText(file);
      } else {
        setRestoreError('Format file tidak didukung. Harap pilih berkas .zip atau .json.');
      }
    } catch (err: any) {
      setRestoreError(`Gagal membaca file cadangan: ${err.message}`);
    }
  };

  const executeRestore = () => {
    if (!restorePayload) return;
    const res = AppStorageRepository.restoreBackup(restorePayload);
    if (res.success) {
      setRestoreSuccessMsg(res.message);
      setIsConfirmModalOpen(false);
      onDataRestored();
    } else {
      setRestoreError(res.message);
      setIsConfirmModalOpen(false);
    }
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Header */}
      <div>
        <h2
          className={`text-lg font-black tracking-tight flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span>Backup & Pemulihan Vault</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-mono font-bold">
            Offline Safe
          </span>
        </h2>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Cadangkan seluruh sertifikat, catatan, dokumen, dan tugas ke penyimpanan eksternal.
        </p>
      </div>

      {/* 2. Storage Overview Card */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <span
            className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <HardDrive className="w-4 h-4 text-cyan-500" />
            <span>Penyimpanan Lokal Vault</span>
          </span>
          <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">
            {formatBytes(storageInfo.totalBytes)} Terpakai
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0E1424] border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Sertifikat Digital
            </div>
            <div
              className={`font-bold font-mono mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatBytes(storageInfo.certificatesBytes)}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0E1424] border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Dokumen & Modul
            </div>
            <div
              className={`font-bold font-mono mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatBytes(storageInfo.documentsBytes)}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0E1424] border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Catatan Kuliah
            </div>
            <div
              className={`font-bold font-mono mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatBytes(storageInfo.notesBytes)}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0E1424] border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Snippet Kode
            </div>
            <div
              className={`font-bold font-mono mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatBytes(storageInfo.snippetsBytes)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Export Section */}
      <div
        className={`p-4 rounded-2xl border space-y-3.5 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h3
          className={`font-bold text-sm flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <Download className="w-4 h-4 text-purple-500" />
          <span>Buat Cadangan Baru</span>
        </h3>

        <div className="space-y-2 text-xs">
          <label
            className={`block text-[11px] font-semibold uppercase ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Format Ekspor
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setExportType('zip')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                exportType === 'zip'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-600 dark:text-purple-300 font-bold'
                  : isDarkMode
                  ? 'bg-[#121828] border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <FileArchive className="w-4 h-4" />
              <span>Arsip ZIP Komplit</span>
            </button>
            <button
              onClick={() => setExportType('json')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                exportType === 'json'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-600 dark:text-purple-300 font-bold'
                  : isDarkMode
                  ? 'bg-[#121828] border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Manifest JSON</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
        >
          {isExporting ? (
            <span>Mengemas Berkas Cadangan...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Ekspor & Unduh File Cadangan</span>
            </>
          )}
        </button>

        {exportSuccessMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{exportSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* 4. Restore Section */}
      <div
        className={`p-4 rounded-2xl border space-y-3.5 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h3
          className={`font-bold text-sm flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4 text-cyan-500" />
          <span>Pulihkan dari File Cadangan</span>
        </h3>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Pilih berkas cadangan (.zip atau .json) yang pernah diekspor sebelumnya untuk mengembalikan
          seluruh data vault.
        </p>

        <div
          className={`p-4 rounded-2xl border border-dashed text-center ${
            isDarkMode
              ? 'border-cyan-500/40 bg-cyan-950/20'
              : 'border-cyan-400 bg-cyan-50/60'
          }`}
        >
          <input
            type="file"
            id="backup-file-input"
            accept=".zip,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="backup-file-input" className="cursor-pointer block">
            <Upload className="w-6 h-6 text-cyan-500 mx-auto mb-1.5" />
            <div className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Pilih File Cadangan (.zip / .json)
            </div>
            <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Klik untuk memilih berkas dari perangkat
            </div>
          </label>
        </div>

        {restoreError && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{restoreError}</span>
          </div>
        )}

        {restoreSuccessMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{restoreSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* 5. Restore Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && restoreSummary && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border ${
                isDarkMode
                  ? 'bg-[#121828] border-cyan-500/40 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Konfirmasi Pemulihan Data
                </h3>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  File cadangan valid! Berikut ringkasan entitas yang akan dimuat ke database:
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
                  isDarkMode
                    ? 'bg-[#0E1424] border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>Sertifikat Digital</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {restoreSummary.certificates} item
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>Dokumen Kampus</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {restoreSummary.documents} item
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>Catatan Kuliah</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {restoreSummary.notes} item
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>Tugas & Deadline</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {restoreSummary.tasks} item
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>Coding Snippets</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {restoreSummary.snippets} item
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>Jadwal Kuliah</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {restoreSummary.schedules} kelas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-xs cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={executeRestore}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 cursor-pointer"
                >
                  Terapkan Restore
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

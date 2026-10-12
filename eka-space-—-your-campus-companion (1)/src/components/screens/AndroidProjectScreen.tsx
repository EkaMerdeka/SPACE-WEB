import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Smartphone,
  Download,
  FolderTree,
  FileCode,
  Copy,
  Check,
  Cpu,
  BookOpen,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import JSZip from 'jszip';
import { getAndroidStudioProjectFiles, AndroidFileItem } from '../../androidCode/sourceCodeGenerator';

interface AndroidProjectScreenProps {
  isDarkMode: boolean;
}

export const AndroidProjectScreen: React.FC<AndroidProjectScreenProps> = ({ isDarkMode }) => {
  const files = getAndroidStudioProjectFiles();
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(files[files.length - 1]); // README.md first
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setZipSuccess(false);

    try {
      const zip = new JSZip();

      // Place all files into their relative folder structure
      files.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Add gradle wrapper properties
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
`
      );

      // Add proguard rules
      zip.file(
        'app/proguard-rules.pro',
        `# ProGuard rules for EKA SPACE Android 16
-keep class com.ekaspace.app.data.entities.** { *; }
-dontwarn androidx.biometric.**
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'EKA_SPACE_Android_Studio_Project.zip';
      a.click();
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Header & One-Click ZIP Download */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1A183C] via-[#101830] to-[#0A1224] border border-purple-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full rounded-[15px] bg-[#0E1424] flex items-center justify-center font-bold text-cyan-300">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Source Code Android Studio</h2>
              <div className="text-[10px] text-cyan-300 font-mono">
                Kotlin · Jetpack Compose · Room · Android 16 (API 36)
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
            Siap Build
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Proyek Android native lengkap yang dapat langsung di-ekstrak dan dibuka di Android Studio
          Ladybug / Iguana. Lengkap dengan Room Database, Navigation Compose, DataStore, dan
          konfigurasi SDK 36 untuk Xiaomi Redmi 14C.
        </p>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-60 transition-all"
        >
          {isZipping ? (
            <span>Mengemas Berkas Proyek ZIP...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Paket Lengkap Android Studio (.ZIP)</span>
            </>
          )}
        </button>

        {zipSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Arsip proyek berhasil diunduh! Siap dibuka di Android Studio.</span>
          </div>
        )}
      </div>

      {/* 2. File Explorer Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-purple-400" />
            <span>Struktur Berkas Proyek ({files.length} berkas)</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Klik berkas untuk inspeksi</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {files.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-mono text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#121828] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Code Preview Viewport */}
      <div className="rounded-2xl bg-[#090D18] border border-slate-800 p-4 font-mono text-xs overflow-hidden shadow-inner">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{selectedFile.path}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300">
              {selectedFile.category.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed text-[11px] scrollbar-thin">
          {selectedFile.content}
        </pre>
      </div>

      {/* 4. Android Build Instructions Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121A30] to-[#0D1424] border border-cyan-500/30 space-y-2.5 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Cara 1: Instal Langsung di HP (Tanpa Laptop / WebAPK)</span>
          </h3>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded font-bold">
            Paling Cepat
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Aplikasi ini telah dilengkapi teknologi PWA (Progressive Web App). Anda dapat langsung
          memasangnya di Xiaomi Redmi 14C tanpa perlu instal Android Studio di komputer:
        </p>

        <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
          <li>Buka link aplikasi ini di browser <strong>Google Chrome</strong> pada HP Anda.</li>
          <li>
            Ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Chrome.
          </li>
          <li>
            Pilih menu <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
          </li>
          <li>
            Android akan otomatis mengompilasi dan memasang ikon <strong>EKA SPACE</strong> di layar
            dan laci aplikasi HP Anda. Aplikasi akan berjalan layar penuh (fullscreen) secara offline!
          </li>
        </ol>
      </div>

      {/* 5. Android Build Instructions Note */}
      <div className="p-4 rounded-2xl bg-[#111728] border border-slate-800 space-y-2 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Cara 2: Kompilasi Native APK di Android Studio</span>
          </h3>
          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded font-bold">
            Release APK
          </span>
        </div>
        <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 text-[11px]">
          <li>
            Unduh file <strong className="text-slate-200">EKA_SPACE_Android_Studio_Project.zip</strong>{' '}
            melalui tombol di atas.
          </li>
          <li>Ekstrak arsip ke folder komputer Anda.</li>
          <li>
            Buka Android Studio Ladybug, pilih <strong className="text-slate-200">Open</strong> lalu pilih
            folder yang diekstrak.
          </li>
          <li>Gradle akan menyinkronkan seluruh dependensi Jetpack Compose, Room, dan SDK 36.</li>
          <li>
            Jalankan perintah build release di terminal:{' '}
            <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">./gradlew assembleRelease</code>
          </li>
          <li>
            Berkas APK release siap diinstal langsung di HP:{' '}
            <code className="text-purple-300 bg-black/40 px-1 py-0.5 rounded">
              app/build/outputs/apk/release/app-release.apk
            </code>
            .
          </li>
        </ol>
      </div>
    </div>
  );
};

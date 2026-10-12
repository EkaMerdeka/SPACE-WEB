import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Bell,
  RefreshCw,
  Trash2,
  Lock,
  KeyRound,
  Info,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { AppSettings } from '../../types';
import { AppStorageRepository } from '../../data/storage';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onClearData: () => void;
  onNavigateToAndroidProject: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClearData,
  onNavigateToAndroidProject,
  isDarkMode,
  onToggleTheme,
}) => {
  const [pinInput, setPinInput] = useState(settings.savedPin || '1708');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Security Credentials form
  const [usernameInput, setUsernameInput] = useState('EKA');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleTogglePinLock = () => {
    const updated = {
      ...settings,
      pinLockEnabled: !settings.pinLockEnabled,
    };
    onUpdateSettings(updated);
  };

  const handleToggleReducedMotion = () => {
    const updated = {
      ...settings,
      reducedMotion: !settings.reducedMotion,
    };
    onUpdateSettings(updated);
  };

  const handleToggleNotifications = () => {
    const updated = {
      ...settings,
      notificationEnabled: !settings.notificationEnabled,
    };
    onUpdateSettings(updated);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length >= 4) {
      onUpdateSettings({
        ...settings,
        savedPin: pinInput,
      });
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 2000);
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    AppStorageRepository.saveCredentials(usernameInput, newPasswordInput);
    setPasswordChangeMsg('Password berhasil diperbarui!');
    setTimeout(() => {
      setPasswordChangeMsg('');
      setIsPasswordModalOpen(false);
    }, 1200);
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
          <Settings className="w-5 h-5 text-purple-500" />
          <span>Pengaturan & Personalisasi</span>
        </h2>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Konfigurasi tema, keamanan PIN, notifikasi, dan preferensi perangkat.
        </p>
      </div>

      {/* 2. Target Device Specs Banner */}
      <div
        className={`p-4 rounded-2xl border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#181938] via-[#10172E] to-[#0D1526] border-purple-500/30 text-white'
            : 'bg-gradient-to-br from-purple-100 via-indigo-50 to-slate-50 border-purple-200 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-xs mb-2">
          <span
            className={`flex items-center gap-1.5 font-bold ${
              isDarkMode ? 'text-cyan-300' : 'text-purple-700'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-500" />
            <span>Spesifikasi Perangkat Target</span>
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
              isDarkMode
                ? 'bg-purple-900/60 border border-purple-700/50 text-purple-200'
                : 'bg-purple-600 text-white font-bold'
            }`}
          >
            API 36
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Model Ponsel</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Xiaomi Redmi 14C
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Kapasitas Memori</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              8 GB RAM (LPDDR4X)
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Sistem Operasi</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Android 16 (Vanilla Ice Cream+)
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Arsitektur UI</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Jetpack Compose + Material 3
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tampilan & Tema */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h3
          className={`font-bold text-xs uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Tampilan & Animasi
        </h3>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isDarkMode ? 'Mode Gelap (Dark Mode)' : 'Mode Terang (Light Mode)'}
              </div>
              <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isDarkMode ? 'Aksen Deep Navy & Electric Violet' : 'Tampilan Bersih & Kontras Tinggi'}
              </div>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              isDarkMode ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div
          className={`flex items-center justify-between py-1 border-t pt-2 ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Kurangi Animasi (Reduced Motion)
              </div>
              <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Mempercepat transisi untuk penghematan daya baterai
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleReducedMotion}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.reducedMotion ? 'bg-cyan-600' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Keamanan & Kunci Aplikasi */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h3
          className={`font-bold text-xs uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Keamanan & Privasi
        </h3>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Kunci PIN Aplikasi
              </div>
              <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Meminta PIN setiap kali aplikasi dibuka
              </div>
            </div>
          </div>
          <button
            onClick={handleTogglePinLock}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.pinLockEnabled ? 'bg-emerald-600' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                settings.pinLockEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* PIN Change Form */}
        <form
          onSubmit={handleSavePin}
          className={`border-t pt-2 flex items-center gap-2 ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <div className="relative flex-1">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN 4-6 digit"
              className={`w-full font-mono text-xs rounded-xl py-2 pl-9 pr-3 outline-none border ${
                isDarkMode
                  ? 'bg-[#162036] border-slate-700 text-white focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
              }`}
            />
          </div>
          <button
            type="submit"
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }`}
          >
            Ubah PIN
          </button>
        </form>

        {pinChangeSuccess && (
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PIN berhasil diperbarui</span>
          </div>
        )}

        {/* Change Login Password Button */}
        <div className={`border-t pt-2 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
              isDarkMode
                ? 'bg-[#162036] hover:bg-slate-800 text-slate-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            <span>Ubah Kredensial Login Utama</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 5. Android Studio Source Code & APK Guide Shortcut */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h3
          className={`font-bold text-xs uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Proyek Android Studio Native
        </h3>
        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Lihat seluruh struktur kode Kotlin native, konfigurasi Gradle 8.x, AndroidManifest.xml,
          Room database entities, dan panduan kompilasi APK untuk Android 16.
        </p>
        <button
          onClick={onNavigateToAndroidProject}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>Buka Source Code Android Studio & Panduan APK</span>
        </button>
      </div>

      {/* 6. Reset & Data Management */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h3
          className={`font-bold text-xs uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Pemeliharaan Data
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex-1 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Data Demo</span>
          </button>

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Vault</span>
          </button>
        </div>
      </div>

      {/* 7. About App */}
      <div
        className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800 text-slate-400'
            : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}
      >
        <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          EKA SPACE — Your Campus Companion
        </div>
        <div>Versi: 1.0.0-rc1 (Release Candidate)</div>
        <div>Target SDK: 36 (Android 16 API Level 36)</div>
        <div>Compile SDK: 36 · Min SDK: 26</div>
        <div>Database Engine: Room v2.6.1 · Jetpack Compose BOM 2024.10.00</div>
        <div className={`pt-2 text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Dirancang untuk performa responsif, offline-first, dan kenyamanan satu tangan pada Xiaomi
          Redmi 14C.
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3 border ${
                isDarkMode ? 'bg-[#121828] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Ubah Kredensial Login
              </h3>
              <form onSubmit={handleSaveNewPassword} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className={`w-full text-xs rounded-xl p-2.5 border outline-none ${
                      isDarkMode
                        ? 'bg-[#162036] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan password baru"
                    className={`w-full text-xs rounded-xl p-2.5 border outline-none ${
                      isDarkMode
                        ? 'bg-[#162036] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                {passwordChangeMsg && (
                  <div className="text-emerald-500 text-[11px] font-medium">
                    {passwordChangeMsg}
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className={`px-3 py-1.5 rounded-lg ${
                      isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl space-y-3 border ${
                isDarkMode ? 'bg-[#121828] border-purple-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Muat Ulang Data Demo?
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Tindakan ini akan mengembalikan data biodata, sertifikat, modul kuliah, tugas, dan
                kode demo awal EKA.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onResetData();
                    setIsResetConfirmOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                >
                  Muat Data Demo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {isClearConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl space-y-3 border ${
                isDarkMode ? 'bg-[#121828] border-rose-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Kosongkan Seluruh Vault?
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Semua data akan dihapus untuk memulai dari kondisi bersih (kosong).
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setIsClearConfirmOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onClearData();
                    setIsClearConfirmOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  Kosongkan Vault
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

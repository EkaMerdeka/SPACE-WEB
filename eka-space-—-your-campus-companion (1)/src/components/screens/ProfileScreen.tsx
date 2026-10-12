import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Edit3,
  Copy,
  Check,
  Share2,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Award,
  Github,
  Linkedin,
  Globe,
  Camera,
  QrCode,
  Sparkles,
  ShieldCheck,
  X,
  LogOut,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { ProfileData } from '../../types';
import { compressImageToBase64 } from '../../util/imageHelper';

interface ProfileScreenProps {
  profile: ProfileData;
  onUpdateProfile: (profile: ProfileData) => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

// Preset avatars in SVG data URLs for instant selection
const PRESET_AVATARS = [
  {
    id: 'male',
    label: 'Mahasiswa',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366F1"/><stop offset="100%" stop-color="%2306B6D4"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(%23g1)"/><circle cx="50" cy="40" r="18" fill="%23FFFFFF"/><path d="M22 84 C22 62 34 56 50 56 C66 56 78 62 78 84 Z" fill="%23FFFFFF"/></svg>',
  },
  {
    id: 'female',
    label: 'Mahasiswi',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23EC4899"/><stop offset="100%" stop-color="%238B5CF6"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(%23g2)"/><circle cx="50" cy="38" r="17" fill="%23FFFFFF"/><path d="M24 84 C24 62 34 55 50 55 C66 55 76 62 76 84 Z" fill="%23FFFFFF"/></svg>',
  },
  {
    id: 'developer',
    label: 'Coder Tech',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310B981"/><stop offset="100%" stop-color="%233B82F6"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(%23g3)"/><circle cx="50" cy="40" r="18" fill="%23FFFFFF"/><path d="M22 84 C22 62 34 56 50 56 C66 56 78 62 78 84 Z" fill="%23FFFFFF"/><path d="M42 36 L36 40 L42 44 M58 36 L64 40 L58 44" stroke="%2310B981" stroke-width="3" stroke-linecap="round" fill="none"/></svg>',
  },
  {
    id: 'academic',
    label: 'Akademik',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F59E0B"/><stop offset="100%" stop-color="%23EF4444"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(%23g4)"/><circle cx="50" cy="42" r="17" fill="%23FFFFFF"/><path d="M22 84 C22 64 34 58 50 58 C66 58 78 64 78 84 Z" fill="%23FFFFFF"/><polygon points="50,18 74,28 50,38 26,28" fill="%23FDE68A"/></svg>',
  },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onLogout,
  isDarkMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [ktmFlip, setKtmFlip] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState<ProfileData>({ ...profile });
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleProcessImage = async (file: File, updateImmediate = false) => {
    try {
      setIsCompressingPhoto(true);
      const base64 = await compressImageToBase64(file, 350, 0.85);
      setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
      if (updateImmediate) {
        onUpdateProfile({ ...profile, avatarUrl: base64 });
      }
    } catch (err) {
      console.error('Gagal memproses gambar foto profil:', err);
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleShareProfile = () => {
    const displayName = profile.fullName || 'Mahasiswa EKA SPACE';
    const textContent = `${displayName} | NIM: ${profile.studentId || '-'} | ${profile.major || '-'} - ${profile.university || '-'}`;
    if (navigator.share) {
      navigator
        .share({
          title: `Profil Mahasiswa - ${displayName}`,
          text: textContent,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(textContent);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-lg font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Profil Mahasiswa
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Identitas digital & Kartu Tanda Mahasiswa (KTM)
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShareProfile}
            className={`p-2 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#121828] border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:text-purple-600 shadow-sm'
            }`}
            title="Bagikan Profil"
          >
            {shareSuccess ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => {
              setFormData({ ...profile });
              setIsEditing(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Biodata</span>
          </button>
        </div>
      </div>

      {/* Direct file input for KTM avatar upload */}
      <input
        id="ktm-avatar-direct-upload"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleProcessImage(file, true);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* 2. Digital KTM Card (Flip feature) */}
      <div className="perspective-1000">
        <motion.div
          animate={{ rotateY: ktmFlip ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className={`relative w-full rounded-3xl p-5 border shadow-xl cursor-pointer overflow-hidden transform-style-preserve-3d ${
            isDarkMode
              ? 'bg-gradient-to-br from-[#1C1A38] via-[#12182E] to-[#0A1020] border-purple-500/30 shadow-purple-950/40 text-white'
              : 'bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 border-purple-400/40 shadow-purple-900/20 text-white'
          }`}
          onClick={() => setKtmFlip(!ktmFlip)}
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          {!ktmFlip ? (
            /* Front of KTM */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px]">
                    <div className="w-full h-full rounded-[7px] bg-[#0E1322] flex items-center justify-center font-bold text-xs text-cyan-300">
                      E
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-300 tracking-wider uppercase font-bold">
                      KARTU TANDA MAHASISWA DIGITAL
                    </div>
                    <div className="text-xs font-bold leading-none text-slate-200">
                      {profile.university || 'Universitas Anda'}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  AKTIF S{profile.semester || 1}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Avatar with Camera badge */}
                <label
                  htmlFor="ktm-avatar-direct-upload"
                  className="relative shrink-0 cursor-pointer block group"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  title="Ketuk untuk ganti foto profil"
                >
                  <div className="w-16 h-16 rounded-2xl ring-2 ring-purple-400/50 overflow-hidden bg-gradient-to-tr from-purple-900 to-slate-900 flex items-center justify-center">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName || 'Foto'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <User className="w-8 h-8 text-purple-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-md ring-2 ring-slate-900 cursor-pointer transition-transform group-hover:scale-110">
                    <Camera className="w-3 h-3" />
                  </div>
                </label>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-base text-white tracking-tight leading-snug line-clamp-1">
                    {profile.fullName || 'Nama Mahasiswa (Belum Diisi)'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <span className="font-mono text-cyan-300 font-bold">
                      {profile.studentId ? `NIM: ${profile.studentId}` : 'NIM: (Belum diisi)'}
                    </span>
                    {profile.studentId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(profile.studentId, 'NIM');
                        }}
                        className="text-slate-400 hover:text-white"
                        title="Salin NIM"
                      >
                        {copiedField === 'NIM' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {profile.major || 'Program Studi'} ·{' '}
                    {profile.batchYear ? `Angkatan ${profile.batchYear}` : 'Angkatan'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Verified Identity • NFC Ready</span>
                </div>
                <span className="text-purple-200 underline">Ketuk untuk Balik ↻</span>
              </div>
            </div>
          ) : (
            /* Back of KTM */
            <div className="space-y-3 transform rotate-y-180">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-bold text-cyan-300">
                  KETENTUAN PENGGUNAAN KTM DIGITAL
                </span>
                <span className="text-[10px] text-purple-200 font-mono">
                  ID: {profile.studentId || '-'}
                </span>
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed">
                Kartu ini merupakan tanda pengenal resmi mahasiswa yang tersimpan secara aman di
                perangkat smartphone Anda. Berlaku untuk akses perpustakaan, laboratorium, dan
                verifikasi kehadiran.
              </p>
              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-200">
                  <div>Fakultas: {profile.faculty || '-'}</div>
                  <div>Email Kampus: {profile.email || '-'}</div>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
              <div className="text-center text-[10px] text-purple-200 font-medium">
                Ketuk lagi untuk kembali ke tampilan depan ↺
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 3. Quick Action: Ubah Foto Profil Banner */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
          isDarkMode
            ? 'bg-[#111728] border-slate-800 text-slate-300'
            : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div
              className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Foto Profil Mahasiswa
            </div>
            <div className="text-[10px] text-slate-400">
              {profile.avatarUrl ? 'Foto kustom terpasang' : 'Belum ada foto yang dipilih'}
            </div>
          </div>
        </div>

        <button
          onClick={() => directFileInputRef.current?.click()}
          disabled={isCompressingPhoto}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{isCompressingPhoto ? 'Memproses...' : 'Pilih Foto'}</span>
        </button>
      </div>

      {/* 4. Detail Biodata Cards */}
      <div
        className={`p-4 rounded-2xl border space-y-3 transition-colors ${
          isDarkMode ? 'bg-[#111728] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Biodata Akademik
          </span>
          <button
            onClick={() => {
              setFormData({ ...profile });
              setIsEditing(true);
            }}
            className="text-xs text-purple-500 hover:underline font-semibold"
          >
            Ubah
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Nama Lengkap</span>
            <div
              className={`font-semibold mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {profile.fullName || (
                <span className="text-slate-400 italic">Belum diisi (Ketuk Edit Biodata)</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Nama Panggilan</span>
            <div
              className={`font-semibold mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {profile.nickname || '-'}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">NIM (Nomor Induk)</span>
            <div
              className={`font-mono font-bold mt-0.5 ${
                isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              {profile.studentId || '-'}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Program Studi</span>
            <div
              className={`font-semibold mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {profile.major || '-'}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Fakultas</span>
            <div
              className={`font-semibold mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {profile.faculty || '-'}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Universitas</span>
            <div
              className={`font-semibold mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {profile.university || '-'}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Email Mahasiswa</span>
            <div
              className={`font-semibold mt-0.5 flex items-center gap-1.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-purple-500" />
              <span>{profile.email || '-'}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Nomor HP / WhatsApp</span>
            <div
              className={`font-semibold mt-0.5 flex items-center gap-1.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-cyan-500" />
              <span>{profile.phone || '-'}</span>
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Tentang / Bio</span>
            <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {profile.bio}
            </p>
          </div>
        )}
      </div>

      {/* 5. Logout Button */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun EKA SPACE</span>
        </button>
      </div>

      {/* 6. Edit Biodata Modal Form */}
      <AnimatePresence>
        {isEditing && (
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
                <h3 className="font-bold text-sm">Edit Biodata & Foto Mahasiswa</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-purple-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Edit Foto Profil Section */}
                <div
                  className={`p-3.5 rounded-2xl border space-y-3 ${
                    isDarkMode ? 'bg-[#121828] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-purple-500/40 bg-gradient-to-tr from-purple-900 to-slate-900 flex items-center justify-center">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="Preview Foto"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-purple-300" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="font-bold text-xs">Foto Profil Mahasiswa</div>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="modal-avatar-file-upload"
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{isCompressingPhoto ? 'Mengunggah...' : 'Pilih dari HP'}</span>
                        </label>
                        <input
                          id="modal-avatar-file-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleProcessImage(file, false);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />

                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '' }))}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[11px] font-semibold cursor-pointer"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Mendukung galeri atau kamera HP (otomatis dioptimalkan)
                      </div>
                    </div>
                  </div>

                  {/* Preset Avatar Pickers */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-medium mb-1.5">
                      Atau pilih avatar default:
                    </div>
                    <div className="flex items-center gap-2">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: av.url }))}
                          className="flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all cursor-pointer"
                        >
                          <img
                            src={av.url}
                            alt={av.label}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-400/30"
                          />
                          <span className="text-[9px] text-slate-400">{av.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nama Lengkap & Panggilan */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                    Nama Lengkap Mahasiswa *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Masukkan nama lengkap Anda..."
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white placeholder:text-slate-600'
                        : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="Nama panggilan..."
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      NIM (Nomor Induk Mahasiswa)
                    </label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="Contoh: 2106728190"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 font-mono ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Jurusan & Universitas */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Program Studi / Jurusan
                    </label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Contoh: Teknik Informatika"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Universitas / Kampus
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="Nama universitas..."
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Fakultas, Semester & Angkatan */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Fakultas
                    </label>
                    <input
                      type="text"
                      value={formData.faculty}
                      onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                      placeholder="Fasilkom..."
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Semester
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })
                      }
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Angkatan
                    </label>
                    <input
                      type="text"
                      value={formData.batchYear}
                      onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                      placeholder="2024"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Email & Kontak */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@kampus.ac.id"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08123456789"
                      className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 ${
                        isDarkMode
                          ? 'bg-[#121828] border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase mb-1 text-slate-500">
                    Bio / Deskripsi Pribadi
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tuliskan minat, visi perkuliahan, atau catatan singkat..."
                    className={`w-full border rounded-xl p-2.5 outline-none focus:border-purple-500 resize-none ${
                      isDarkMode
                        ? 'bg-[#121828] border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    Simpan Biodata
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

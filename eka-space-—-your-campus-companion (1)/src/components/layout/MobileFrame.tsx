import React, { useState } from 'react';
import { Smartphone, Monitor, DownloadCloud, Sparkles } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeScreenTitle: string;
  onOpenSearch: () => void;
  onOpenAndroidExport: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeScreenTitle,
  onOpenSearch,
  onOpenAndroidExport,
  onOpenSettings,
  isDarkMode,
  onToggleTheme,
}) => {
  const [useDeviceFrame, setUseDeviceFrame] = useState(false);

  return (
    <div
      className={`min-h-[100dvh] w-full transition-colors duration-300 ${
        isDarkMode ? 'bg-[#06090F] text-slate-100' : 'bg-slate-100 text-slate-800'
      } flex flex-col items-center justify-start p-0 select-none`}
    >
      {/* Top Desktop Helper Bar (visible only on md+ screens for convenience) */}
      <header className="hidden md:flex w-full max-w-5xl items-center justify-between py-3 px-4 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white text-sm shadow-md shadow-purple-500/20">
            E
          </div>
          <div>
            <div className="font-bold tracking-tight text-sm flex items-center gap-2">
              <span>EKA SPACE</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                Android 16 Ready · APK
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Your Campus Companion — Siap Instal di Smartphone Xiaomi Redmi 14C
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            onClick={() => setUseDeviceFrame(!useDeviceFrame)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              useDeviceFrame
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Ubah lebar tampilan"
          >
            {useDeviceFrame ? (
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{useDeviceFrame ? 'Mode Layar HP' : 'Tampilan Penuh'}</span>
          </button>

          {/* Android Studio & APK Shortcut */}
          <button
            onClick={onOpenAndroidExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-medium text-xs shadow-sm transition-all"
            title="Download APK / Source Code Android Studio"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Instal di HP & Paket APK</span>
          </button>
        </div>
      </header>

      {/* Main Container: Native mobile layout without fake battery UI */}
      <div
        className={`w-full transition-all duration-300 flex flex-col relative overflow-hidden flex-1 ${
          useDeviceFrame
            ? 'max-w-[430px] min-h-[100dvh] md:min-h-[880px] md:max-h-[92vh] md:rounded-[36px] md:shadow-2xl md:border md:border-slate-800 my-auto'
            : 'max-w-2xl min-h-[100dvh] md:min-h-[90vh] md:rounded-2xl md:border md:border-slate-800 md:my-3 shadow-xl'
        } ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}
      >
        {/* Dynamic Screen Content (Edge-to-edge for real device) */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

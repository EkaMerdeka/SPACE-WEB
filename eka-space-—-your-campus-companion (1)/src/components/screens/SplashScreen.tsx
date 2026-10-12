import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  reducedMotion?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, reducedMotion = false }) => {
  const [phase, setPhase] = useState<'intro' | 'glow' | 'ready'>('intro');

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(onFinish, 800);
      return () => clearTimeout(timer);
    }

    const timer1 = setTimeout(() => setPhase('glow'), 500);
    const timer2 = setTimeout(() => setPhase('ready'), 1100);
    const timer3 = setTimeout(() => onFinish(), 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish, reducedMotion]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-8 bg-[#070B14] overflow-hidden select-none">
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/20 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-cyan-500/15 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-indigo-500/20 blur-[70px] pointer-events-none" />

      {/* Decorative subtle light grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-widest pt-4"
      >
        <span className="flex items-center gap-1.5 text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>REDMI 14C · 8GB</span>
        </span>
        <span className="bg-purple-950/70 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded text-[10px]">
          ANDROID 16
        </span>
      </motion.div>

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center justify-center my-auto relative z-10">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{
            scale: phase === 'glow' || phase === 'ready' ? 1.05 : 1,
            opacity: 1,
            rotate: 0,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          {/* Animated Glow Rings */}
          <AnimatePresence>
            {(phase === 'glow' || phase === 'ready') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 to-cyan-400 blur-xl opacity-60"
              />
            )}
          </AnimatePresence>

          {/* Logo Card */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1C1635] via-[#101935] to-[#0A1224] p-[2px] shadow-2xl shadow-purple-950/80 border border-purple-500/30 flex items-center justify-center relative z-10">
            <div className="w-full h-full rounded-[22px] bg-[#0C101D] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Internal subtle gleam */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl" />

              <span className="text-4xl font-black bg-gradient-to-tr from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent tracking-tighter drop-shadow-md">
                E
              </span>

              {/* Tech dots */}
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title & Tagline with Welcome TO Eka Space animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs font-extrabold tracking-widest uppercase bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-1"
          >
            ★ Welcome TO Eka Space ★
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5 drop-shadow-lg">
            <span>EKA SPACE</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mt-1"
          >
            Your Campus Companion
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-[11px] text-slate-300 max-w-[280px] mx-auto mt-2 leading-relaxed"
          >
            Semua kebutuhan kampus, sertifikat, dokumen, dan coding dalam satu ruang pribadi.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Progress & Skip */}
      <div className="w-full flex flex-col items-center gap-3 pb-2 z-10">
        {/* Animated Progress Bar */}
        <div className="w-36 h-1 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between w-full px-2 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Offline-First Vault</span>
          </span>
          <button
            onClick={onFinish}
            className="text-slate-400 hover:text-white underline transition-colors"
          >
            Lewati →
          </button>
        </div>
      </div>
    </div>
  );
};

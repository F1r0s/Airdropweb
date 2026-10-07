import React from 'react';
import {
  Smartphone,
  Laptop,
  Tablet,
  QrCode,
  FileArchive,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Share2,
  Layers
} from 'lucide-react';
import { PSEOPage } from '../types';

interface PSEOLandingViewProps {
  page: PSEOPage;
  onStartTransfer: () => void;
}

export const PSEOLandingView: React.FC<PSEOLandingViewProps> = ({ page, onStartTransfer }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans px-4 py-6">

      {/* Editorial Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <a href="/" className="hover:text-amber-400">Home</a>
        <span>/</span>
        <span>Cross-Device Stream</span>
        <span>/</span>
        <span className="text-amber-400">{page.fromDevice} to {page.toDevice}</span>
      </div>

      {/* Main Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase">
          <Zap className="w-3.5 h-3.5" />
          <span>Universal Device Bridge (Different or Same Wi-Fi)</span>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-5xl font-light text-white leading-tight">
          {page.h1}
        </h1>

        <p className="text-slate-300 text-base max-w-2xl leading-relaxed font-light">
          {page.metaDescription}
        </p>

        {/* Pairing Matrix */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs text-slate-400 block font-mono">SOURCE DEVICE</span>
              <span className="text-sm font-bold text-white">{page.fromDevice}</span>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-amber-400 hidden sm:block rtl:rotate-180" />

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
            <Laptop className="w-5 h-5 text-sky-400" />
            <div>
              <span className="text-xs text-slate-400 block font-mono">TARGET DEVICE</span>
              <span className="text-sm font-bold text-white">{page.toDevice}</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartTransfer}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-xl shadow-amber-500/15 cursor-pointer active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Start File Transfer Now</span>
          </button>
          <a
            href="/"
            className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-sm font-medium transition-colors"
          >
            Use General AirDrop Web
          </a>
        </div>
      </div>

      {/* Feature & Speed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <h3 className="font-serif-editorial text-lg text-white font-semibold">Zero Compression</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Original RAW photos, 4K 60fps clips, and APK files stream with untouched binary hash checksums.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <h3 className="font-serif-editorial text-lg text-white font-semibold">Works on Any Wi-Fi</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            No need to be on the same local network subnet. Transfers flow through encrypted real-time WebSocket buffers.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <FileArchive className="w-6 h-6 text-sky-400" />
          <h3 className="font-serif-editorial text-lg text-white font-semibold">Full APK & Media Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Easily send .apk installer packages, video files, ZIP bundles, or documents directly to any target screen.
          </p>
        </div>
      </div>

      {/* Dynamic SEO FAQs */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="font-serif-editorial text-xl text-white font-bold">
          How to transfer {page.fileCategory} from {page.fromDevice} to {page.toDevice}?
        </h3>
        <ol className="space-y-3 text-xs text-slate-300 font-light list-decimal list-inside leading-relaxed">
          <li>Open AirDrop Web on your {page.toDevice}.</li>
          <li>Scan the displayed pairing QR code using the camera of your {page.fromDevice} (or type the session room code).</li>
          <li>Choose your {page.fileCategory} on your {page.fromDevice}.</li>
          <li>Watch the files stream live directly onto the {page.toDevice} without cables or app installs.</li>
        </ol>
      </div>

    </div>
  );
};
import React, { useState } from 'react';
import {
  FileTransferItem,
  RoomSessionState,
  SupportedLanguage
} from '../types';
import { formatFileSize, formatSpeed } from '../lib/fileChunker';
import { TRANSLATIONS } from '../lib/translations';
import {
  Camera,
  Video,
  FileArchive,
  Send,
  CheckCircle2,
  Zap,
  Laptop,
  Upload,
  Copy,
  Check,
  Package,
  Layers,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface MobileSenderViewProps {
  roomState: RoomSessionState;
  transfers: FileTransferItem[];
  onSendFile: (file: File) => void;
  onSendText: (text: string) => void;
  onCancelTransfer: (id: string) => void;
  currentLang?: SupportedLanguage;
}

export const MobileSenderView: React.FC<MobileSenderViewProps> = ({
  roomState,
  transfers,
  onSendFile,
  onSendText,
  onCancelTransfer,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'history'>('media');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (roomState.roomId) {
      navigator.clipboard.writeText(roomState.roomId);
      setCopiedCode(true);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (navigator.vibrate) navigator.vibrate([40, 20, 40]);
      Array.from(e.target.files).forEach((file) => {
        onSendFile(file);
      });
      e.target.value = '';
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    if (navigator.vibrate) navigator.vibrate(50);
    onSendText(textInput.trim());
    setTextInput('');
  };

  const activeTransfers = transfers.filter((t) => t.state === 'transferring');
  const completedTransfers = transfers.filter((t) => t.state === 'completed');

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100dvh-5rem)] flex flex-col justify-between p-3.5 space-y-4 font-sans text-slate-100 select-none touch-press">

      {/* 1. COMPACT STICKY CONNECTION BAR */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5 animate-pulse" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-editorial text-sm font-bold text-white">
                {roomState.isPaired ? 'Connected to PC' : 'Searching for PC...'}
              </span>
              <span className={`w-2 h-2 rounded-full ${roomState.isPaired ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
            </div>
            <button
              onClick={handleCopyCode}
              className="text-[11px] text-amber-400 font-mono flex items-center gap-1 mt-0.5 hover:text-amber-300"
            >
              <span>{roomState.roomId}</span>
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold rounded-full uppercase">
            Live
          </span>
        </div>
      </div>

      {/* 2. ACTIVE PROGRESS TOAST (Visible during live streaming) */}
      {activeTransfers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl space-y-2.5 animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 animate-spin text-amber-400" />
              <span>Streaming to PC ({activeTransfers.length})...</span>
            </span>
            <span className="font-mono text-[10px] text-slate-300">
              {formatSpeed(activeTransfers[0].transferSpeed)}
            </span>
          </div>

          {activeTransfers.map((item) => (
            <div key={item.id} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white truncate max-w-[190px]">{item.fileName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{item.progress}%</span>
              </div>

              {/* Enhanced progress bar */}
              <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-100"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{formatFileSize(item.fileSize)}</span>
                <button
                  onClick={() => onCancelTransfer(item.id)}
                  className="text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. MAIN INTERACTIVE CONTENT AREA */}
      <div className="flex-1 space-y-3">
        {activeTab === 'media' && (
          <div className="space-y-3">
            {/* Quick action grid (Oversized touch targets >= 48px) */}
            <div className="grid grid-cols-2 gap-3">

              {/* 📸 Photos & Camera Pick */}
              <label className="cursor-pointer bg-slate-900/90 active:scale-95 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-lg transition-transform touch-press">
                <div className="w-13 h-13 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="leading-tight">
                  <div className="font-serif-editorial text-sm font-bold text-white">{t.sendPhotosRaw}</div>
                  <span className="text-[10px] text-slate-400">RAW, HEIC, PNG</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* 🎥 4K Videos Pick */}
              <label className="cursor-pointer bg-slate-900/90 active:scale-95 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-lg transition-transform touch-press">
                <div className="w-13 h-13 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner">
                  <Video className="w-6 h-6" />
                </div>
                <div className="leading-tight">
                  <div className="font-serif-editorial text-sm font-bold text-white">{t.sendVideos4K}</div>
                  <span className="text-[10px] text-slate-400">4K 60fps, MP4, MOV</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

            </div>

            {/* 📦 Dedicated Android APK Apps Picker Card */}
            <label className="cursor-pointer bg-slate-900/90 active:scale-95 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg transition-transform touch-press">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-left rtl:text-right leading-tight">
                  <div className="font-serif-editorial text-sm font-bold text-white">{t.sendApkApps}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Android APK installers & packages</div>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl shrink-0">
                {t.btnBrowseFiles}
              </span>
              <input
                type="file"
                accept=".apk,application/vnd.android.package-archive,*/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* 📁 Any Document / PDF / ZIP Card */}
            <label className="cursor-pointer bg-slate-900/90 active:scale-95 border-2 border-dashed border-slate-800 hover:border-sky-500/50 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg transition-transform touch-press">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <FileArchive className="w-6 h-6" />
                </div>
                <div className="text-left rtl:text-right leading-tight">
                  <div className="font-serif-editorial text-sm font-bold text-white">{t.sendAnyDocument}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PDFs, Zip archives, Audio, Spreadsheets</div>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shrink-0">
                {t.btnBrowseFiles}
              </span>
              <input
                type="file"
                accept="*/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* 📝 Quick Notes & Links Form */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-serif-editorial text-sm font-bold text-amber-400">
                Direct Clipboard Note or Link
              </span>
              <span className="text-[10px] text-slate-500">Instant PC paste</span>
            </div>

            <textarea
              rows={5}
              placeholder={t.clipboardNotePlaceholder}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
            />

            <button
              type="submit"
              disabled={!textInput.trim()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 active:scale-95 touch-press"
            >
              <Send className="w-4 h-4" />
              <span>{t.streamNoteButton}</span>
            </button>
          </form>
        )}

        {/* 🕒 Completed Transfers History */}
        {activeTab === 'history' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl max-h-72 overflow-y-auto mobile-scroll">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-serif-editorial text-sm font-bold text-white">Transferred to PC</span>
              <span className="text-[10px] font-mono text-amber-400">{completedTransfers.length} items</span>
            </div>

            {completedTransfers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-light">
                No files sent yet in this session.
              </div>
            ) : (
              <div className="space-y-2">
                {completedTransfers.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="truncate max-w-[200px] text-slate-200">{item.fileName}</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. THUMB-FRIENDLY BOTTOM ACTION BAR (Native App Feel) */}
      <div className="sticky bottom-0 z-30 pt-2 pb-1 bg-slate-950/80 backdrop-blur-md">
        <div className="grid grid-cols-3 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold shadow-2xl">
          <button
            onClick={() => {
              setActiveTab('media');
              if (navigator.vibrate) navigator.vibrate(20);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all touch-press ${
              activeTab === 'media'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Media</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('text');
              if (navigator.vibrate) navigator.vibrate(20);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all touch-press ${
              activeTab === 'text'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              if (navigator.vibrate) navigator.vibrate(20);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all touch-press ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </div>

    </div>
  );
};
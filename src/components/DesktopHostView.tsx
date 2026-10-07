import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileTransferItem,
  TextNoteItem,
  RoomSessionState,
  SupportedLanguage
} from '../types';
import { formatFileSize, formatSpeed, formatDuration } from '../lib/fileChunker';
import { FAQSection } from './FAQSection';
import { TRANSLATIONS } from '../lib/translations';
import {
  Download,
  Trash2,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Tablet,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  FileArchive,
  QrCode,
  Zap,
  Eye,
  X,
  Send,
  Feather,
  Share2,
  Bookmark,
  Package,
  UploadCloud,
  HardDrive,
  Filter,
  Search,
  ExternalLink,
  Maximize2
} from 'lucide-react';

interface DesktopHostViewProps {
  roomState: RoomSessionState;
  transfers: FileTransferItem[];
  notes: TextNoteItem[];
  onOpenQR: () => void;
  onJoinRoom?: (code: string) => void;
  onCancelTransfer: (id: string) => void;
  onClearHistory: () => void;
  onSendTextToPhone: (text: string) => void;
  onSendFileToPhone: (file: File) => void;
  onToggleSimulatedPhone: () => void;
  currentLang?: SupportedLanguage;
}

export const DesktopHostView: React.FC<DesktopHostViewProps> = ({
  roomState,
  transfers,
  notes,
  onOpenQR,
  onJoinRoom,
  onCancelTransfer,
  onClearHistory,
  onSendTextToPhone,
  onSendFileToPhone,
  onToggleSimulatedPhone,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [desktopText, setDesktopText] = useState<string>('');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [isDragOverWindow, setIsDragOverWindow] = useState<boolean>(false);
  const [pasteNotification, setPasteNotification] = useState<string | null>(null);
  const [archiveFilter, setArchiveFilter] = useState<'all' | 'media' | 'apk' | 'notes'>('all');
  const [archiveSearch, setArchiveSearch] = useState<string>('');

  const dragCounter = useRef(0);

  // 1. Desktop Full-Window Drag and Drop Listener
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDragOverWindow(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        setIsDragOverWindow(false);
        dragCounter.current = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragOverWindow(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach((file) => {
          onSendFileToPhone(file);
        });
        showPasteToast(`Streaming ${e.dataTransfer.files.length} file(s) to connected device!`);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onSendFileToPhone]);

  // 2. Desktop Global Clipboard Paste Listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't hijack if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.clipboardData) {
        // Files pasted
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
          Array.from(e.clipboardData.files).forEach((file) => {
            onSendFileToPhone(file);
          });
          showPasteToast('Pasted file streamed to paired device!');
          return;
        }

        // Text / URL pasted
        const text = e.clipboardData.getData('text');
        if (text && text.trim()) {
          onSendTextToPhone(text.trim());
          showPasteToast('Pasted clipboard note streamed to paired device!');
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onSendFileToPhone, onSendTextToPhone]);

  // 3. Desktop Escape Key Listener for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const showPasteToast = (msg: string) => {
    setPasteNotification(msg);
    setTimeout(() => setPasteNotification(null), 3000);
  };

  const handleManualJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim() || !onJoinRoom) return;
    onJoinRoom(manualCodeInput.trim());
    setManualCodeInput('');
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleSendTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopText.trim()) return;
    onSendTextToPhone(desktopText.trim());
    setDesktopText('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        onSendFileToPhone(file);
      });
      e.target.value = '';
    }
  };

  const renderFileIcon = (fileType: string, fileName?: string) => {
    if (fileName && fileName.toLowerCase().endsWith('.apk')) {
      return (
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
          <Package className="w-3 h-3" /> APK
        </span>
      );
    }
    if (fileType.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-amber-400" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4 text-purple-400" />;
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4 text-sky-400" />;
    if (fileType.includes('pdf') || fileType.includes('text')) return <FileText className="w-4 h-4 text-emerald-400" />;
    return <FileArchive className="w-4 h-4 text-indigo-400" />;
  };

  const activeTransfers = transfers.filter((t) => t.state === 'transferring');
  const completedTransfers = transfers.filter((t) => t.state === 'completed');

  // Filtered archives
  const filteredCompletedTransfers = completedTransfers.filter((item) => {
    if (archiveFilter === 'media' && !item.fileType.startsWith('image/') && !item.fileType.startsWith('video/')) return false;
    if (archiveFilter === 'apk' && !item.fileName.toLowerCase().endsWith('.apk')) return false;
    if (archiveFilter === 'notes') return false;
    if (archiveSearch && !item.fileName.toLowerCase().includes(archiveSearch.toLowerCase())) return false;
    return true;
  });

  const filteredNotes = notes.filter((n) => {
    if (archiveFilter === 'media' || archiveFilter === 'apk') return false;
    if (archiveSearch && !n.text.toLowerCase().includes(archiveSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 font-sans relative">

      {/* FULL-WINDOW DRAG AND DROP OVERLAY FOR DESKTOP */}
      {isDragOverWindow && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-amber-400/80 p-8 pointer-events-none animate-in fade-in duration-150">
          <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-4 animate-bounce shadow-2xl">
            <UploadCloud className="w-12 h-12" />
          </div>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-white font-bold tracking-tight text-center">
            Drop Files to Stream to Phone & Tablet
          </h2>
          <p className="text-slate-300 text-sm mt-2 font-mono">
            Original RAW quality • Photos, 4K Videos, APKs, Documents
          </p>
        </div>
      )}

      {/* DESKTOP CLIPBOARD PASTE NOTIFICATION TOAST */}
      {pasteNotification && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 bg-slate-900 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-in slide-in-from-bottom-3 duration-200">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{pasteNotification}</span>
        </div>
      )}

      {/* 1. DESKTOP WIDE HERO & PAIRING CONTROL ROOM */}
      {!roomState.isPaired ? (
        <div className="bg-editorial-grid bg-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">

          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Desktop Keyboard Shortcuts Pill */}
          <div className="hidden lg:flex items-center gap-2 absolute top-6 right-8 rtl:right-auto rtl:left-8 text-[11px] font-mono text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            <span>Desktop: Drag & Drop Files Anywhere • Press <kbd className="text-slate-300 bg-slate-800 px-1 rounded">Ctrl+V</kbd> to Paste</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">

              <div className="flex items-center gap-3">
                <span className="font-handwriting text-amber-400 text-lg sm:text-xl tracking-wide italic">
                  {t.heroBadge}
                </span>
                <span className="h-px bg-amber-500/30 w-12 hidden sm:block" />
              </div>

              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.15] tracking-tight">
                {t.heroHeadlinePrefix}
                <span className="italic font-normal text-amber-200">{t.heroHeadlineHighlight}</span>
                {t.heroHeadlineSuffix}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
                {t.heroSubheadline}
              </p>

              {/* Desktop Quick Triggers */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenQR}
                  className="flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm transition-all active:scale-95 shadow-xl shadow-amber-500/15 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t.btnPairQr}</span>
                </button>

                <button
                  onClick={onToggleSimulatedPhone}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-5 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>{t.btnSimulatePhone}</span>
                </button>
              </div>

              {/* Quality & Speed Matrix */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <div>
                  <div className="font-serif-editorial text-white text-sm font-semibold italic">100% Raw Quality</div>
                  <div className="text-[11px] text-slate-400">Zero image compression</div>
                </div>
                <div>
                  <div className="font-serif-editorial text-white text-sm font-semibold italic">WebSocket Relay</div>
                  <div className="text-[11px] text-slate-400">Works across different Wi-Fi</div>
                </div>
                <div>
                  <div className="font-serif-editorial text-white text-sm font-semibold italic">APK & 4K Ready</div>
                  <div className="text-[11px] text-slate-400">Apps, videos & documents</div>
                </div>
              </div>

            </div>

            {/* Desktop Pairing Card & Code Input */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 w-full">
              <div
                onClick={onOpenQR}
                className="cursor-pointer group bg-slate-900/90 hover:bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all text-center w-full max-w-sm shadow-2xl relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase">
                  {t.pairingKey}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto my-3 group-hover:scale-105 transition-transform">
                  <QrCode className="w-8 h-8" />
                </div>

                <div className="font-serif-editorial text-white text-lg font-semibold italic">
                  Click to Expand QR
                </div>
                <div className="text-xs text-slate-400 mt-1 font-sans">
                  Session: <code className="text-amber-400 font-mono font-bold">{roomState.roomId}</code>
                </div>

                <div className="mt-4 text-[11px] font-handwriting text-amber-400/90 text-center">
                  ~ Scan with Camera on iPhone, iPad, or Android ~
                </div>
              </div>

              {/* Manual Session Join Card */}
              {onJoinRoom && (
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl w-full max-w-sm text-center">
                  <div className="text-xs font-serif-editorial text-slate-200 italic mb-1">
                    {t.enterSessionCode}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 font-light">
                    {t.enterSessionDesc}
                  </p>
                  <form onSubmit={handleManualJoinSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. room-vuxao8"
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                    >
                      {t.connectButton}
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* DESKTOP PAIRED CONTROL BAR */
        <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-lg text-white font-bold">
                  {roomState.devices.filter(d => d.role !== 'desktop').map(d => d.deviceName).join(', ') || 'Phone / Tablet'} Linked
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded-full uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Drag any file into this browser window, or type a note below to send to your device
              </p>
            </div>
          </div>

          {/* Desktop Reverse Transmitter (PC to Phone/Tablet) */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <form onSubmit={handleSendTextSubmit} className="flex items-center gap-2 w-full md:w-80">
              <input
                type="text"
                placeholder="Type note or URL to send to phone..."
                value={desktopText}
                onChange={(e) => setDesktopText(e.target.value)}
                className="bg-slate-950 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 w-full focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                title="Send note to device"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <label className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Send File</span>
              <input type="file" multiple onChange={handleFileInputChange} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* 2. ACTIVE STREAMING PROGRESS (PC Live Dashboard) */}
      {activeTransfers.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400 tracking-wider">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-spin text-amber-400" />
              <span>{t.incomingStream} ({activeTransfers.length})</span>
            </span>
          </div>

          <div className="space-y-3">
            {activeTransfers.map((item) => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-medium text-white truncate">
                    {renderFileIcon(item.fileType, item.fileName)}
                    <span className="truncate">{item.fileName}</span>
                  </div>
                  <div className="text-slate-400 shrink-0 font-mono text-[11px]">
                    {formatFileSize(item.fileSize)} • {formatSpeed(item.transferSpeed)}
                  </div>
                </div>

                <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-150 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.progress}% Streamed ({item.senderName})</span>
                  <div className="flex items-center gap-3">
                    {item.timeRemaining > 0 && <span>ETA: ~{formatDuration(item.timeRemaining)}</span>}
                    <button
                      onClick={() => onCancelTransfer(item.id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DESKTOP CRAFT ARCHIVE FEED & SEARCH WORKSPACE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">

        {/* Header & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h2 className="font-serif-editorial text-2xl font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <span>{t.receivedArchiveTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-light">
              {t.receivedArchiveSub}
            </p>
          </div>

          {/* Desktop Search & Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-2.5" />
              <input
                type="text"
                placeholder="Search archive..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 rtl:pl-3 rtl:pr-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setArchiveFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${archiveFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setArchiveFilter('media')}
                className={`px-3 py-1 rounded-lg transition-colors ${archiveFilter === 'media' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Media
              </button>
              <button
                onClick={() => setArchiveFilter('apk')}
                className={`px-3 py-1 rounded-lg transition-colors ${archiveFilter === 'apk' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                APKs
              </button>
              <button
                onClick={() => setArchiveFilter('notes')}
                className={`px-3 py-1 rounded-lg transition-colors ${archiveFilter === 'notes' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Notes
              </button>
            </div>

            {(completedTransfers.length > 0 || notes.length > 0) && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 rounded-xl transition-colors border border-slate-700/60 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearFeed}</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredCompletedTransfers.length === 0 && filteredNotes.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-amber-400/60">
              <Feather className="w-8 h-8" />
            </div>
            <p className="font-serif-editorial text-lg text-slate-300 italic font-light">
              {t.emptyDeskTitle}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
              {t.emptyDeskDesc}
            </p>
          </div>
        ) : (
          /* Archive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* TEXT NOTES */}
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                    <span className="font-serif-editorial text-amber-400 italic text-sm flex items-center gap-1.5 font-bold">
                      <FileText className="w-3.5 h-3.5" /> Note
                    </span>
                    <span className="text-[10px] font-mono">{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap break-words max-h-44 overflow-y-auto border border-slate-800/80 leading-relaxed select-text">
                    {note.text}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500 text-[11px] font-mono">From {note.senderName}</span>
                  <button
                    onClick={() => handleCopyNote(note.id, note.text)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copiedNoteId === note.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* FILE TRANSFERS */}
            {filteredCompletedTransfers.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2 font-medium text-slate-200 truncate pr-2">
                      {renderFileIcon(item.fileType, item.fileName)}
                      <span className="truncate font-sans text-xs" title={item.fileName}>{item.fileName}</span>
                    </div>
                    <span className="text-[10px] shrink-0 font-mono text-slate-400">{formatFileSize(item.fileSize)}</span>
                  </div>

                  {/* Image Card Preview with Lightbox Trigger */}
                  {item.fileType.startsWith('image/') && item.blobUrl && (
                    <div
                      className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 aspect-video group cursor-pointer"
                      onClick={() => setSelectedImage(item.blobUrl)}
                    >
                      <img src={item.blobUrl} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                        <Eye className="w-4 h-4 text-amber-400" /> Full Resolution Lightbox
                      </div>
                    </div>
                  )}

                  {/* Video Player Card */}
                  {item.fileType.startsWith('video/') && item.blobUrl && (
                    <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 aspect-video">
                      <video src={item.blobUrl} controls className="w-full h-full object-contain" />
                    </div>
                  )}

                  {/* Audio Player Card */}
                  {item.fileType.startsWith('audio/') && item.blobUrl && (
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      <audio src={item.blobUrl} controls className="w-full h-8" />
                    </div>
                  )}

                  {/* APK Package Card */}
                  {item.fileName.toLowerCase().endsWith('.apk') && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                        APK
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-semibold text-emerald-300 block">Android Application Package</span>
                        <span className="text-[10px] text-slate-400 font-mono">Ready to install on Android</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Save Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {item.blobUrl && (
                    <a
                      href={item.blobUrl}
                      download={item.fileName}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.btnSaveFile}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* SEO & CROSS-PLATFORM TRANSFER GUIDE */}
      <FAQSection onOpenQR={onOpenQR} onJoinRoom={onJoinRoom} currentLang={currentLang} />

      {/* FULL-SCREEN IMAGE LIGHTBOX MODAL (Escape to close) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Full Resolution" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-800" />
          </div>
        </div>
      )}

    </div>
  );
};
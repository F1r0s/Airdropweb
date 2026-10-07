import React, { useState } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  Info,
  QrCode,
  Box,
  RefreshCw,
  LogIn,
  Home,
  HelpCircle,
  Globe,
  Shield,
  Laptop
} from 'lucide-react';
import { RoomSessionState, SupportedLanguage } from '../types';
import { TRANSLATIONS, isRTL } from '../lib/translations';

interface HeaderProps {
  roomState: RoomSessionState;
  onOpenQR: () => void;
  onNewSession?: () => void;
  onJoinRoom?: (code: string) => void;
  onGoHome?: () => void;
  onOpenArchitecture: () => void;
  onToggleSimulatedPhone: () => void;
  isSimulatedPhoneOpen: boolean;
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  activeTransferSpeed?: number;
}

export const Header: React.FC<HeaderProps> = ({
  roomState,
  onOpenQR,
  onNewSession,
  onJoinRoom,
  onGoHome,
  onOpenArchitecture,
  onToggleSimulatedPhone,
  isSimulatedPhoneOpen,
  currentLang = 'en',
  onLanguageChange
}) => {
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [isJoinInputOpen, setIsJoinInputOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLang];
  const guestDevices = roomState.devices.filter(d => d.role !== 'desktop');

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomState.roomId);
    setCopiedRoom(true);
    setTimeout(() => setCopiedRoom(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || !onJoinRoom) return;
    onJoinRoom(joinCodeInput.trim());
    setJoinCodeInput('');
    setIsJoinInputOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/70 px-4 lg:px-8 py-3.5 transition-all font-sans relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

        {/* Brand Logo & Device Status Pill */}
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            title="Return to Drop Box Home"
            className="flex items-center gap-3 group text-left rtl:text-right focus:outline-none cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/5 group-hover:border-amber-400/60 group-hover:shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Box className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-2xl text-white tracking-tight group-hover:text-amber-100 transition-colors">
                  Drop <span className="text-amber-400 font-black">Box</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono uppercase tracking-wider font-semibold hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-wide">
                Cross-device files, 4K videos & APK bridge
              </p>
            </div>
          </button>

          {/* Connected Peers Indicator Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-xs font-sans">
            {roomState.isPaired ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-medium">
                  Linked: {guestDevices.map(d => d.deviceName).join(', ') || 'Phone / Tablet'}
                </span>
              </>
            ) : roomState.isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-300 font-medium">{t.awaitingScan}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-rose-400">Connecting relay...</span>
              </>
            )}
          </div>
        </div>

        {/* Desktop Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {/* Active Session Pill */}
          {roomState.roomId && (
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider hidden xs:inline">{t.sessionCodeLabel}</span>
              <span className="font-bold text-amber-400">{roomState.roomId}</span>
              <button
                onClick={handleCopyRoomId}
                title="Copy Session ID"
                className="ml-0.5 p-1 hover:text-white text-slate-400 transition-colors rounded-md hover:bg-slate-800 cursor-pointer"
              >
                {copiedRoom ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onNewSession && (
                <button
                  onClick={onNewSession}
                  title="Generate New Room QR"
                  className="p-1 hover:text-amber-400 text-slate-400 transition-colors rounded-md hover:bg-slate-800 ml-0.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Home button */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              title="Return to Home View"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.btnHome}</span>
            </button>
          )}

          {/* Join Code trigger */}
          {onJoinRoom && (
            <button
              onClick={() => setIsJoinInputOpen((prev) => !prev)}
              title="Enter code to pair device"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.btnJoinCode}</span>
            </button>
          )}

          {/* Pair QR Modal Trigger */}
          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Pair QR</span>
          </button>

          {/* Test Phone Simulation Drawer button */}
          <button
            onClick={onToggleSimulatedPhone}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isSimulatedPhoneOpen
                ? 'bg-slate-800 text-amber-400 border-amber-500/40 shadow-inner'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">{t.btnSimulatePhone}</span>
          </button>

          {/* Architecture Blueprint Trigger */}
          <button
            onClick={onOpenArchitecture}
            title="System Blueprint Docs"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Multi-Language Selector Dropdown (EN, ES, FR, PT, AR) */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              title="Switch Language"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-amber-400 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{currentLang}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 z-50 w-44 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl space-y-1 animate-in fade-in duration-100">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                  { code: 'pt', label: 'Português' },
                  { code: 'ar', label: 'العربية (RTL)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      if (onLanguageChange) onLanguageChange(item.code as SupportedLanguage);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${currentLang === item.code
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                      }`}
                  >
                    <span>{item.label}</span>
                    {currentLang === item.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Secure Admin Panel Shortcut */}
          <a
            href="/secretadmin2026"
            title="Secret Admin Panel"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 rounded-xl transition-all"
          >
            <Shield className="w-4 h-4" />
          </a>

        </div>
      </div>

      {/* Manual Join Code Popover */}
      {isJoinInputOpen && (
        <div className="absolute top-full right-4 lg:right-8 rtl:right-auto rtl:left-4 lg:rtl:left-8 mt-2 z-50 w-80 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleJoinSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif-editorial text-sm font-bold text-white">{t.enterSessionCode}</span>
              <button
                type="button"
                onClick={() => setIsJoinInputOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {t.enterSessionDesc}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. room-vuxao8"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
                autoFocus
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                {t.connectButton}
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};
import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DesktopHostView } from './components/DesktopHostView';
import { MobileSenderView } from './components/MobileSenderView';
import { QRCodeModal } from './components/QRCodeModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SimulatedMobileDrawer } from './components/SimulatedMobileDrawer';
import { socketManager } from './lib/socketClient';
import {
  DeviceInfo,
  FileTransferItem,
  RoomSessionState,
  TextNoteItem,
  SupportedLanguage,
  PSEOPage
} from './types';
import { TRANSLATIONS, isRTL } from './lib/translations';
import { AdminPanel } from './components/AdminPanel';
import { PSEOLandingView } from './components/PSEOLandingView';

export default function App() {
  // Check if current route is admin panel (/secretadmin2026)
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath.startsWith('/secretadmin2026') || window.location.search.includes('admin=true');

  // Multi-language URL routing parser (/en, /es, /fr, /pt, /ar)
  const supportedLangs: SupportedLanguage[] = ['en', 'es', 'fr', 'pt', 'ar'];
  const pathSegments = currentPath.split('/').filter(Boolean);
  const langFromUrl = pathSegments.length > 0 && supportedLangs.includes(pathSegments[0] as SupportedLanguage)
    ? (pathSegments[0] as SupportedLanguage)
    : null;

  // Normalized path without language prefix for sub-routes like /pseo/:slug
  const normalizedPath = langFromUrl
    ? '/' + pathSegments.slice(1).join('/')
    : currentPath;

  // Check if current route is a programmatic SEO page (/pseo/:slug)
  const isPseoRoute = normalizedPath.startsWith('/pseo/');
  const pseoSlug = isPseoRoute ? normalizedPath.replace('/pseo/', '').replace(/\/$/, '') : '';
  const [pseoPageData, setPseoPageData] = useState<PSEOPage | null>(null);

  // Multi-language state synchronized with URL prefix
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    if (langFromUrl) return langFromUrl;
    const saved = localStorage.getItem('airdrop_lang') as SupportedLanguage;
    if (saved && supportedLangs.includes(saved)) return saved;
    const navLang = navigator.language ? navigator.language.slice(0, 2).toLowerCase() : 'en';
    return supportedLangs.includes(navLang as SupportedLanguage) ? (navLang as SupportedLanguage) : 'en';
  });

  // Handle language switch with clean history pushState (/en, /es, /fr, /pt, /ar)
  const handleLanguageChange = useCallback((newLang: SupportedLanguage) => {
    setCurrentLang(newLang);
    localStorage.setItem('airdrop_lang', newLang);

    const search = window.location.search;
    const hash = window.location.hash;
    const targetBase = newLang === 'en' ? (normalizedPath === '/' ? '/' : normalizedPath) : `/${newLang}${normalizedPath === '/' ? '' : normalizedPath}`;
    window.history.pushState({}, '', `${targetBase}${search}${hash}`);
  }, [normalizedPath]);

  // Synchronize language state if user clicks browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      if (segments.length > 0 && supportedLangs.includes(segments[0] as SupportedLanguage)) {
        setCurrentLang(segments[0] as SupportedLanguage);
      } else {
        setCurrentLang('en');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Apply RTL and Arabic Cairo font to document body
  useEffect(() => {
    const rtl = isRTL(currentLang);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    if (rtl) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
    localStorage.setItem('airdrop_lang', currentLang);

    // Sync live translations from server
    fetch('/api/translations')
      .then(res => res.ok ? res.json() : null)
      .then(liveDict => {
        if (liveDict && liveDict[currentLang]) {
          Object.assign(TRANSLATIONS[currentLang], liveDict[currentLang]);
        }
      })
      .catch(() => { });
  }, [currentLang]);

  // Load pSEO data if on pSEO page
  useEffect(() => {
    if (isPseoRoute && pseoSlug) {
      fetch(`/api/pseo/${pseoSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setPseoPageData(data);
            document.title = data.title;
          }
        })
        .catch(err => console.error('Error fetching pSEO page:', err));
    }
  }, [isPseoRoute, pseoSlug]);

  // Device detection helper
  const detectDeviceName = (): string => {
    const ua = navigator.userAgent;
    if (/iPad/i.test(ua)) return 'iPad Tablet';
    if (/tablet|android(?!.*mobile)/i.test(ua)) return 'Android Tablet';
    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/Android.*mobile/i.test(ua)) return 'Android Phone';
    if (/Macintosh/i.test(ua)) return 'Mac Desktop';
    if (/Windows/i.test(ua)) return 'Windows PC';
    return 'Web Device';
  };

  // Parse URL search parameters for room ID
  const urlParams = new URLSearchParams(window.location.search);
  const initialRoomId = urlParams.get('room');
  const isMobileRoleFromUrl = Boolean(initialRoomId);

  // Room & Connection state
  const [roomState, setRoomState] = useState<RoomSessionState>({
    roomId: initialRoomId || '',
    pairUrl: '',
    isPaired: false,
    myRole: isMobileRoleFromUrl ? 'mobile' : 'desktop',
    myDeviceName: isMobileRoleFromUrl
      ? (navigator.userAgent.includes('iPhone') ? 'iPhone' : navigator.userAgent.includes('Android') ? 'Android Phone' : 'Smartphone')
      : 'Desktop PC',
    devices: [],
    isConnected: false,
  });

  // Data lists
  const [transfers, setTransfers] = useState<FileTransferItem[]>([]);
  const [notes, setNotes] = useState<TextNoteItem[]>([]);

  // Modals state
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isSimulatedPhoneOpen, setIsSimulatedPhoneOpen] = useState<boolean>(false);

  // Initialize Socket session
  useEffect(() => {
    // Generate room ID if desktop
    const sessionRoomId = initialRoomId || `room-${Math.random().toString(36).substring(2, 8)}`;
    const origin = window.location.origin;
    const path = window.location.pathname;

    // Use actual origin for mobile pairing URL
    const pairUrl = `${origin}${path}?room=${sessionRoomId}`;

    setRoomState((prev) => ({
      ...prev,
      roomId: sessionRoomId,
      pairUrl
    }));

    // Setup socket handlers
    socketManager.onConnectionChange = (isConnected) => {
      setRoomState((prev) => ({ ...prev, isConnected }));
    };

    socketManager.onRoomJoined = (data) => {
      const isPaired = data.devices.length >= 2;
      setRoomState((prev) => ({
        ...prev,
        roomId: data.roomId,
        isPaired,
        devices: data.devices
      }));
    };

    socketManager.onPeerJoined = (peer, devices) => {
      setRoomState((prev) => ({
        ...prev,
        isPaired: devices.length >= 2,
        devices
      }));

      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    };

    socketManager.onPeerLeft = (peer, devices) => {
      setRoomState((prev) => ({
        ...prev,
        isPaired: devices.length >= 2,
        devices
      }));
    };

    socketManager.onTextReceived = (note) => {
      setNotes((prev) => [note, ...prev]);
    };

    socketManager.onTransferStarted = (item) => {
      setTransfers((prev) => {
        const exists = prev.find((t) => t.id === item.id);
        if (exists) return prev;
        return [item, ...prev];
      });
    };

    socketManager.onTransferProgress = (item) => {
      setTransfers((prev) =>
        prev.map((t) => (t.id === item.id ? item : t))
      );
    };

    socketManager.onTransferCompleted = (item) => {
      setTransfers((prev) =>
        prev.map((t) => (t.id === item.id ? item : t))
      );

      // Play subtle notification or vibration
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    };

    // Connect to room
    if (isMobileRoleFromUrl && initialRoomId) {
      socketManager.joinRoom(initialRoomId, roomState.myDeviceName, 'mobile', 'mobile');
    } else {
      socketManager.createRoom(sessionRoomId, 'Desktop PC', 'desktop');
    }

    return () => {
      socketManager.disconnect();
    };
  }, []);

  // Send File Handler
  const handleSendFile = useCallback(async (file: File) => {
    try {
      await socketManager.sendFile(
        file,
        roomState.myDeviceName,
        (progressItem) => {
          setTransfers((prev) => {
            const index = prev.findIndex((t) => t.id === progressItem.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = progressItem;
              return updated;
            }
            return [progressItem, ...prev];
          });
        }
      );
    } catch (err) {
      console.error('File send error:', err);
    }
  }, [roomState.myDeviceName]);

  // Send Text Handler
  const handleSendText = useCallback((text: string) => {
    socketManager.sendText(text, roomState.myDeviceName);
  }, [roomState.myDeviceName]);

  // Cancel Transfer Handler
  const handleCancelTransfer = useCallback((transferId: string) => {
    socketManager.cancelTransfer(transferId);
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, state: 'canceled' } : t))
    );
  }, []);

  // Clear History
  const handleClearHistory = useCallback(() => {
    setTransfers([]);
    setNotes([]);
  }, []);

  // Generate New Session QR Code Handler
  const handleNewSession = useCallback(() => {
    const newRoomId = `room-${Math.random().toString(36).substring(2, 8)}`;
    const origin = window.location.origin;
    const path = window.location.pathname;
    const pairUrl = `${origin}${path}?room=${newRoomId}`;

    socketManager.joinRoom(newRoomId, roomState.myDeviceName, 'desktop');

    // Reset URL to clean path without room param for new desktop session
    window.history.replaceState({}, '', path);

    setRoomState((prev) => ({
      ...prev,
      roomId: newRoomId,
      pairUrl,
      myRole: 'desktop',
      isPaired: false,
      devices: prev.devices.filter((d) => d.role === 'desktop')
    }));

    setIsQROpen(true);
  }, [roomState.myDeviceName]);

  // Manual Join Room Handler
  const handleJoinRoom = useCallback((enteredCode: string) => {
    let cleanedCode = enteredCode.trim();
    if (!cleanedCode) return;
    if (!cleanedCode.startsWith('room-')) {
      cleanedCode = `room-${cleanedCode}`;
    }

    const origin = window.location.origin;
    const path = window.location.pathname;
    const pairUrl = `${origin}${path}?room=${cleanedCode}`;

    // Join target room as mobile sender
    socketManager.joinRoom(cleanedCode, roomState.myDeviceName, 'mobile');

    // Update browser URL query string
    window.history.replaceState({}, '', `${path}?room=${cleanedCode}`);

    setRoomState((prev) => ({
      ...prev,
      roomId: cleanedCode,
      pairUrl,
      myRole: 'mobile',
    }));

    setIsQROpen(false);
  }, [roomState.myDeviceName]);

  // Go Home Handler
  const handleGoHome = useCallback(() => {
    // If already in desktop view, just scroll to top without resetting the room session
    if (roomState.myRole === 'desktop') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const origin = window.location.origin;
    const homePath = currentLang === 'en' ? '/' : `/${currentLang}`;
    window.history.replaceState({}, '', homePath);

    const freshRoomId = `room-${Math.random().toString(36).substring(2, 8)}`;
    const pairUrl = `${origin}${homePath}?room=${freshRoomId}`;

    socketManager.joinRoom(freshRoomId, roomState.myDeviceName, 'desktop');

    setRoomState((prev) => ({
      ...prev,
      roomId: freshRoomId,
      pairUrl,
      myRole: 'desktop',
      isPaired: false,
      devices: [{ id: 'desktop-host', name: prev.myDeviceName, role: 'desktop', joinedAt: Date.now() }]
    }));

    setIsQROpen(false);
    setIsArchitectureOpen(false);
    setIsSimulatedPhoneOpen(false);
  }, [roomState.myRole, roomState.myDeviceName]);

  // If route is /secretadmin2026, render Secure Admin Panel directly
  if (isAdminRoute) {
    return <AdminPanel onClose={() => { window.location.href = '/'; }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">

      {/* Navigation Header */}
      <Header
        roomState={roomState}
        onOpenQR={() => setIsQROpen(true)}
        onNewSession={handleNewSession}
        onJoinRoom={handleJoinRoom}
        onGoHome={handleGoHome}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onToggleSimulatedPhone={() => setIsSimulatedPhoneOpen((prev) => !prev)}
        isSimulatedPhoneOpen={isSimulatedPhoneOpen}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {isPseoRoute && pseoPageData ? (
          <PSEOLandingView
            page={pseoPageData}
            onStartTransfer={() => {
              window.history.pushState({}, '', '/');
              setIsQROpen(true);
            }}
          />
        ) : roomState.myRole === 'mobile' ? (
          /* Mobile View (when scanned on smartphone) */
          <MobileSenderView
            roomState={roomState}
            transfers={transfers}
            onSendFile={handleSendFile}
            onSendText={handleSendText}
            onCancelTransfer={handleCancelTransfer}
            currentLang={currentLang}
          />
        ) : (
          /* Desktop Host View */
          <DesktopHostView
            roomState={roomState}
            transfers={transfers}
            notes={notes}
            onOpenQR={() => setIsQROpen(true)}
            onJoinRoom={handleJoinRoom}
            onCancelTransfer={handleCancelTransfer}
            onClearHistory={handleClearHistory}
            onSendTextToPhone={handleSendText}
            onSendFileToPhone={handleSendFile}
            onToggleSimulatedPhone={() => setIsSimulatedPhoneOpen((prev) => !prev)}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/90 py-5 px-6 text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-slate-200 text-sm tracking-tight">
              Drop <span className="text-amber-400 font-black">Box</span>
            </span>
            <span className="text-[11px] text-slate-500 font-light">
              — Free cross-platform online AirDrop alternative (Android, iPhone, Windows, Mac, Chrome)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const faqElem = document.getElementById('faq-section');
                if (faqElem) faqElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-amber-400 transition-colors text-xs font-medium"
            >
              AirDrop Online FAQ
            </button>
            <span className="text-slate-800">•</span>
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-medium hover:underline text-xs flex items-center gap-1"
            >
              <span>Architecture & Blueprint Specs</span>
            </button>
          </div>
        </div>
      </footer>

      {/* QR Code Pairing Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        pairUrl={roomState.pairUrl}
        roomId={roomState.roomId}
        isPaired={roomState.isPaired}
        currentLang={currentLang}
      />

      {/* Architecture Specs Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Simulated Mobile Drawer (for desktop testing) */}
      <SimulatedMobileDrawer
        isOpen={isSimulatedPhoneOpen}
        onClose={() => setIsSimulatedPhoneOpen(false)}
        roomState={roomState}
        transfers={transfers}
        onSendFile={handleSendFile}
        onSendText={handleSendText}
        onCancelTransfer={handleCancelTransfer}
        currentLang={currentLang}
      />

    </div>
  );
}

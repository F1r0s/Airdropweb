import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Laptop,
  QrCode,
  Link,
  Copy,
  Zap,
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
  Share2,
  FileCheck,
  Layers
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'general' | 'cross-platform' | 'connection-methods' | 'windows-chrome';
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'what-is-airdrop-online',
    category: 'general',
    question: 'What is AirDrop Online and how does this online airdrop free tool work?',
    keywords: ['airdrop online', 'online airdrop', 'airdrop online free', 'airdrop files free online'],
    answer: `AirDrop Online is a web-based, zero-installation cross-device file transfer system that acts as an AirDrop alternative online. It allows you to stream original 4K videos, uncompressed RAW photos, PDFs, ZIP archives, and text notes between any smartphone and computer directly in your browser. No apps, accounts, or software downloads are required.`
  },
  {
    id: 'airdrop-iphone-to-android',
    category: 'cross-platform',
    question: 'Can I use AirDrop iPhone to Android online and Android to iPhone?',
    keywords: ['airdrop iphone to android online', 'airdrop android online', 'airdrop alternative online'],
    answer: `Yes! While Apple's native AirDrop is locked to iOS/Mac devices, AirDrop Web provides seamless cross-platform file transfer between Android and iPhone. You can transfer files, photos, and videos from Android to iPhone or iPhone to Android instantly in any web browser.`
  },
  {
    id: 'airdrop-pc-to-iphone',
    category: 'cross-platform',
    question: 'How do I do AirDrop PC to iPhone online or transfer files from Windows to iOS?',
    keywords: ['airdrop pc to iphone online', 'airdrop online windows', 'airdrop online chrome'],
    answer: `To transfer files from PC to iPhone online, simply open AirDrop Web on your Windows PC browser (Chrome, Edge, Brave, etc.), then connect your iPhone by scanning the session QR code, typing the room code, or opening the direct session link. You can drag and drop any file from your PC directly to your iPhone without iCloud.`
  },
  {
    id: 'connection-methods',
    category: 'connection-methods',
    question: 'What are the 3 ways to pair devices (QR Code, Room Code, and Direct Link)?',
    keywords: ['airdrop online', 'airdrop files free online'],
    answer: `AirDrop Web supports 3 easy connection methods for instant pairing:
1. Scan QR Code: Open your iPhone or Android camera app and scan the QR code displayed on the host screen.
2. Type or Copy Room Code: Copy the unique session code (e.g. "room-vuxao8") and enter it into the "Join Code" box on any device.
3. Direct Room Link: Copy the exact web link (URL) and paste it into any browser on phone, tablet, or PC to join the room immediately.`
  },
  {
    id: 'android-to-pc-transfer',
    category: 'cross-platform',
    question: 'How to stream files from Android to PC / Windows online?',
    keywords: ['airdrop android online', 'airdrop online windows', 'airdrop alternative online'],
    answer: `Open AirDrop Web on your Windows PC or laptop, scan the on-screen QR code using your Android camera or QR scanner, and select any full-resolution photo or video on your Android phone. Files are streamed using encrypted WebSocket binary chunking directly into your PC download folder with zero quality loss.`
  },
  {
    id: 'airdrop-online-chrome-windows',
    category: 'windows-chrome',
    question: 'Does AirDrop Online work on Chrome, Windows, Mac, and Linux?',
    keywords: ['airdrop online chrome', 'airdrop online windows', 'airdrop online free'],
    answer: `Yes, AirDrop Web is engineered specifically for modern browsers including Google Chrome, Safari, Microsoft Edge, Mozilla Firefox, and Opera on Windows 11/10, macOS, Linux, Android, and iOS. It requires no extensions or plugins.`
  },
  {
    id: 'file-size-limits-compression',
    category: 'general',
    question: 'Are there file size limits or quality compression during transfer?',
    keywords: ['airdrop files free online', 'airdrop alternative online'],
    answer: `AirDrop Web provides zero compression for all media. Your 4K videos, ProRAW photographs, and large documents retain 100% of their original bitrates and metadata. Streams are processed in real-time binary chunks for high throughput.`
  },
  {
    id: 'security-privacy',
    category: 'general',
    question: 'Is my data secure and private during online airdrop transfers?',
    keywords: ['online airdrop', 'airdrop online free'],
    answer: `Absolutely. Your files and notes are transmitted directly through ephemeral peer sessions in your browser memory. Files are never stored on permanent database servers, ensuring maximum privacy and instant session cleanup when you close the tab.`
  }
];

interface FAQSectionProps {
  onOpenQR?: () => void;
  onJoinRoom?: (code: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenQR, onJoinRoom }) => {
  const [openId, setOpenId] = useState<string | null>('what-is-airdrop-online');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFAQs = activeCategory === 'all' 
    ? FAQ_DATA 
    : FAQ_DATA.filter((item) => item.category === activeCategory);

  // Schema.org FAQPage JSON-LD Structured Data for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ_DATA.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  return (
    <section id="faq-section" className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden font-sans space-y-8 my-10">
      
      {/* Inject JSON-LD structured data for Google & Bing search engine crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="space-y-3 text-center sm:text-left relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions & SEO Guide</span>
        </div>

        <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-tight">
          AirDrop Online <span className="italic text-amber-300 font-normal">Cross-Platform</span> Transfer Guide
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
          Everything you need to know about using this free <strong className="text-amber-200 font-normal">airdrop alternative online</strong> to stream files, 4K videos, RAW photos, and clipboard notes between <strong className="text-white font-normal">Android, iPhone, Windows PC, Mac, and Chrome</strong>.
        </p>
      </div>

      {/* Cross-Platform Device Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        
        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Android ➔ iPhone</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Android to iPhone Online</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Send photos and files directly from Samsung or Pixel to iOS devices with zero app install.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">iPhone ➔ Android</span>
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">iPhone to Android Online</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            AirDrop files from iOS Safari browser straight to any Android smartphone or tablet.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Android ➔ PC</span>
            <Laptop className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Android to PC / Windows</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Stream full 4K video clips and documents from phone to Windows 11 Chrome browser.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">PC ➔ iPhone</span>
            <Laptop className="w-4 h-4 text-sky-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">AirDrop PC to iPhone</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Drag and drop files from Windows or Mac PC directly to iPhone browser without iTunes.
          </p>
        </div>

      </div>

      {/* 3 Easy Pairing Methods Explanation Banner */}
      <div className="bg-slate-950/90 border border-amber-500/30 p-5 sm:p-6 rounded-2xl space-y-4 relative z-10">
        <h3 className="font-serif-editorial text-lg text-amber-200 italic flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          3 Fast Ways to Connect & Share Room Session
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <QrCode className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block mb-0.5">1. Scan QR Code</strong>
              <span>Scan on-screen QR code with iPhone or Android camera app to open room automatically.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Copy className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block mb-0.5">2. Copy / Type Room Code</strong>
              <span>Enter session code (e.g., <code className="text-amber-400 font-mono">room-vuxao8</code>) into Join Code on target device.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Link className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block mb-0.5">3. Direct Session Link</strong>
              <span>Copy and send direct session URL link to open in any web browser instantly.</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 theme-scrollbar border-b border-slate-800/80 relative z-10">
        {[
          { id: 'all', label: 'All Questions' },
          { id: 'general', label: 'General & Free' },
          { id: 'cross-platform', label: 'Android & iPhone' },
          { id: 'connection-methods', label: 'Pairing Methods' },
          { id: 'windows-chrome', label: 'Windows & Chrome' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/10'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3 relative z-10 min-h-[400px]">
        {filteredFAQs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors focus:outline-none"
              >
                <span className="font-medium text-sm sm:text-base text-slate-100 leading-snug">
                  {faq.question}
                </span>
                <span className="p-1.5 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 pt-3 sm:px-5 border-t border-slate-800/50 text-slate-300 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Call To Action within FAQ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero compression • Browser-to-browser encrypted streaming • No account required</span>
        </div>

        {onOpenQR && (
          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/10"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Pairing QR Code Now</span>
          </button>
        )}
      </div>

    </section>
  );
};

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode, ShieldCheck, Feather } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairUrl: string;
  roomId: string;
  isPaired: boolean;
  currentLang?: SupportedLanguage;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  pairUrl,
  roomId,
  isPaired,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  useEffect(() => {
    if (pairUrl) {
      QRCode.toDataURL(pairUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR code generation error:', err));
    }
  }, [pairUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(pairUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-sans cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative cursor-default"
      >
        
        <button
          onClick={onClose}
          aria-label="Close QR Code Modal"
          title="Close QR Code Modal"
          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 sm:-top-3 sm:-right-3 sm:rtl:right-auto sm:rtl:-left-3 text-slate-300 hover:text-white p-2 rounded-full bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 shadow-xl transition-all focus:outline-none flex items-center justify-center z-50 group hover:scale-105"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        <div className="text-center mb-5 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-serif italic mb-1">
                    <Feather className="w-3.5 h-3.5" /> Camera Pairing Key
                  </div>
                  <h2 className="font-serif-editorial text-2xl font-normal text-white">Scan with Smartphone Camera</h2>
                  <p className="text-xs text-slate-400 font-light">
                    Point your default phone camera to connect directly to this session.
                  </p>
                </div>

        {/* QR Code Frame - Clean & Borderless */}
        <div className="relative my-4">
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center max-w-[260px] mx-auto relative group">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Pairing QR Code" className="w-full h-auto rounded-lg" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-sm font-serif italic">
                Generating Pairing Code...
              </div>
            )}

            {isPaired && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-emerald-400 p-4 animate-in zoom-in-95">
                <ShieldCheck className="w-12 h-12 mb-2 animate-bounce text-emerald-400" />
                <span className="font-serif-editorial italic text-lg text-white">Smartphone Paired!</span>
                <span className="text-xs text-slate-300 text-center mt-1 font-light">You may now close this window and begin sending media.</span>
              </div>
            )}
          </div>

          <div className="text-center mt-2 font-handwriting text-amber-400 text-base italic">
            ~ no apps, no accounts required ~
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-xs text-slate-300 my-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">1</div>
            <span>{t.step1}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">2</div>
            <span>{t.step2}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">3</div>
            <span>{t.step3}</span>
          </div>
        </div>

        {/* Direct Link Share */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
          <input
            type="text"
            readOnly
            value={pairUrl}
            className="bg-transparent border-none text-xs text-slate-400 font-mono focus:outline-none w-full truncate px-2"
          />
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs rounded-lg transition-colors shrink-0 font-medium"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedUrl ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};

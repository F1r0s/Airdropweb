import React from 'react';
import { X, Smartphone, Wifi, Battery, Signal } from 'lucide-react';
import { MobileSenderView } from './MobileSenderView';
import { FileTransferItem, RoomSessionState, SupportedLanguage } from '../types';

interface SimulatedMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomState: RoomSessionState;
  transfers: FileTransferItem[];
  onSendFile: (file: File) => void;
  onSendText: (text: string) => void;
  onCancelTransfer: (id: string) => void;
  currentLang?: SupportedLanguage;
}

export const SimulatedMobileDrawer: React.FC<SimulatedMobileDrawerProps> = ({
  isOpen,
  onClose,
  roomState,
  transfers,
  onSendFile,
  onSendText,
  onCancelTransfer,
  currentLang = 'en'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-slate-950 border-l border-amber-500/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 font-sans">

      {/* Phone Hardware Mock Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-xs font-bold text-white leading-tight">Simulated Smartphone Test</div>
            <div className="text-[10px] text-slate-400 font-mono">100dvh Touch Screen Viewport</div>
          </div>
        </div>

        {/* Mock Status Bar icons */}
        <div className="flex items-center gap-2 text-slate-400">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulated Mobile Viewport */}
      <div className="flex-1 overflow-y-auto p-2 bg-slate-950">
        <MobileSenderView
          roomState={roomState}
          transfers={transfers}
          onSendFile={onSendFile}
          onSendText={onSendText}
          onCancelTransfer={onCancelTransfer}
          currentLang={currentLang}
        />
      </div>

      {/* Phone Bottom Home Indicator Line */}
      <div className="bg-slate-950 py-2 flex justify-center">
        <div className="w-32 h-1 bg-slate-700 rounded-full" />
      </div>

    </div>
  );
};
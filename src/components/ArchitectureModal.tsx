import React from 'react';
import { X, Network, Cpu, HardDrive, Layers, ArrowRight, CheckCircle2, Feather } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative cursor-default"
      >
        <button
          onClick={onClose}
          aria-label="Close Architecture Modal"
          title="Close Modal"
          className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 shadow-md transition-all focus:outline-none flex items-center justify-center z-20 group"
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-5">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-editorial text-2xl font-normal text-white">System Architecture Blueprint</h2>
            <p className="text-xs text-amber-400/90 font-handwriting text-base italic">
              ~ Zero-App Uncompressed Cross-Device Stream ~
            </p>
          </div>
        </div>

        <div className="space-y-8 text-slate-300">
          {/* Section 1: Architectural Approach */}
          <section className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="font-serif-editorial text-lg text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-amber-400" />
              1. Optimal Architectural Choice
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 font-light">
              Connecting desktop computers and mobile devices across different network topographies without requiring native app downloads or user accounts:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 shadow-sm">
                <div className="font-serif-editorial text-amber-400 text-sm font-normal italic mb-1">
                  WebSocket Room Stream (Selected)
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  <strong>100% Reliability.</strong> Passes through cellular 5G/LTE to desktop Wi-Fi seamlessly across symmetric NATs. Zero TURN server failures.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="font-serif-editorial text-purple-400 text-sm font-normal italic mb-1">
                  WebRTC Peer-to-Peer
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  Fast on identical Wi-Fi subnets, but frequently blocked on mobile carrier NAT networks without complex relay TURN infrastructure.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="font-serif-editorial text-sky-400 text-sm font-normal italic mb-1">
                  Local HTTP Server
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  Requires mobile and desktop to be strictly on the exact same Wi-Fi IP range and causes local HTTPS certificate warnings.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: High Quality & Uncompressed Chunk Streaming */}
          <section className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="font-serif-editorial text-lg text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-amber-400" />
              2. High-Quality File Transfer & Binary Chunk Protocol
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white font-medium">Uncompressed Raw Buffers:</strong> Photos (RAW, HEIC, PNG) and 4K videos are sliced directly via <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">File.slice()</code> as binary buffers, preventing image compression completely.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white font-medium">64 KB ArrayBuffer Slices:</strong> Files stream in 64KB binary chunks. Keeps memory lightweight and prevents browser crashes on mobile iOS Safari and Android Chrome.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white font-medium">Blob Reassembly:</strong> Chunks are assembled into browser <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">Blob</code> objects upon receipt for instant download or previewing.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3: Sequence Diagram */}
          <section className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="font-serif-editorial text-lg text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              3. Data Stream Sequence
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800/80 font-mono">
              <div className="text-center bg-slate-950 p-3.5 rounded-xl w-full md:w-auto border border-slate-800">
                <div className="text-amber-400 font-bold">1. Desktop Host</div>
                <div className="text-slate-400 text-[11px] mt-1">Generates unique Session & Pairing QR</div>
              </div>

              <ArrowRight className="w-5 h-5 text-amber-400 hidden md:block" />

              <div className="text-center bg-slate-950 p-3.5 rounded-xl w-full md:w-auto border border-slate-800">
                <div className="text-sky-400 font-bold">2. Phone Scan</div>
                <div className="text-slate-400 text-[11px] mt-1">Opens webpage & joins session room</div>
              </div>

              <ArrowRight className="w-5 h-5 text-amber-400 hidden md:block" />

              <div className="text-center bg-slate-950 p-3.5 rounded-xl w-full md:w-auto border border-slate-800">
                <div className="text-emerald-400 font-bold">3. Binary Stream</div>
                <div className="text-slate-400 text-[11px] mt-1">Streams ArrayBuffers directly to PC</div>
              </div>
            </div>
          </section>

          {/* Core Code Snippet */}
          <section className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-3">
            <h3 className="font-serif-editorial text-lg text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              4. Binary Chunk Stream Code
            </h3>
            <pre className="bg-slate-900 p-4 rounded-2xl text-xs text-slate-300 overflow-x-auto border border-slate-800 font-mono leading-relaxed">
{`// Client-Side ArrayBuffer Binary Chunker
async function streamFileToDesktop(file, roomId, socket) {
  const CHUNK_SIZE = 64 * 1024; // 64KB ArrayBuffer
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  socket.emit('file-start', { roomId, name: file.name, size: file.size, totalChunks });

  for (let index = 0; index < totalChunks; index++) {
    const chunk = await file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE).arrayBuffer();
    socket.emit('file-chunk', { roomId, chunkIndex: index, data: chunk });
  }

  socket.emit('file-complete', { roomId });
}`}
            </pre>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-2xl transition-colors text-xs"
          >
            Dismiss Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

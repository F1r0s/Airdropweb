export const CHUNK_SIZE = 64 * 1024; // 64 KB chunk size for optimal WebSocket streaming

export interface ChunkUploadProgress {
  transferId: string;
  chunkIndex: number;
  totalChunks: number;
  bytesSent: number;
  totalBytes: number;
  progressPercent: number;
  speedBytesPerSec: number;
  remainingSeconds: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
  return `${parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0 || !isFinite(seconds)) return '0s';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);
  return `${mins}m ${secs}s`;
}

/**
 * Reads a file in chunks and passes each binary ArrayBuffer chunk to the provided callback
 */
export async function sendFileInChunks(
  file: File,
  transferId: string,
  onChunk: (chunkIndex: number, data: ArrayBuffer) => void,
  onProgress: (progress: ChunkUploadProgress) => void,
  isCancelled?: () => boolean
): Promise<void> {
  const totalBytes = file.size;
  const totalChunks = Math.ceil(totalBytes / CHUNK_SIZE);
  const startTime = Date.now();
  let bytesSent = 0;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    if (isCancelled && isCancelled()) {
      throw new Error('Transfer canceled by user');
    }

    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalBytes);
    const slice = file.slice(start, end);
    const arrayBuffer = await slice.arrayBuffer();

    // Emit binary chunk
    onChunk(chunkIndex, arrayBuffer);

    bytesSent += arrayBuffer.byteLength;
    const elapsedTimeSec = (Date.now() - startTime) / 1000;
    const speedBytesPerSec = elapsedTimeSec > 0 ? bytesSent / elapsedTimeSec : 0;
    const remainingBytes = totalBytes - bytesSent;
    const remainingSeconds = speedBytesPerSec > 0 ? remainingBytes / speedBytesPerSec : 0;
    const progressPercent = Math.min(100, Math.round((bytesSent / totalBytes) * 100));

    onProgress({
      transferId,
      chunkIndex,
      totalChunks,
      bytesSent,
      totalBytes,
      progressPercent,
      speedBytesPerSec,
      remainingSeconds
    });

    // Yield control to thread for smooth rendering and non-blocking streaming
    if (chunkIndex % 4 === 0) {
      await new Promise(resolve => setTimeout(resolve, 2));
    }
  }
}

/**
 * Reassembles array of ArrayBuffer chunks into a Blob
 */
export function reassembleFile(chunks: ArrayBuffer[], mimeType: string): Blob {
  return new Blob(chunks, { type: mimeType || 'application/octet-stream' });
}

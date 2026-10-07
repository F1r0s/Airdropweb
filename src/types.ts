export type DeviceRole = 'desktop' | 'mobile' | 'tablet';
export type DeviceCategory = 'pc' | 'mobile' | 'tablet';
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'ar';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  enabled: boolean;
}

export interface DeviceInfo {
  socketId: string;
  role: DeviceRole;
  deviceName: string;
  deviceType: string;
  joinedAt: number;
}

export type TransferState = 'idle' | 'transferring' | 'completed' | 'failed' | 'canceled';

export interface FileTransferItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  totalChunks: number;
  receivedChunks: number;
  progress: number; // 0 to 100
  transferSpeed: number; // bytes per second
  timeRemaining: number; // estimated seconds left
  blobUrl: string | null;
  senderName: string;
  state: TransferState;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
}

export interface TextNoteItem {
  id: string;
  text: string;
  senderName: string;
  timestamp: number;
}

export interface RoomSessionState {
  roomId: string;
  pairUrl: string;
  isPaired: boolean;
  myRole: DeviceRole;
  myDeviceName: string;
  devices: DeviceInfo[];
  isConnected: boolean;
}

export interface NetworkSpeedMetric {
  bytesSentOrReceived: number;
  currentSpeedBytesPerSec: number;
  peakSpeedBytesPerSec: number;
}

export interface PSEOPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  fromDevice: string;
  toDevice: string;
  fileCategory: string; // e.g. 'Photos', '4K Videos', 'APK Apps', 'Documents', 'Large Files'
  contentSnippet: string;
  keywords: string[];
  lastmod: string;
  priority: number;
  featured?: boolean;
}

export interface PSEOConfig {
  totalPagesCount: number;
  batchSize: number;
  sitemapChunkSize: number; // e.g. 500 URLs per sub-sitemap
  devices: string[];
  fileTypes: string[];
  actions: string[];
}

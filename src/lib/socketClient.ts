import { io, Socket } from 'socket.io-client';
import { DeviceInfo, FileTransferItem, TextNoteItem } from '../types';
import { reassembleFile, sendFileInChunks } from './fileChunker';

export class AirDropSocketManager {
  private socket: Socket | null = null;
  private roomId: string = '';
  private activeIncomingTransfers = new Map<string, {
    metadata: {
      id: string;
      fileName: string;
      fileSize: number;
      fileType: string;
      totalChunks: number;
      senderName: string;
      timestamp: number;
    };
    chunks: ArrayBuffer[];
    receivedChunksCount: number;
    startTime: number;
    lastUpdateTime: number;
  }>();

  private activeOutgoingTransfers = new Map<string, { cancelled: boolean }>();

  // Event callbacks
  public onConnectionChange?: (isConnected: boolean) => void;
  public onRoomJoined?: (data: { roomId: string; role: string; devices: DeviceInfo[] }) => void;
  public onPeerJoined?: (peer: DeviceInfo, devices: DeviceInfo[]) => void;
  public onPeerLeft?: (peer: DeviceInfo, devices: DeviceInfo[]) => void;
  public onTextReceived?: (note: TextNoteItem) => void;
  public onTransferStarted?: (item: FileTransferItem) => void;
  public onTransferProgress?: (item: FileTransferItem) => void;
  public onTransferCompleted?: (item: FileTransferItem) => void;

  public init(): Socket {
    if (this.socket) return this.socket;

    // Connect to same origin
    this.socket = io(window.location.origin, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
    return this.socket;
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[SocketClient] Connected to server:', this.socket?.id);
      if (this.onConnectionChange) this.onConnectionChange(true);
    });

    this.socket.on('disconnect', () => {
      console.log('[SocketClient] Disconnected from server');
      if (this.onConnectionChange) this.onConnectionChange(false);
    });

    this.socket.on('room-created', (data) => {
      this.roomId = data.roomId;
      if (this.onRoomJoined) {
        this.onRoomJoined({
          roomId: data.roomId,
          role: 'desktop',
          devices: data.devices
        });
      }
    });

    this.socket.on('room-joined', (data) => {
      this.roomId = data.roomId;
      if (this.onRoomJoined) {
        this.onRoomJoined({
          roomId: data.roomId,
          role: data.role,
          devices: data.devices
        });
      }
    });

    this.socket.on('peer-joined', (data) => {
      if (this.onPeerJoined) {
        this.onPeerJoined(data, data.devices);
      }
    });

    this.socket.on('peer-left', (data) => {
      if (this.onPeerLeft) {
        this.onPeerLeft(data, data.devices);
      }
    });

    this.socket.on('text-received', (note: TextNoteItem) => {
      if (this.onTextReceived) {
        this.onTextReceived(note);
      }
    });

    // File Incoming Handshake
    this.socket.on('file-start-incoming', (metadata) => {
      const transferId = metadata.transferId;
      this.activeIncomingTransfers.set(transferId, {
        metadata: {
          id: transferId,
          fileName: metadata.name,
          fileSize: metadata.size,
          fileType: metadata.type,
          totalChunks: metadata.totalChunks,
          senderName: metadata.senderName,
          timestamp: metadata.timestamp
        },
        chunks: new Array(metadata.totalChunks),
        receivedChunksCount: 0,
        startTime: Date.now(),
        lastUpdateTime: Date.now()
      });

      const initialItem: FileTransferItem = {
        id: transferId,
        fileName: metadata.name,
        fileSize: metadata.size,
        fileType: metadata.type,
        totalChunks: metadata.totalChunks,
        receivedChunks: 0,
        progress: 0,
        transferSpeed: 0,
        timeRemaining: 0,
        blobUrl: null,
        senderName: metadata.senderName,
        state: 'transferring',
        timestamp: metadata.timestamp,
        direction: 'incoming'
      };

      if (this.onTransferStarted) {
        this.onTransferStarted(initialItem);
      }
    });

    // Binary Chunk Received
    this.socket.on('file-chunk-received', ({ transferId, chunkIndex, data }) => {
      const transfer = this.activeIncomingTransfers.get(transferId);
      if (!transfer) return;

      transfer.chunks[chunkIndex] = data;
      transfer.receivedChunksCount += 1;
      transfer.lastUpdateTime = Date.now();

      const elapsedSec = (Date.now() - transfer.startTime) / 1000;
      const bytesReceived = transfer.chunks.reduce((acc, c) => acc + (c ? c.byteLength : 0), 0);
      const speed = elapsedSec > 0 ? bytesReceived / elapsedSec : 0;
      const progress = Math.min(100, Math.round((transfer.receivedChunksCount / transfer.metadata.totalChunks) * 100));
      const remainingBytes = transfer.metadata.fileSize - bytesReceived;
      const timeRemaining = speed > 0 ? remainingBytes / speed : 0;

      const updatedItem: FileTransferItem = {
        id: transferId,
        fileName: transfer.metadata.fileName,
        fileSize: transfer.metadata.fileSize,
        fileType: transfer.metadata.fileType,
        totalChunks: transfer.metadata.totalChunks,
        receivedChunks: transfer.receivedChunksCount,
        progress,
        transferSpeed: speed,
        timeRemaining,
        blobUrl: null,
        senderName: transfer.metadata.senderName,
        state: 'transferring',
        timestamp: transfer.metadata.timestamp,
        direction: 'incoming'
      };

      if (this.onTransferProgress) {
        this.onTransferProgress(updatedItem);
      }
    });

    // File Complete Signal
    this.socket.on('file-complete-received', ({ transferId }) => {
      const transfer = this.activeIncomingTransfers.get(transferId);
      if (!transfer) return;

      const blob = reassembleFile(transfer.chunks, transfer.metadata.fileType);
      const blobUrl = URL.createObjectURL(blob);

      const completedItem: FileTransferItem = {
        id: transferId,
        fileName: transfer.metadata.fileName,
        fileSize: transfer.metadata.fileSize,
        fileType: transfer.metadata.fileType,
        totalChunks: transfer.metadata.totalChunks,
        receivedChunks: transfer.metadata.totalChunks,
        progress: 100,
        transferSpeed: 0,
        timeRemaining: 0,
        blobUrl,
        senderName: transfer.metadata.senderName,
        state: 'completed',
        timestamp: transfer.metadata.timestamp,
        direction: 'incoming'
      };

      this.activeIncomingTransfers.delete(transferId);

      if (this.onTransferCompleted) {
        this.onTransferCompleted(completedItem);
      }
    });

    this.socket.on('file-cancel-received', ({ transferId }) => {
      this.activeIncomingTransfers.delete(transferId);
    });
  }

  public createRoom(roomId: string, deviceName: string, deviceType: string = 'desktop'): void {
    this.init();
    this.roomId = roomId;
    this.socket?.emit('create-room', { roomId, deviceName, deviceType });
  }

  public joinRoom(roomId: string, deviceName: string, deviceType: string = 'mobile', role: 'desktop' | 'mobile' = 'mobile'): void {
    this.init();
    this.roomId = roomId;
    this.socket?.emit('join-room', { roomId, deviceName, deviceType, role });
  }

  public sendText(text: string, senderName: string): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit('send-text', { roomId: this.roomId, text, senderName });
  }

  public async sendFile(
    file: File,
    senderName: string,
    onProgress?: (progressItem: FileTransferItem) => void
  ): Promise<FileTransferItem> {
    if (!this.socket || !this.roomId) {
      throw new Error('Not connected to a room');
    }

    const transferId = `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const totalChunks = Math.ceil(file.size / (64 * 1024));

    const outgoingState = { cancelled: false };
    this.activeOutgoingTransfers.set(transferId, outgoingState);

    // Initial handshake
    this.socket.emit('file-start', {
      roomId: this.roomId,
      transferId,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      totalChunks,
      senderName
    });

    const localBlobUrl = URL.createObjectURL(file);

    const initialItem: FileTransferItem = {
      id: transferId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      totalChunks,
      receivedChunks: 0,
      progress: 0,
      transferSpeed: 0,
      timeRemaining: 0,
      blobUrl: localBlobUrl,
      senderName,
      state: 'transferring',
      timestamp: Date.now(),
      direction: 'outgoing'
    };

    if (onProgress) onProgress(initialItem);

    try {
      await sendFileInChunks(
        file,
        transferId,
        (chunkIndex, data) => {
          this.socket?.emit('file-chunk', {
            roomId: this.roomId,
            transferId,
            chunkIndex,
            data
          });
        },
        (progress) => {
          const updatedItem: FileTransferItem = {
            ...initialItem,
            receivedChunks: progress.chunkIndex + 1,
            progress: progress.progressPercent,
            transferSpeed: progress.speedBytesPerSec,
            timeRemaining: progress.remainingSeconds
          };
          if (onProgress) onProgress(updatedItem);
        },
        () => outgoingState.cancelled
      );

      // Signal completion
      this.socket.emit('file-complete', {
        roomId: this.roomId,
        transferId
      });

      const completedItem: FileTransferItem = {
        ...initialItem,
        progress: 100,
        receivedChunks: totalChunks,
        state: 'completed',
        transferSpeed: 0,
        timeRemaining: 0
      };

      this.activeOutgoingTransfers.delete(transferId);
      if (onProgress) onProgress(completedItem);

      return completedItem;
    } catch (err) {
      this.socket.emit('file-cancel', { roomId: this.roomId, transferId });
      this.activeOutgoingTransfers.delete(transferId);
      const failedItem: FileTransferItem = {
        ...initialItem,
        state: 'failed'
      };
      if (onProgress) onProgress(failedItem);
      throw err;
    }
  }

  public cancelTransfer(transferId: string): void {
    const outgoing = this.activeOutgoingTransfers.get(transferId);
    if (outgoing) {
      outgoing.cancelled = true;
    }
    if (this.socket && this.roomId) {
      this.socket.emit('file-cancel', { roomId: this.roomId, transferId });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketManager = new AirDropSocketManager();

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const ADMIN_PATH = process.env.ADMIN_PATH || '/secretadmin2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'airdrop_admin_2026!';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'Dimawidad55';
const SITE_URL = process.env.SITE_URL || 'https://airdropweb.ai.studio';

interface RoomSession {
  roomId: string;
  pin?: string;
  createdAt: number;
  devices: Map<string, {
    socketId: string;
    role: 'desktop' | 'mobile';
    deviceName: string;
    deviceType: string;
    joinedAt: number;
  }>;
}

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with high payload buffer (up to 100MB per buffer payload)
const io = new SocketIOServer(httpServer, {
  maxHttpBufferSize: 1e8, // 100 MB
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory room store
const activeRooms = new Map<string, RoomSession>();

// In-memory pSEO store backed by disk cache
interface PSEOPageData {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  fromDevice: string;
  toDevice: string;
  fileCategory: string;
  contentSnippet: string;
  keywords: string[];
  lastmod: string;
  priority: number;
}

let pseoPages: PSEOPageData[] = [];
const PSEO_CHUNK_SIZE = 500; // 500 URLs per sub-sitemap
const PSEO_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'pseoPages.json');

function loadPseoFromDisk(): PSEOPageData[] {
  try {
    if (fs.existsSync(PSEO_FILE_PATH)) {
      const content = fs.readFileSync(PSEO_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('[pSEO] Error reading pseoPages.json:', err);
  }
  return [];
}

function savePseoToDisk(data: PSEOPageData[]): boolean {
  try {
    const dir = path.dirname(PSEO_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PSEO_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[pSEO] Error writing pseoPages.json:', err);
    return false;
  }
}

// Generate or restore programmatic SEO pages
function initPSEOPages(targetCount = 1500, forceRegenerate = false) {
  if (!forceRegenerate) {
    const existing = loadPseoFromDisk();
    if (existing.length > 0) {
      pseoPages = existing;
      console.log(`[pSEO] Restored ${pseoPages.length} pages from disk cache.`);
      return;
    }
  }
  const devices = [
    'Android Phone',
    'iPhone',
    'iPad',
    'Samsung Tablet',
    'Windows PC',
    'MacBook',
    'Chromebook',
    'Linux PC'
  ];
  const fileTypes = [
    'Photos & RAW Images',
    '4K Videos',
    'APK Android Apps',
    'Large Files & ZIP',
    'Documents & PDFs',
    'Audio & Music'
  ];
  const actions = [
    'Transfer',
    'AirDrop Alternative',
    'Send Online Free',
    'Stream Direct',
    'Share without Cables',
    'Fast Wireless Sync'
  ];

  const now = new Date().toISOString().split('T')[0];
  const generated: PSEOPageData[] = [];

  for (const d1 of devices) {
    for (const d2 of devices) {
      if (d1 === d2) continue;
      for (const f of fileTypes) {
        for (const a of actions) {
          if (generated.length >= 1500) break;
          const d1Slug = d1.toLowerCase().replace(/\s+/g, '-');
          const d2Slug = d2.toLowerCase().replace(/\s+/g, '-');
          const fileSlug = f.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          const actionSlug = a.toLowerCase().replace(/[^a-z0-9]/g, '-');

          const slug = `${actionSlug}-${fileSlug}-from-${d1Slug}-to-${d2Slug}`;
          generated.push({
            slug,
            title: `${a} ${f} from ${d1} to ${d2} Online Free | AirDrop Web`,
            h1: `Fast ${a} of ${f} between ${d1} & ${d2}`,
            metaDescription: `Transfer and share ${f} from ${d1} to ${d2} online without cables or apps. Link devices via QR code scan or room code over any Wi-Fi or cellular network.`,
            fromDevice: d1,
            toDevice: d2,
            fileCategory: f,
            contentSnippet: `Easily connect your ${d1} and ${d2} to stream uncompressed ${f}. Works seamlessly even if devices are on different Wi-Fi networks or mobile data.`,
            keywords: [
              `airdrop ${d1.toLowerCase()} to ${d2.toLowerCase()}`,
              `transfer ${f.toLowerCase()} ${d1.toLowerCase()} ${d2.toLowerCase()}`,
              `send ${fileSlug} online free`
            ],
            lastmod: now,
            priority: generated.length < 50 ? 0.9 : 0.8
          });
        }
      }
    }
  }
  pseoPages = generated;
  savePseoToDisk(pseoPages);
  console.log(`[pSEO] Initialized & saved ${pseoPages.length} programmatic SEO landing pages.`);
}

initPSEOPages();


// Cleanup stale rooms older than 24 hours
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of activeRooms.entries()) {
    if (room.devices.size === 0 && now - room.createdAt > 24 * 60 * 60 * 1000) {
      activeRooms.delete(roomId);
    }
  }
}, 60 * 60 * 1000);

// API Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    activeRoomsCount: activeRooms.size,
    timestamp: new Date().toISOString()
  });
});

// API Room Info
app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = activeRooms.get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({
    roomId: room.roomId,
    deviceCount: room.devices.size,
    devices: Array.from(room.devices.values()).map(d => ({
      role: d.role,
      deviceName: d.deviceName,
      deviceType: d.deviceType
    }))
  });
});

// JSON parser for admin API requests
app.use(express.json());

// ==========================================
// ADMIN SECURITY HELPERS (HMAC-SHA256 & RATE LIMITING)
// ==========================================

const loginRateLimits = new Map<string, { count: number; lockUntil: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const entry = loginRateLimits.get(ip);
  if (!entry) return { allowed: true };
  if (entry.lockUntil > now) {
    return { allowed: false, remainingMinutes: Math.ceil((entry.lockUntil - now) / 60000) };
  }
  if (entry.lockUntil <= now && entry.count >= 5) {
    loginRateLimits.delete(ip);
  }
  return { allowed: true };
}

function recordLoginAttempt(ip: string, success: boolean) {
  if (success) {
    loginRateLimits.delete(ip);
    return;
  }
  const now = Date.now();
  const entry = loginRateLimits.get(ip) || { count: 0, lockUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockUntil = now + 15 * 60 * 1000;
  }
  loginRateLimits.set(ip, entry);
}

function generateAdminToken(): string {
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_JWT_SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `adm_${payloadB64}.${signature}`;
}

function verifyAdminToken(token: string): boolean {
  if (!token.startsWith('adm_')) return false;
  const raw = token.slice(4);
  const parts = raw.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', ADMIN_JWT_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (signature.length !== expectedSig.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return payload.exp && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

// ==========================================
// ADMIN API ENDPOINTS (Protected)
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || 'unknown';
  const { allowed, remainingMinutes } = checkRateLimit(clientIp);
  if (!allowed) {
    return res.status(429).json({
      error: `Too many failed attempts. Try again in ${remainingMinutes} minutes.`
    });
  }

  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    recordLoginAttempt(clientIp, false);
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  recordLoginAttempt(clientIp, true);
  const token = generateAdminToken();
  res.json({ success: true, token, adminPath: ADMIN_PATH });
});

// Admin Auth Middleware
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing Admin Token' });
  }

  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    return res.status(403).json({ error: 'Forbidden: Invalid or Expired Admin Token' });
  }
  next();
};

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  res.json({
    activeRoomsCount: activeRooms.size,
    totalPseoPages: pseoPages.length,
    sitemapCount: Math.ceil(pseoPages.length / PSEO_CHUNK_SIZE),
    uptime: process.uptime(),
    adminPath: ADMIN_PATH
  });
});

// Admin Get pSEO Pages with search and pagination
app.get('/api/admin/pseo', requireAdmin, (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
  const limit = Math.max(10, Math.min(200, parseInt(req.query.limit as string || '50', 10)));

  let filtered = pseoPages;
  if (query) {
    filtered = pseoPages.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      p.fileCategory.toLowerCase().includes(query)
    );
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  res.json({
    total: filtered.length,
    overallTotal: pseoPages.length,
    page,
    limit,
    sitemapCount: Math.max(1, Math.ceil(pseoPages.length / PSEO_CHUNK_SIZE)),
    pages: paginated
  });
});

// Admin Generate Custom Quantity of pSEO Pages
app.post('/api/admin/pseo/generate', requireAdmin, (req, res) => {
  const count = Math.max(100, Math.min(10000, Number(req.body.count) || 1500));
  initPSEOPages(count, true);
  res.json({
    success: true,
    generatedCount: pseoPages.length,
    sitemapCount: Math.max(1, Math.ceil(pseoPages.length / PSEO_CHUNK_SIZE))
  });
});

// Admin Update Single pSEO Page
app.put('/api/admin/pseo/update', requireAdmin, (req, res) => {
  const { slug, updates } = req.body;
  if (!slug || !updates) {
    return res.status(400).json({ error: 'Missing slug or updates object' });
  }

  const index = pseoPages.findIndex(p => p.slug === slug);
  if (index === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }

  pseoPages[index] = {
    ...pseoPages[index],
    ...updates,
    lastmod: new Date().toISOString().split('T')[0]
  };

  savePseoToDisk(pseoPages);
  res.json({ success: true, page: pseoPages[index] });
});

// Admin Delete Single pSEO Page
app.delete('/api/admin/pseo/:slug', requireAdmin, (req, res) => {
  const { slug } = req.params;
  const initialLength = pseoPages.length;
  pseoPages = pseoPages.filter(p => p.slug !== slug);

  if (pseoPages.length !== initialLength) {
    savePseoToDisk(pseoPages);
    return res.json({
      success: true,
      remaining: pseoPages.length,
      sitemapCount: Math.max(1, Math.ceil(pseoPages.length / PSEO_CHUNK_SIZE))
    });
  }
  res.status(404).json({ error: 'Page not found' });
});

// ==========================================
// TRANSLATION PERSISTENCE API
// ==========================================

const TRANSLATIONS_PATH = path.join(process.cwd(), 'src', 'data', 'translations.json');

function loadTranslations(): Record<string, any> {
  try {
    if (fs.existsSync(TRANSLATIONS_PATH)) {
      return JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('[Translations] Error loading translations.json:', err);
  }
  return {};
}

function saveTranslations(data: Record<string, any>): boolean {
  try {
    const dir = path.dirname(TRANSLATIONS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Translations] Error saving translations.json:', err);
    return false;
  }
}

// Public endpoint to fetch all active language translations
app.get('/api/translations', (req, res) => {
  const translations = loadTranslations();
  res.json(translations);
});

// Protected endpoint to fetch translations for admin editor
app.get('/api/admin/translations', requireAdmin, (req, res) => {
  const translations = loadTranslations();
  res.json(translations);
});

// Protected endpoint to update a language translation dictionary
app.put('/api/admin/translations', requireAdmin, (req, res) => {
  const { lang, translations } = req.body;
  if (!lang || !translations) {
    return res.status(400).json({ error: 'Missing lang or translations payload' });
  }
  const current = loadTranslations();
  current[lang] = { ...current[lang], ...translations };
  const ok = saveTranslations(current);
  if (ok) {
    res.json({ success: true, lang, translations: current[lang] });
  } else {
    res.status(500).json({ error: 'Failed to write translations to disk' });
  }
});

// Public API endpoint for frontend to fetch pSEO page info
app.get('/api/pseo/:slug', (req, res) => {
  const { slug } = req.params;
  const page = pseoPages.find(p => p.slug === slug);
  if (!page) {
    return res.status(404).json({ error: 'pSEO Page not found' });
  }
  res.json(page);
});

// ==========================================
// DYNAMIC SITEMAP INDEX & SUB-SITEMAPS
// ==========================================

// 1. Root Sitemap Index: /sitemap.xml -> Points to sitemap_1.xml, sitemap_2.xml, etc.
app.get('/sitemap.xml', (req, res) => {
  const totalChunks = Math.max(1, Math.ceil(pseoPages.length / PSEO_CHUNK_SIZE));
  const now = new Date().toISOString().split('T')[0];
  res.header('Cache-Control', 'public, max-age=3600');

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (let i = 1; i <= totalChunks; i++) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${SITE_URL}/sitemap_${i}.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }

  xml += '</sitemapindex>';

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// 2. Sub-Sitemaps: /sitemap_:chunkId.xml -> Chunks of ~500 URLs each
app.get('/sitemap_:chunkId.xml', (req, res) => {
  res.header('Cache-Control', 'public, max-age=3600');
  const chunkIndex = parseInt(req.params.chunkId, 10) - 1;
  if (isNaN(chunkIndex) || chunkIndex < 0) {
    return res.status(404).send('Invalid sitemap chunk');
  }

  const start = chunkIndex * PSEO_CHUNK_SIZE;
  const chunk = pseoPages.slice(start, start + PSEO_CHUNK_SIZE);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Include root homepage on first sitemap
  if (chunkIndex === 0) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const page of chunk) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/pseo/${page.slug}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Socket.IO real-time signaling & data relay engine
io.on('connection', (socket) => {
  let currentRoomId: string | null = null;

  // Create room (usually triggered by Desktop host)
  socket.on('create-room', ({ roomId, deviceName, deviceType }) => {
    currentRoomId = roomId;
    socket.join(roomId);

    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, {
        roomId,
        createdAt: Date.now(),
        devices: new Map()
      });
    }

    const room = activeRooms.get(roomId)!;
    room.devices.set(socket.id, {
      socketId: socket.id,
      role: 'desktop',
      deviceName: deviceName || 'Desktop PC',
      deviceType: deviceType || 'desktop',
      joinedAt: Date.now()
    });

    socket.emit('room-created', {
      roomId,
      devices: Array.from(room.devices.values())
    });

    console.log(`[Socket] Desktop host created room: ${roomId} (${socket.id})`);
  });

  // Join room (usually triggered by Phone scanning QR)
  socket.on('join-room', ({ roomId, deviceName, deviceType, role }) => {
    currentRoomId = roomId;
    socket.join(roomId);

    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, {
        roomId,
        createdAt: Date.now(),
        devices: new Map()
      });
    }

    const room = activeRooms.get(roomId)!;
    const clientRole = role || 'mobile';
    const clientDeviceName = deviceName || (clientRole === 'mobile' ? 'Smartphone' : 'Guest Device');

    room.devices.set(socket.id, {
      socketId: socket.id,
      role: clientRole,
      deviceName: clientDeviceName,
      deviceType: deviceType || 'mobile',
      joinedAt: Date.now()
    });

    const devicesList = Array.from(room.devices.values());

    // Confirm connection to joining client
    socket.emit('room-joined', {
      roomId,
      role: clientRole,
      deviceName: clientDeviceName,
      devices: devicesList
    });

    // Notify all other peers in the room that a device paired
    socket.to(roomId).emit('peer-joined', {
      socketId: socket.id,
      role: clientRole,
      deviceName: clientDeviceName,
      devices: devicesList
    });

    console.log(`[Socket] ${clientRole} joined room ${roomId}: ${clientDeviceName} (${socket.id})`);
  });

  // Instant Text/URL/Clipboard note relay
  socket.on('send-text', ({ roomId, text, senderName }) => {
    if (!roomId) return;
    const timestamp = Date.now();
    
    // Broadcast to room members including or excluding sender depending on use
    io.in(roomId).emit('text-received', {
      id: `text-${timestamp}-${Math.random().toString(36).substr(2, 6)}`,
      text,
      senderName: senderName || 'Paired Device',
      timestamp
    });
  });

  // File Transfer Protocol: Initial metadata handshake
  socket.on('file-start', ({ roomId, transferId, name, size, type, totalChunks, senderName }) => {
    if (!roomId) return;

    socket.to(roomId).emit('file-start-incoming', {
      transferId,
      name,
      size,
      type,
      totalChunks,
      senderName: senderName || 'Paired Device',
      timestamp: Date.now()
    });
  });

  // File Transfer Protocol: Binary chunk relay
  socket.on('file-chunk', ({ roomId, transferId, chunkIndex, data }) => {
    if (!roomId) return;

    // Direct binary broadcast to other devices in room
    socket.to(roomId).emit('file-chunk-received', {
      transferId,
      chunkIndex,
      data
    });
  });

  // File Transfer Protocol: Complete acknowledgment
  socket.on('file-complete', ({ roomId, transferId }) => {
    if (!roomId) return;

    socket.to(roomId).emit('file-complete-received', {
      transferId,
      timestamp: Date.now()
    });
  });

  // Cancel ongoing transfer
  socket.on('file-cancel', ({ roomId, transferId }) => {
    if (!roomId) return;
    socket.to(roomId).emit('file-cancel-received', { transferId });
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    if (currentRoomId && activeRooms.has(currentRoomId)) {
      const room = activeRooms.get(currentRoomId)!;
      const device = room.devices.get(socket.id);
      
      room.devices.delete(socket.id);
      const remainingDevices = Array.from(room.devices.values());

      if (device) {
        socket.to(currentRoomId).emit('peer-left', {
          socketId: socket.id,
          deviceName: device.deviceName,
          role: device.role,
          devices: remainingDevices
        });
        console.log(`[Socket] Device ${device.deviceName} disconnected from ${currentRoomId}`);
      }

      if (room.devices.size === 0) {
        // Schedule cleanup if room stays empty
      }
    }
  });
});

async function startServer() {
  const PORT = 3000;

  // SEO Static XML & Robots Endpoints are now served automatically by Vite/Express static middleware from /public or /dist

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/pseo/:slug', (req, res) => {
      const page = pseoPages.find(p => p.slug === req.params.slug);
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath) && page) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = html
          .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
          .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${page.metaDescription.replace(/"/g, '&quot;')}" />`);
        return res.send(html);
      }
      res.sendFile(indexPath);
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[AirDrop Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

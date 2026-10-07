import { PSEOPage } from '../types';

export const PSEO_DEVICES = [
  'Android Phone',
  'iPhone',
  'iPad',
  'Samsung Tablet',
  'Windows PC',
  'MacBook',
  'Chromebook',
  'Linux PC'
];

export const PSEO_FILE_TYPES = [
  'Photos & RAW Images',
  '4K Videos',
  'APK Android Apps',
  'Large Files & ZIP',
  'Documents & PDFs',
  'Audio & Music'
];

export const PSEO_ACTIONS = [
  'Transfer',
  'AirDrop Alternative',
  'Send Online Free',
  'Stream Direct',
  'Share without Cables',
  'Fast Wireless Sync'
];

/**
 * Generates programmatic SEO pages by combining devices, file types, and search intents.
 * This can generate thousands of unique indexed landing pages.
 */
export function generateProgrammaticPages(limit = 1200): PSEOPage[] {
  const pages: PSEOPage[] = [];
  const now = new Date().toISOString().split('T')[0];

  for (let d1 of PSEO_DEVICES) {
    for (let d2 of PSEO_DEVICES) {
      if (d1 === d2) continue;

      for (let f of PSEO_FILE_TYPES) {
        for (let a of PSEO_ACTIONS) {
          if (pages.length >= limit) return pages;

          const d1Slug = d1.toLowerCase().replace(/\s+/g, '-');
          const d2Slug = d2.toLowerCase().replace(/\s+/g, '-');
          const fileSlug = f.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          const actionSlug = a.toLowerCase().replace(/[^a-z0-9]/g, '-');

          const slug = `${actionSlug}-${fileSlug}-from-${d1Slug}-to-${d2Slug}`;
          const title = `${a} ${f} from ${d1} to ${d2} Online Free | AirDrop Web`;
          const h1 = `Fast ${a} of ${f} between ${d1} & ${d2}`;
          const metaDescription = `Transfer and share ${f} from ${d1} to ${d2} online without cables or apps. Link devices via QR code scan or room code over any Wi-Fi or cellular network.`;

          pages.push({
            slug,
            title,
            h1,
            metaDescription,
            fromDevice: d1,
            toDevice: d2,
            fileCategory: f,
            contentSnippet: `Easily connect your ${d1} and ${d2} to stream uncompressed ${f}. Works seamlessly even if devices are on different Wi-Fi networks or mobile data.`,
            keywords: [
              `airdrop ${d1.toLowerCase()} to ${d2.toLowerCase()}`,
              `transfer ${f.toLowerCase()} ${d1.toLowerCase()} ${d2.toLowerCase()}`,
              `send ${fileSlug} online free`,
              `how to transfer files from ${d1.toLowerCase()} to ${d2.toLowerCase()}`
            ],
            lastmod: now,
            priority: pages.length < 50 ? 0.9 : 0.8
          });
        }
      }
    }
  }

  return pages;
}

/**
 * Chunks an array into smaller subsets (for sitemap_1.xml, sitemap_2.xml, etc.)
 */
export function chunkPages<T>(items: T[], chunkSize = 400): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}
/**
 * Optimizes image URLs by routing them through wsrv.nl image proxy.
 * This resizes, compresses, and converts images to WebP on-the-fly
 * without needing to re-upload anything.
 *
 * Only transforms external URLs (R2, Supabase storage, etc.)
 * Local/public assets are left untouched.
 */

const PROXY_BASE = 'https://wsrv.nl/';

export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}
): string {
  if (!url) return url;

  // Only proxy external URLs (R2, Supabase storage, etc.)
  // Skip local assets like /HERO.png, /gallery/..., etc.
  if (!url.startsWith('http')) return url;

  const { width = 800, quality = 75, fit = 'cover', height } = options;

  const params = new URLSearchParams({
    url,
    w: String(width),
    q: String(quality),
    output: 'webp',
    fit,
  });

  if (height) {
    params.set('h', String(height));
  }

  return `${PROXY_BASE}?${params.toString()}`;
}

/**
 * Preset sizes for common use cases
 */
export const imgSize = {
  /** Destination carousel cards: 320x427 */
  destinationCard: (url: string) =>
    optimizeImageUrl(url, { width: 640, height: 854, quality: 75 }),

  /** Gallery thumbnails on homepage */
  galleryThumb: (url: string) =>
    optimizeImageUrl(url, { width: 600, quality: 70 }),

  /** Gallery large (expanded card on desktop) */
  galleryLarge: (url: string) =>
    optimizeImageUrl(url, { width: 900, quality: 80 }),

  /** Service card backgrounds (full-width) */
  serviceCard: (url: string) =>
    optimizeImageUrl(url, { width: 1200, quality: 75 }),

  /** Experience/philosophy images */
  philosophy: (url: string) =>
    optimizeImageUrl(url, { width: 800, quality: 80 }),

  /** Full-width hero or detail page images */
  hero: (url: string) =>
    optimizeImageUrl(url, { width: 1920, quality: 80 }),
} as const;

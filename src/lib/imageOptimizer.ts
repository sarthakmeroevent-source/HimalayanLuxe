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
 * Video optimization utilities
 */
export function getOptimizedVideoUrl(url: string): string {
  if (!url) return url;
  
  // Skip local assets
  if (!url.startsWith('http')) return url;

  // For now, return original URL until we have actual optimized variants
  // This prevents 404 errors when _mobile/_desktop variants don't exist
  return url;
  
  // TODO: Implement when video variants are available
  // const isMobile = window.innerWidth < 768;
  // const isSlowConnection = 'connection' in navigator && 
  //   (navigator as any).connection?.effectiveType === '2g';
  // 
  // if (isSlowConnection || isMobile) {
  //   return getVideoVariant(url, 'mobile');
  // } else {
  //   return getVideoVariant(url, 'desktop');
  // }
}

function getVideoVariant(url: string, quality: 'mobile' | 'desktop'): string {
  // If the URL already has quality indicators, return as-is
  if (url.includes('_mobile') || url.includes('_desktop') || url.includes('_compressed')) {
    return url;
  }

  // Try to find mobile/compressed variants by URL manipulation
  const baseUrl = url.replace(/\.[^/.]+$/, ''); // Remove extension
  const extension = url.match(/\.[^/.]+$/)?.[0] || '.mp4';

  if (quality === 'mobile') {
    // Try mobile-specific variants
    const mobileVariants = [
      `${baseUrl}_mobile${extension}`,
      `${baseUrl}_compressed${extension}`,
      `${baseUrl}_720p${extension}`,
      url // fallback to original
    ];
    return mobileVariants[0]; // For now, return the first variant
  } else {
    // Desktop variants
    const desktopVariants = [
      `${baseUrl}_desktop${extension}`,
      `${baseUrl}_1080p${extension}`,
      url // fallback to original
    ];
    return desktopVariants[0]; // For now, return the first variant
  }
}

/**
 * Get video poster image (thumbnail)
 */
export function getVideoPoster(videoUrl: string): string {
  if (!videoUrl) return '';
  
  // Convert video URL to poster image URL
  const posterUrl = videoUrl.replace(/\.(mp4|webm|mov)$/i, '.jpg');
  
  // Only optimize if it's an external URL, otherwise return as-is
  if (posterUrl.startsWith('http')) {
    return optimizeImageUrl(posterUrl, { width: 1920, quality: 60 });
  }
  
  return posterUrl;
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

/**
 * Video optimization presets
 */
export const videoSize = {
  /** Hero section video - optimized for device and connection */
  hero: (url: string) => getOptimizedVideoUrl(url),
  
  /** Get poster image for video */
  poster: (url: string) => getVideoPoster(url),
} as const;
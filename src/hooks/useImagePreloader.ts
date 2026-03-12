import { useEffect } from 'react';

/**
 * Preloads an array of image URLs in the background so they're cached
 * by the time the user scrolls to the section that displays them.
 */
export function useImagePreloader(urls: string[]) {
  useEffect(() => {
    if (!urls.length) return;

    const controllers: AbortController[] = [];

    urls.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
    });

    return () => {
      controllers.forEach((c) => c.abort());
    };
  }, [urls]);
}

import { useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight scroll-triggered fade-in using IntersectionObserver + CSS.
 * No framer-motion overhead, no layout thrashing, pure GPU compositing.
 *
 * Handles edge cases:
 * - Element already in viewport on mount (SPA navigation back to home)
 * - Lenis smooth scroll that may not trigger IO callbacks reliably
 * - Loader overlay delaying initial visibility
 */
export function useFadeInView(rootMargin = '-50px 0px') {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);

  const reveal = useCallback(() => {
    const el = ref.current;
    if (!el || revealed.current) return false;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
      el.classList.add('is-visible');
      revealed.current = true;
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediate check — covers SPA navigation where element is already visible
    if (reveal()) return;

    // IntersectionObserver — primary mechanism for scroll-triggered reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed.current) {
          el.classList.add('is-visible');
          revealed.current = true;
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin }
    );
    observer.observe(el);

    // Fallback: passive scroll listener for cases where Lenis smooth scroll
    // doesn't trigger IntersectionObserver reliably on first page load.
    const onScroll = () => {
      if (reveal()) {
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [rootMargin, reveal]);

  return ref;
}

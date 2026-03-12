import { useEffect, useRef } from 'react';

/**
 * Lightweight scroll-triggered fade-in using IntersectionObserver + CSS.
 * No framer-motion overhead, no layout thrashing, pure GPU compositing.
 */
export function useFadeInView(rootMargin = '-50px 0px') {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}

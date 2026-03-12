import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDestinations } from '../../hooks/useDestinations';
import { imgSize } from '../../lib/imageOptimizer';
import SectionUnavailable from '../common/SectionUnavailable';

// Physics constants
const FRICTION = 0.95;
const AUTO_SPEED = 50; // Constant speed for auto-movement
const GAP = 40;
const MAX_ROTATION = 25;
const MAX_DEPTH = 150;
const MIN_SCALE = 0.9;
const SCALE_RANGE = 0.1;

const DestinationGradientCarousel: React.FC = () => {
  const { data: destinations, isLoading, isError } = useDestinations();
  const navigate = useNavigate();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRootRef = useRef<HTMLDivElement>(null);
  
  // Use refs instead of state for animation values to avoid React re-renders during rAF
  const isHoveredRef = useRef(false);
  
  // State for animation
  const stateRef = useRef({
    scrollX: 0,
    vX: AUTO_SPEED,
    lastTime: 0,
    items: [] as { el: HTMLElement; x: number }[],
    track: 0,
    cardW: 300,
    vwHalf: 0,
    rafId: 0,
    dragging: false,
    lastX: 0,
    lastT: 0,
    lastDelta: 0,
    dragDist: 0,
    clickedDestId: null as string | null,
    isInView: false,
    initialized: false,
  });

  const displayItems = useMemo(() => {
    if (!destinations) return [];
    return destinations.slice(0, 10);
  }, [destinations]);

  // Utility: Modulo
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  const updateTransforms = useCallback(() => {
    const s = stateRef.current;
    if (!s.track) return;

    const half = s.track / 2;

    s.items.forEach((it) => {
      let pos = it.x - s.scrollX;
      if (pos < -half) pos += s.track;
      if (pos > half) pos -= s.track;

      const norm = Math.max(-1, Math.min(1, pos / s.vwHalf));
      const absNorm = Math.abs(norm);
      const invNorm = 1 - absNorm;

      const ry = -norm * MAX_ROTATION;
      const tz = invNorm * MAX_DEPTH;
      const scale = MIN_SCALE + invNorm * SCALE_RANGE;

      it.el.style.transform = `translate3d(${pos}px, -50%, ${tz}px) rotateY(${ry}deg) scale(${scale})`;
      it.el.style.zIndex = String(1000 + Math.round(tz));
      it.el.style.opacity = String(1 - absNorm * 0.5);
    });
  }, []);

  const tick = useCallback((t: number) => {
    const s = stateRef.current;
    
    s.rafId = requestAnimationFrame(tick);
    
    // Skip heavy calculations if the carousel is not visible
    if (!s.isInView) {
        s.lastTime = 0;
        return;
    }

    const dt = s.lastTime ? (t - s.lastTime) / 1000 : 0;
    s.lastTime = t;

    // Clamp dt to avoid huge jumps after tab switch or long pause
    const clampedDt = Math.min(dt, 0.05);

    if (!isHoveredRef.current && !s.dragging) {
      s.vX += (AUTO_SPEED - s.vX) * 0.1;
    } else {
      s.vX *= FRICTION;
      if (Math.abs(s.vX) < 1) s.vX = 0;
    }

    if (!s.dragging) {
      s.scrollX = mod(s.scrollX + s.vX * clampedDt, s.track);
      updateTransforms();
    }
  }, [updateTransforms]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    const s = stateRef.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.lastDelta = 0;
    s.dragDist = 0;

    const card = (e.target as HTMLElement).closest('article');
    s.clickedDestId = card ? card.getAttribute('data-id') : null;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s.dragging) return;

    const DRAG_SENS = 1.0;
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const dt = Math.max(1, now - s.lastT) / 1000;

    s.dragDist += Math.abs(dx);
    s.scrollX = mod(s.scrollX - dx * DRAG_SENS, s.track);
    s.lastDelta = dx / dt;
    s.lastX = e.clientX;
    s.lastT = now;
    
    updateTransforms();
  };

  const onPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s.dragging) return;

    // Check if it was a clean click before releasing capture and resetting dragDist
    if (s.dragDist <= 10 && s.clickedDestId) {
      navigate(`/destinations/${s.clickedDestId}`);
    }
    
    s.dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    
    const DRAG_SENS = 1.0;
    // Apply final velocity as momentum
    s.vX = -s.lastDelta * DRAG_SENS * 0.5;
  };

  useEffect(() => {
    if (isLoading || !displayItems.length || !cardsRootRef.current || !containerRef.current) return;

    const s = stateRef.current;
    const container = containerRef.current;

    const initCarousel = () => {
      if (s.initialized || !cardsRootRef.current) return;
      
      const els = Array.from(cardsRootRef.current.children) as HTMLElement[];
      if (els.length === 0) return;

      s.cardW = els[0].offsetWidth || 300;
      const step = s.cardW + GAP;
      s.track = displayItems.length * step;
      s.vwHalf = window.innerWidth * 0.5;

      s.items = els.map((el, i) => ({
        el,
        x: i * step
      }));

      updateTransforms();
      s.initialized = true;
      s.rafId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      if (!s.initialized || !cardsRootRef.current) return;
      const els = Array.from(cardsRootRef.current.children) as HTMLElement[];
      s.vwHalf = window.innerWidth * 0.5;
      if (els[0]) s.cardW = els[0].offsetWidth || 300;
      const newStep = s.cardW + GAP;
      s.track = displayItems.length * newStep;
      s.items.forEach((it, i) => it.x = i * newStep);
    };

    // Use IntersectionObserver with a large rootMargin so we initialize
    // BEFORE the user actually scrolls to the section (no pause on arrival)
    const observer = new IntersectionObserver(([entry]) => {
      s.isInView = entry.isIntersecting;
      if (entry.isIntersecting && !s.initialized) {
        // Use rAF to avoid layout thrashing during scroll
        requestAnimationFrame(() => {
          initCarousel();
        });
      }
    }, { threshold: 0, rootMargin: '200px 0px' });

    observer.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(s.rafId);
      s.initialized = false;
    };
  }, [isLoading, displayItems, tick, updateTransforms]);

  if (isLoading) return (
    <div className="w-full h-[375px] md:h-[430px]" />
  );

  if (isError || !displayItems.length) return (
    <SectionUnavailable message="Destinations are temporarily unavailable" />
  );

  return (
    <div 
      className="relative w-full h-[375px] md:h-[430px] overflow-hidden perspective-[1800px] bg-transparent cursor-grab active:cursor-grabbing"
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUpOrCancel}
      onPointerCancel={onPointerUpOrCancel}
    >
      <div 
        ref={cardsRootRef}
        className="absolute inset-0 preserve-3d pointer-events-none"
      >
        {displayItems.map((dest) => (
          <article 
            key={dest.id}
            data-id={dest.slug || dest.id}
            className="absolute top-1/2 left-1/2 w-[280px] md:w-[320px] aspect-[3/4] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden pointer-events-auto cursor-pointer border border-white/5"
            style={{ willChange: 'transform' }}
          >
            <img 
              src={imgSize.destinationCard(dest.cover_image_url)} 
              alt={dest.name}
              className="w-full h-full object-cover"
              draggable={false}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-left">
              <div className="w-8 h-[1px] bg-gold mb-3" />
              <span className="text-[9px] tracking-[0.3em] uppercase font-medium mb-1 text-gold/80">
                {dest.code || 'LUXE'}
              </span>
              <h3 className="font-serif text-white text-xl md:text-2xl leading-tight">
                {dest.name}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default DestinationGradientCarousel;

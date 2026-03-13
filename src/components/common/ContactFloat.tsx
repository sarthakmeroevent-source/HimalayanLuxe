import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

const FALLBACK_NUMBER = '9779818184797';
const FALLBACK_INSTAGRAM = 'https://www.instagram.com/himalayan_luxe/';

export default function ContactFloat() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const isHomePage = location.pathname === '/';

  const { data: settings } = useQuery({
    queryKey: ['site-settings-public'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('whatsapp_number, social_instagram').maybeSingle();
      return data as { whatsapp_number: string | null; social_instagram: string | null } | null;
    },
    staleTime: 1000 * 60 * 30,
  });

  const number = settings?.whatsapp_number || FALLBACK_NUMBER;
  const instaUrl = settings?.social_instagram || FALLBACK_INSTAGRAM;

  // Handle scroll-based visibility for homepage
  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        const halfHeroHeight = heroHeight / 2;
        
        setIsVisible(scrollPosition > halfHeroHeight);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 400);
  };

  const options = [
    {
      label: 'WhatsApp',
      color: 'bg-[#25D366]',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]',
      onClick: () => window.open(
        `https://wa.me/${number}?text=${encodeURIComponent('Hi, I would like to know more about Himalayan Luxe services.')}`,
        '_blank'
      ),
      icon: (
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.95 2.042-3.21 2.312-.864.182-1.99.328-5.786-1.244-4.856-2.012-7.978-6.932-8.22-7.254-.232-.322-1.95-2.6-1.95-4.96s1.232-3.518 1.67-3.998c.438-.48.956-.6 1.274-.6.318 0 .636.002.914.016.294.016.688-.112 1.076.82.396.952 1.352 3.312 1.47 3.552.118.24.198.52.04.84-.158.318-.238.518-.478.798-.24.28-.504.626-.72.84-.24.24-.49.5-.21.98.28.48 1.244 2.054 2.672 3.328 1.838 1.638 3.386 2.146 3.866 2.386.48.24.76.2 1.04-.12.28-.318 1.196-1.396 1.514-1.876.318-.48.636-.398 1.076-.238.438.158 2.794 1.318 3.274 1.558.48.24.798.358.916.558.118.198.118 1.156-.278 2.272z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(221,42,123,0.5)]',
      onClick: () => window.open(instaUrl, '_blank'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      label: 'Inquiry',
      color: 'bg-[#D4AF37]',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]',
      onClick: () => { setOpen(false); navigate('/contact'); },
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-6 right-6 z-[9999] flex flex-col-reverse items-center gap-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {/* Main toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          open
            ? 'bg-white/10 backdrop-blur-md border border-white/20 rotate-45 scale-95'
            : 'hover:scale-110 shadow-[0_8px_32px_rgba(212,175,55,0.4)] backdrop-blur-xl border border-gold/40'
        }`}
        style={{
          background: open 
            ? undefined 
            : 'linear-gradient(135deg, rgba(184,150,46,0.5) 0%, rgba(212,175,55,0.5) 25%, rgba(184,150,46,0.5) 50%, rgba(154,123,26,0.5) 75%, rgba(184,150,46,0.5) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(212,175,55,0.3)',
        }}
        aria-label={open ? 'Close contact options' : 'Open contact options'}
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-all duration-300 ${open ? 'fill-white' : 'fill-black'}`}
        >
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </svg>
      </button>

      {/* Options */}
      {options.map((opt, i) => (
        <button
          key={opt.label}
          onClick={opt.onClick}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${opt.color} ${opt.hoverGlow} ${
            open
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-50 translate-y-4 pointer-events-none'
          }`}
          style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
          aria-label={opt.label}
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}

      {/* Labels on hover */}
      {open && options.map((opt, i) => (
        <span
          key={`label-${opt.label}`}
          className="absolute right-16 text-[11px] font-medium text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity"
          style={{
            bottom: `${(i + 1) * 47 + 14}px`,
          }}
        >
          {opt.label}
        </span>
      ))}
    </div>
  );
}

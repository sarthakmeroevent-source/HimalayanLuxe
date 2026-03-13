import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SimpleCTA from '../components/common/SimpleCTA';
import { useGallery, GalleryImage } from '../hooks/useGallery';
import { optimizeImageUrl } from '../lib/imageOptimizer';

const BATCH_SIZE = 12;

/* ── Pinterest-style card with lazy load + blur-up ── */
function PinCard({
    image,
    index,
    onClick,
}: {
    image: GalleryImage;
    index: number;
    onClick: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.01, rootMargin: '300px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const thumbUrl = optimizeImageUrl(image.image_url, { width: 400, quality: 70 });

    return (
        <div
            ref={cardRef}
            className="group relative overflow-hidden rounded-2xl break-inside-avoid cursor-pointer transform-gpu transition-all duration-500 ease-out mb-3 md:mb-4"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: visible ? `${Math.min(index % BATCH_SIZE, 8) * 40}ms` : '0ms',
            }}
            onClick={onClick}
        >
            <div className="relative w-full overflow-hidden bg-white/5 rounded-2xl">
                {visible ? (
                    <img
                        src={thumbUrl}
                        alt={image.caption || ''}
                        decoding="async"
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        className={`w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0 blur-sm'}`}
                    />
                ) : (
                    <div className="w-full aspect-[3/4] bg-white/5" />
                )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center pointer-events-none rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <ZoomIn className="text-white" size={18} />
                </div>
            </div>
        </div>
    );
}

export default function GalleryPage() {
    const { data: galleryImages, isLoading } = useGallery();
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const images = galleryImages ?? [];
    const displayedImages = images.slice(0, visibleCount);

    // Infinite scroll — load more when sentinel enters viewport
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || visibleCount >= images.length) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + BATCH_SIZE, images.length));
                }
            },
            { rootMargin: '600px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [visibleCount, images.length]);

    // Keyboard nav for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'ArrowRight') {
                setSelectedImageIndex(prev => prev !== null && prev < images.length - 1 ? prev + 1 : 0);
            } else if (e.key === 'ArrowLeft') {
                setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : images.length - 1);
            } else if (e.key === 'Escape') {
                setSelectedImageIndex(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, images.length]);

    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-32 pb-0">
                <section className="relative w-full px-4 md:px-8 py-10">
                    <div className="max-w-[1400px] mx-auto text-center">
                        <div className="h-4 w-32 mx-auto rounded bg-white/5 animate-pulse mb-6" />
                        <div className="h-12 w-64 mx-auto rounded bg-white/5 animate-pulse mb-8" />
                        {/* Skeleton pins */}
                        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="mb-3 md:mb-4 rounded-2xl bg-white/5 animate-pulse break-inside-avoid"
                                    style={{ height: `${180 + (i % 3) * 60}px` }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-4 md:px-8 py-10 z-10">
                <div className="max-w-[1400px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-3 block">
                                Glimpses
                            </span>
                            <h1 className="font-serif text-white/95 text-[clamp(32px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-4">
                                Stories in <span className="liquid-gold-text">Every Frame</span>
                            </h1>
                            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                                Where every detail tells a story of grandeur
                            </p>
                        </motion.div>
                    </div>

                    {images.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-lg">Gallery coming soon</p>
                        </div>
                    ) : (
                        <>
                            {/* Pinterest masonry grid — tighter columns, smaller cards */}
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4">
                                {displayedImages.map((image, index) => (
                                    <PinCard
                                        key={image.id}
                                        image={image}
                                        index={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                    />
                                ))}
                            </div>

                            {/* Infinite scroll sentinel */}
                            {visibleCount < images.length && (
                                <div ref={sentinelRef} className="h-10" />
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedImageIndex !== null && images[selectedImageIndex] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071a0e] p-4 md:p-8"
                            onClick={() => setSelectedImageIndex(null)}
                        >
                            <div className="absolute top-8 left-6 md:top-10 md:left-12 z-[110]">
                                <img src="/LOGO.svg" alt="Himalayan Luxe" className="h-10 md:h-12 w-auto opacity-70" />
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
                                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-gold transition-colors z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full"
                            >
                                <X size={28} />
                            </button>
                            <div className="relative flex-1 w-full flex items-center justify-center min-h-0 py-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1); }}
                                    className="absolute left-4 md:left-10 text-white/50 hover:text-gold transition-colors p-4 z-[110] bg-white/5 hover:bg-white/10 rounded-full hidden md:flex"
                                >
                                    <ChevronLeft size={36} />
                                </button>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedImageIndex}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="relative max-w-full h-full flex items-center justify-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={optimizeImageUrl(images[selectedImageIndex].image_url, { width: 1400, quality: 85 })}
                                            alt={images[selectedImageIndex].caption || ''}
                                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0); }}
                                    className="absolute right-4 md:right-10 text-white/50 hover:text-gold transition-colors p-4 z-[110] bg-white/5 hover:bg-white/10 rounded-full hidden md:flex"
                                >
                                    <ChevronRight size={36} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <div className="mt-20">
                <SimpleCTA />
            </div>
        </div>
    );
}

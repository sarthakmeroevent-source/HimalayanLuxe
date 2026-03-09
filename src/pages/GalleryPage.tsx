import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SimpleCTA from '../components/common/SimpleCTA';

const galleryImages = [
    { id: 1, url: '/gallery/wedding-1.png' },
    { id: 2, url: '/gallery/destination-1.png' },
    { id: 3, url: '/gallery/details-1.png' },
    { id: 4, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80' },
    { id: 5, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80' },
    { id: 6, url: 'https://images.unsplash.com/photo-1520854221256-11448e35922f?w=1200&q=80' },
    { id: 7, url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80' },
    { id: 8, url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80' },
    { id: 9, url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?w=1200&q=80' },
    { id: 10, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80' }
];

const INITIAL_COUNT = 6;
const LOAD_MORE_AMOUNT = 3;

export default function GalleryPage() {
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleImageError = (id: number) => {
        setFailedImages(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    const displayedImages = galleryImages.slice(0, visibleCount);
    const hasMore = visibleCount < galleryImages.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + LOAD_MORE_AMOUNT);
    };

    // Keyboard navigation for image modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            
            if (e.key === 'ArrowRight') {
                setSelectedImageIndex(prev => prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0);
            } else if (e.key === 'ArrowLeft') {
                setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1);
            } else if (e.key === 'Escape') {
                setSelectedImageIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex]);

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-6 md:px-12 py-20 z-10">
                <div className="max-w-[1700px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-6 block">
                                Visual Legacy
                            </span>
                            <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                                Captured <span className="liquid-gold-text italic font-light">Elegance</span>
                            </h1>
                            <div className="w-24 h-[1px] bg-gold/30 mx-auto mb-8"></div>
                            <p className="text-white/50 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light">
                                A curated selection of our most prestigious celebrations, 
                                where nature and luxury meet in perfect harmony.
                            </p>
                        </motion.div>
                    </div>

                    {/* Masonry Grid */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 min-h-[400px]">
                        <AnimatePresence mode='popLayout'>
                            {displayedImages.map((image, index) => {
                                const hasFailed = failedImages.has(image.id);
                                
                                return (
                                    <motion.div
                                        key={image.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ 
                                            duration: 0.8, 
                                            delay: (index % INITIAL_COUNT) * 0.05,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        className="group relative overflow-hidden rounded-[4px] break-inside-avoid shadow-2xl cursor-pointer"
                                        onClick={() => !hasFailed && setSelectedImageIndex(index)}
                                    >
                                        <div className={`relative w-full overflow-hidden bg-white/5 flex items-center justify-center ${hasFailed ? 'aspect-[4/5] md:aspect-[3/4]' : 'aspect-auto'}`}>
                                            {/* Placeholder Logo (Centered) */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                <img src="/LOGO.svg" alt="Mero Event" className="w-24 md:w-32" />
                                            </div>

                                            {!hasFailed && (
                                                <img
                                                    src={image.url}
                                                    alt="Gallery Image"
                                                    onError={() => handleImageError(image.id)}
                                                    className="w-full h-auto object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 relative z-10"
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                        
                                        {!hasFailed && (
                                            <>
                                                {/* Overlay Gradient with Zoom Icon */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center pointer-events-none z-20">
                                                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                        <ZoomIn className="text-white" size={24} />
                                                    </div>
                                                </div>

                                                {/* Glass Accent on hover */}
                                                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-700 pointer-events-none z-30"></div>
                                            </>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center mt-20"
                        >
                            <button 
                                onClick={handleLoadMore}
                                className="group relative overflow-hidden rounded-full border border-gold/30 px-12 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10"
                            >
                                <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.4em] text-gold transition-colors duration-700 group-hover:text-white">
                                    Discover More
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Fullscreen Image Modal via Portal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedImageIndex !== null && galleryImages[selectedImageIndex] && (
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const nextIndex = (selectedImageIndex > 0) ? selectedImageIndex - 1 : galleryImages.length - 1;
                                    setSelectedImageIndex(nextIndex);
                                }}
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
                                    {failedImages.has(galleryImages[selectedImageIndex].id) ? (
                                        <div className="flex flex-col items-center justify-center gap-8">
                                            <img src="/LOGO.svg" alt="Mero Event" className="w-48 opacity-20" />
                                            <p className="text-gold/40 text-[10px] tracking-[0.4em] uppercase">Visual Asset Unavailable</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={galleryImages[selectedImageIndex].url}
                                            alt="Fullscreen View"
                                            onError={() => handleImageError(galleryImages[selectedImageIndex].id)}
                                            className="max-w-full max-h-[85vh] object-contain rounded-[4px] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const nextIndex = (selectedImageIndex < galleryImages.length - 1) ? selectedImageIndex + 1 : 0;
                                    setSelectedImageIndex(nextIndex);
                                }}
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

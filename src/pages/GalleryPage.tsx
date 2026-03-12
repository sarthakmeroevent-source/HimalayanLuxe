import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SimpleCTA from '../components/common/SimpleCTA';
import { useGallery } from '../hooks/useGallery';

const INITIAL_COUNT = 6;
const LOAD_MORE_AMOUNT = 3;

export default function GalleryPage() {
    const { data: galleryImages, isLoading } = useGallery();
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const images = galleryImages ?? [];
    const displayedImages = images.slice(0, visibleCount);
    const hasMore = visibleCount < images.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + LOAD_MORE_AMOUNT);
    };

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
                <section className="relative w-full px-6 md:px-12 py-20">
                    <div className="max-w-[1700px] mx-auto text-center">
                        <div className="h-4 w-32 mx-auto rounded bg-white/5 animate-pulse mb-6" />
                        <div className="h-12 w-64 mx-auto rounded bg-white/5 animate-pulse mb-8" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-8 md:px-16 py-10 z-10">
                <div className="max-w-[1700px] mx-auto">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-3 block">
                                Glimpses
                            </span>
                            <h1 className="font-serif text-white/95 text-[clamp(28px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-4">
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
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 min-h-[400px]">
                                <AnimatePresence mode='popLayout'>
                                    {displayedImages.map((image, index) => (
                                        <motion.div
                                            key={image.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                            transition={{ duration: 0.8, delay: (index % INITIAL_COUNT) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                            className="group relative overflow-hidden rounded-[24px] break-inside-avoid shadow-2xl cursor-pointer"
                                            onClick={() => setSelectedImageIndex(index)}
                                        >
                                            <div className="relative w-full overflow-hidden bg-white/5">
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                    <img src="/LOGO.svg" alt="" className="w-24 md:w-32" />
                                                </div>
                                                <img
                                                    src={image.image_url}
                                                    alt={image.caption || ''}
                                                    className="w-full h-auto object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 relative z-10"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center pointer-events-none z-20">
                                                <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <ZoomIn className="text-white" size={24} />
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-700 pointer-events-none z-30"></div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

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
                                    </button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>

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
                                            src={images[selectedImageIndex].image_url}
                                            alt={images[selectedImageIndex].caption || ''}
                                            className="max-w-full max-h-[85vh] object-contain rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
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

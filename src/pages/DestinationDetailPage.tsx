import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useDestinationBySlug, useDestinationGallery, useDestinations } from '../hooks/useDestinations';
import { imgSize, optimizeImageUrl } from '../lib/imageOptimizer';
import { useFadeInView } from '../hooks/useFadeInView';

export default function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [destination, setDestination] = useState<{
        id: string; name: string; code: string; description: string;
        fullDescription: string; image: string; events: string;
        features: string[]; gallery: string[];
    } | null>(null);
    const [visibleImages, setVisibleImages] = useState(8);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const carouselRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const hasMoved = useRef(false);
    const startX = useRef(0);
    const scrollLeftRef = useRef(0);

    // Touch/swipe handling for modal
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const aboutRef = useFadeInView();

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!carouselRef.current) return;
        isDragging.current = true; hasMoved.current = false;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeftRef.current = carouselRef.current.scrollLeft;
    };
    const handleMouseLeave = () => { isDragging.current = false; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        if (Math.abs(x - startX.current) > 5) hasMoved.current = true;
        carouselRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current) * 1.5;
    };

    // Touch handlers for modal swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (selectedImageIndex === null || !destination) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchStartX.current - touchEndX;
        const deltaY = Math.abs(touchStartY.current - touchEndY);
        
        // Only trigger swipe if horizontal movement is greater than vertical (prevent conflict with scroll)
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                // Swipe left - next image
                setSelectedImageIndex(prev => prev !== null && prev < destination.gallery.length - 1 ? prev + 1 : 0);
            } else {
                // Swipe right - previous image
                setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : destination.gallery.length - 1);
            }
        }
    };

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const { data: dbDestination } = useDestinationBySlug(id);
    const { data: dbGallery } = useDestinationGallery(dbDestination?.id);
    const { data: allDestinations } = useDestinations();

    useEffect(() => {
        if (dbDestination) {
            setDestination({
                id: dbDestination.slug || dbDestination.id,
                name: dbDestination.name,
                code: dbDestination.code || dbDestination.name.toUpperCase(),
                description: dbDestination.description,
                fullDescription: dbDestination.full_description || dbDestination.description,
                image: dbDestination.cover_image_url,
                events: dbDestination.events || '',
                features: dbDestination.features || [],
                gallery: dbGallery?.map(g => g.image_url) || [],
            });
        } else if (dbDestination === null) {
            navigate('/destinations');
        }
        window.scrollTo(0, 0);
    }, [id, navigate, dbDestination, dbGallery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null || !destination) return;
            if (e.key === 'ArrowRight') setSelectedImageIndex(prev => prev !== null && prev < destination.gallery.length - 1 ? prev + 1 : 0);
            else if (e.key === 'ArrowLeft') setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : destination.gallery.length - 1);
            else if (e.key === 'Escape') setSelectedImageIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, destination]);

    if (!destination) return null;

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden pt-0 pb-0">
            {/* Background flares */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] gold-flare opacity-30" />
            </div>

            {/* Hero */}
            <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden -mt-32 pt-32">
                <motion.div
                    style={{ y, opacity, WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)' }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={imgSize.hero(destination.image)}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16 max-w-[1920px] mx-auto w-full pb-14 md:pb-16">
                    <div className="animate-fade-in-up">
                        {/* Breadcrumb nav - hidden on mobile */}
                        <div className="hidden md:inline-flex items-center gap-2.5 mb-6 text-[11px] tracking-[0.15em] uppercase bg-black/40 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/10">
                            <button onClick={() => navigate('/destinations')}
                                className="text-white/80 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                                Destinations
                            </button>
                            <span className="text-white/30">/</span>
                            <span className="text-gold">{destination.name}</span>
                        </div>

                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,64px)] leading-[0.95] font-normal tracking-tight mb-4">
                            {destination.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <MapPin size={14} className="text-gold/70" />
                            <span className="text-white/40 text-xs tracking-[0.2em] uppercase">{destination.code}</span>
                            <span className="w-6 h-[1px] bg-white/15" />
                            <p className="text-white/60 text-sm md:text-base font-light">
                                {destination.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info + CTA — right after hero */}
            <section className="relative z-20 w-full px-4 sm:px-8 lg:px-12 py-4 md:py-6 max-w-[1920px] mx-auto">
                <div className="max-w-4xl">
                    <div className="space-y-6">
                        {/* Description in a styled box with title inside */}
                        <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] backdrop-blur-md shadow-2xl shadow-black/20">
                            {/* Decorative corner accent */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-gold/40 rounded-tl-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-gold/40 rounded-br-2xl"></div>
                            
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/[0.02] via-transparent to-gold/[0.01] pointer-events-none"></div>
                            
                            {/* Title inside the box */}
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <h2 className="text-lg md:text-2xl font-serif text-white">About this <span className="liquid-gold-text">Destination</span></h2>
                            </div>
                            
                            <p className="text-white/70 text-sm md:text-base leading-[1.8] relative z-10">
                                {destination.fullDescription}
                            </p>
                        </div>
                        
                        {destination.features.length > 0 && (
                            <div className="flex flex-wrap gap-2.5">
                                {destination.features.map((f, i) => (
                                    <span key={i} className="flex items-center gap-2 text-[11px] text-white/70 bg-white/[0.04] px-4 py-2.5 rounded-full border border-white/[0.06] hover:border-gold/20 hover:text-gold/80 transition-all duration-300">
                                        <Sparkles size={10} className="text-gold/60" /> {f}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery preview — mobile: large + thumbnails, desktop: bento style */}
                {destination.gallery && destination.gallery.length > 0 && (
                    <div className="mt-8 max-w-full">
                        {/* Mobile Layout: Large image + small thumbnails */}
                        <div className="block md:hidden">
                            {/* Large main image */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group mb-3"
                                onClick={() => setSelectedImageIndex(0)}>
                                <img src={imgSize.galleryLarge(destination.gallery[0])} alt={`${destination.name} 1`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" decoding="async" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                            </div>
                            
                            {/* Small thumbnails row */}
                            {destination.gallery.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                    {destination.gallery.slice(1, Math.min(destination.gallery.length, 6)).map((img, idx) => (
                                        <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer group"
                                            onClick={() => setSelectedImageIndex(idx + 1)}>
                                            <img src={imgSize.galleryThumb(img)} alt={`${destination.name} ${idx + 2}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
                                        </div>
                                    ))}
                                    {destination.gallery.length > 6 && (
                                        <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                                            onClick={() => document.getElementById('full-gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                                            <span className="text-white text-sm font-medium">+{destination.gallery.length - 6}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Desktop Layout: Bento grid */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-3 grid-rows-2 gap-2" style={{ height: 'clamp(320px, 42vw, 560px)' }}>
                                {/* Large left image — spans 2 rows */}
                                <div className="row-span-2 relative cursor-pointer group overflow-hidden rounded-xl"
                                    onClick={() => setSelectedImageIndex(0)}>
                                    <img src={imgSize.galleryLarge(destination.gallery[0])} alt={`${destination.name} 1`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" decoding="async" />
                                </div>

                                {/* Top-right 2 images */}
                                {destination.gallery.slice(1, 3).map((img, idx) => (
                                    <div key={idx} className="relative cursor-pointer group overflow-hidden rounded-xl"
                                        onClick={() => setSelectedImageIndex(idx + 1)}>
                                        <img src={imgSize.galleryThumb(img)} alt={`${destination.name} ${idx + 2}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                                    </div>
                                ))}

                                {/* Bottom-right 2 images */}
                                {destination.gallery.slice(3, 5).map((img, idx) => (
                                    <div key={idx} className="relative cursor-pointer group overflow-hidden rounded-xl"
                                        onClick={() => {
                                            if (idx === 1 && destination.gallery.length > 5) {
                                                document.getElementById('full-gallery')?.scrollIntoView({ behavior: 'smooth' });
                                            } else {
                                                setSelectedImageIndex(idx + 3);
                                            }
                                        }}>
                                        <img src={imgSize.galleryThumb(img)} alt={`${destination.name} ${idx + 4}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                                        {idx === 1 && destination.gallery.length > 5 && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-2.5 rounded-xl hover:bg-black/50 transition-colors">
                                                <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="currentColor">
                                                    <circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/>
                                                    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                                                    <circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
                                                </svg>
                                                <span className="text-white text-sm font-medium tracking-wide">More images</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Full Gallery */}
            {destination.gallery && destination.gallery.length > 5 && (
                <section id="full-gallery" className="relative z-20 w-full px-4 sm:px-6 lg:px-10 pb-8 md:pb-12 max-w-[1920px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {destination.gallery.slice(5, 5 + visibleImages).map((img, idx) => {
                            const realIdx = idx + 5;
                            return (
                                <GalleryGridItem
                                    key={realIdx}
                                    img={img}
                                    idx={idx}
                                    realIdx={realIdx}
                                    totalCount={destination.gallery.length}
                                    destinationName={destination.name}
                                    onClick={() => setSelectedImageIndex(realIdx)}
                                />
                            );
                        })}
                    </div>

                    {/* Load More */}
                    {(5 + visibleImages) < destination.gallery.length && (
                        <div className="flex flex-col items-center mt-16 gap-4">
                            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
                            <button onClick={() => setVisibleImages(prev => prev + 8)}
                                className="group relative overflow-hidden rounded-full border border-gold/30 px-10 py-4 transition-all duration-500 hover:border-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                                <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.3em] text-gold transition-colors duration-500 group-hover:text-white">
                                    Discover More
                                </span>
                                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
                            </button>
                            <span className="text-white/20 text-[10px] tracking-widest">
                                {Math.min(5 + visibleImages, destination.gallery.length)} of {destination.gallery.length}
                            </span>
                        </div>
                    )}
                </section>
            )}

            {/* Fullscreen Image Modal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedImageIndex !== null && destination && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
                            onClick={() => setSelectedImageIndex(null)}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}>
                            <div className="absolute top-8 left-6 md:top-10 md:left-12 z-[110]">
                                <img src="/LOGO.svg" alt="Himalayan Luxe" className="h-10 md:h-12 w-auto opacity-70" />
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
                                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-gold transition-colors z-[110] p-3 bg-white/5 hover:bg-white/10 rounded-full">
                                <X size={28} />
                            </button>

                            {/* Mobile swipe indicator */}
                            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 md:hidden z-[110]">
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                                    <span className="text-white/60 text-xs">Swipe to navigate</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex-1 w-full flex items-center justify-center min-h-0 py-8">
                                <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : destination.gallery.length - 1); }}
                                    className="absolute left-4 md:left-10 text-white/50 hover:text-gold transition-colors p-4 z-[110] bg-white/5 hover:bg-white/10 rounded-full hidden md:flex">
                                    <ChevronLeft size={36} />
                                </button>
                                <motion.img key={selectedImageIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    src={imgSize.hero(destination.gallery[selectedImageIndex])} alt={`Gallery view ${selectedImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-black/50" 
                                    onClick={(e) => e.stopPropagation()} />
                                <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => prev !== null && prev < destination.gallery.length - 1 ? prev + 1 : 0); }}
                                    className="absolute right-4 md:right-10 text-white/50 hover:text-gold transition-colors p-4 z-[110] bg-white/5 hover:bg-white/10 rounded-full hidden md:flex">
                                    <ChevronRight size={36} />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div ref={carouselRef}
                                className="h-24 md:h-28 w-full max-w-4xl flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide shrink-0 snap-x cursor-grab active:cursor-grabbing"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                                {destination.gallery.map((thumb, idx) => (
                                    <button key={idx}
                                        onClick={(e) => { if (hasMoved.current) { e.stopPropagation(); return; } setSelectedImageIndex(idx); }}
                                        className={`relative shrink-0 snap-start h-full rounded-xl overflow-hidden transition-all duration-300 ${
                                            selectedImageIndex === idx ? 'w-24 md:w-32 border-2 border-gold' : 'w-16 md:w-20 opacity-40 hover:opacity-80'
                                        }`}>
                                        <img src={optimizeImageUrl(thumb, { width: 150, quality: 60 })} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" decoding="async" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* More Destinations — horizontal scroll carousel */}
            {allDestinations && allDestinations.length > 1 && (() => {
                const otherDestinations = allDestinations.filter(d => (d.slug || d.id) !== id);
                return (
                <section className="relative z-20 w-full py-16 md:py-16 max-w-[1920px] mx-auto">
                    <div className="flex items-center justify-between mb-6 px-4 sm:px-8 lg:px-12">
                        <div>
                            <h2 className="text-lg md:text-xl font-serif text-white">Explore More <span className="liquid-gold-text">Destinations</span></h2>
                            <p className="text-white/30 text-[11px] mt-0.5">Discover similar venues you might like</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => {
                                const el = document.getElementById('more-dest-scroll');
                                if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                            }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold/50 hover:text-gold transition-all duration-300">
                                <ArrowLeft size={14} />
                            </button>
                            <button onClick={() => {
                                const el = document.getElementById('more-dest-scroll');
                                if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                            }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold/50 hover:text-gold transition-all duration-300">
                                <ChevronRight size={14} />
                            </button>
                            <button onClick={() => navigate('/destinations')}
                                className="hidden sm:flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-white/20 text-white/60 text-[10px] md:text-xs tracking-wide hover:border-gold/50 hover:text-gold transition-all duration-300">
                                View All
                                <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                    <div id="more-dest-scroll"
                        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-12 pb-2 cursor-grab active:cursor-grabbing select-none"
                        style={{ scrollBehavior: 'smooth' }}
                        onMouseDown={(e) => {
                            const el = e.currentTarget;
                            el.style.scrollBehavior = 'auto';
                            const sX = e.pageX;
                            const sL = el.scrollLeft;
                            let moved = false;
                            const onMove = (ev: MouseEvent) => {
                                const dx = ev.pageX - sX;
                                if (Math.abs(dx) > 4) moved = true;
                                el.scrollLeft = sL - dx;
                            };
                            const onUp = () => {
                                el.style.scrollBehavior = 'smooth';
                                document.removeEventListener('mousemove', onMove);
                                document.removeEventListener('mouseup', onUp);
                                if (moved) {
                                    const blocker = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault(); };
                                    el.addEventListener('click', blocker, { capture: true, once: true });
                                    setTimeout(() => el.removeEventListener('click', blocker, { capture: true } as EventListenerOptions), 50);
                                }
                            };
                            document.addEventListener('mousemove', onMove);
                            document.addEventListener('mouseup', onUp);
                        }}>
                        {otherDestinations.map(d => (
                            <div key={d.id}
                                className="group cursor-pointer shrink-0 w-[220px] md:w-[260px]"
                                onClick={() => navigate(`/destinations/${d.slug || d.id}`)}>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-1.5">
                                    <img src={imgSize.destinationCard(d.cover_image_url)} alt={d.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" draggable={false} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                <h3 className="text-white text-xs font-medium group-hover:text-gold transition-colors truncate">{d.name}</h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <MapPin size={9} className="text-white/30" />
                                    <span className="text-white/30 text-[10px] truncate">{d.code || d.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                );
            })()}
        </div>
    );
}

/** Gallery grid item with CSS-based reveal animation */
function GalleryGridItem({ img, idx, realIdx, totalCount, destinationName, onClick }: {
    img: string; idx: number; realIdx: number; totalCount: number; destinationName: string; onClick: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.05, rootMargin: '80px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="relative aspect-[4/3] rounded-2xl md:rounded-[20px] overflow-hidden group cursor-pointer transition-all duration-500 ease-out"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: visible ? `${(idx % 3) * 60}ms` : '0ms',
            }}
            onClick={onClick}
        >
            <img
                src={imgSize.galleryThumb(img)}
                alt={`${destinationName} ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110"
                loading="lazy"
                decoding="async"
            />

            {/* Resting state */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-0" />
            <span className="absolute bottom-4 left-5 text-white/25 text-[11px] font-mono tracking-wider transition-opacity duration-500 group-hover:opacity-0">
                {String(idx + 1).padStart(2, '0')}
            </span>

            {/* Hover state */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/30 rounded-2xl md:rounded-[20px] transition-all duration-500 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-xl border border-gold/40 flex items-center justify-center translate-y-6 group-hover:translate-y-0 transition-transform duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                    <ZoomIn className="text-gold" size={22} />
                </div>
                <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase mt-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    View
                </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-white/50 text-[10px] font-mono tracking-wider">
                    {String(realIdx + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                </span>
                <span className="text-gold/60 text-[10px] tracking-[0.2em] uppercase">
                    Gallery
                </span>
            </div>
        </div>
    );
}

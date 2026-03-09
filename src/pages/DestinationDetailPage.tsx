import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Calendar, Image as ImageIcon, CheckCircle, Sparkles, Users, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { destinationsData } from '../data/destinations';
import SimpleCTA from '../components/common/SimpleCTA';

export default function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [destination, setDestination] = useState<typeof destinationsData[0] | null>(null);
    const [visibleImages, setVisibleImages] = useState(4);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Carousel drag-to-scroll variables
    const carouselRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const hasMoved = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!carouselRef.current) return;
        isDragging.current = true;
        hasMoved.current = false;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        if (Math.abs(x - startX.current) > 5) {
            hasMoved.current = true;
        }
        const walk = (x - startX.current) * 1.5;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        const found = destinationsData.find(d => d.id === id);
        if (found) {
            setDestination(found);
        } else {
            navigate('/destinations');
        }
        window.scrollTo(0, 0);
    }, [id, navigate]);

    // Keyboard navigation for image modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null || !destination) return;
            
            if (e.key === 'ArrowRight') {
                setSelectedImageIndex(prev => prev !== null && prev < destination.gallery.length - 1 ? prev + 1 : 0);
            } else if (e.key === 'ArrowLeft') {
                setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : destination.gallery.length - 1);
            } else if (e.key === 'Escape') {
                setSelectedImageIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, destination]);

    if (!destination) return null;

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden pt-0 pb-0">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] gold-flare opacity-30" />
                <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] gold-flare opacity-20" />
            </div>

            {/* Parallax Hero Section */}
            <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden -mt-32 pt-32">
                <motion.div 
                    style={{ 
                        y, 
                        opacity,
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }}
                    className="absolute inset-0 z-0 origin-center"
                >
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        src={destination.image} 
                        alt={destination.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16 max-w-[1920px] mx-auto w-full pb-20">
                    <motion.button 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-3 text-white/70 hover:text-gold transition-colors w-max uppercase tracking-[0.2em] text-[10px] md:text-xs group"
                    >
                        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                        Return to Destinations 
                    </motion.button>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] bg-gold" />
                            <span className="text-gold text-[10px] md:text-sm tracking-[0.4em] uppercase flex items-center gap-2">
                                <MapPin size={14} />
                                {destination.code}
                            </span>
                        </div>
                        <h1 className="font-serif text-white/95 text-[clamp(48px,8vw,120px)] leading-[0.9] font-normal tracking-tight mb-8">
                            {destination.name}
                        </h1>
                        <p className="text-white/80 text-lg md:text-2xl max-w-3xl font-light leading-relaxed">
                            {destination.description}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <section className="relative z-20 w-full px-4 sm:px-8 lg:px-12 py-24 max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Main Info */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="glass-card rounded-[32px] md:rounded-[48px] p-8 md:p-16 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">
                                The <span className="liquid-gold-text">Experience</span>
                            </h2>
                            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-12 font-light">
                                {destination.fullDescription}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                                <div className="p-6 md:p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-gold/20 transition-colors flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Events Hosted</h3>
                                        <p className="text-white/80 text-lg font-serif">{destination.events} successfully executed</p>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-gold/20 transition-colors flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Perfect For</h3>
                                        <p className="text-white/80 text-lg font-serif">Weddings, Retreats & Galas</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4 relative">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="sticky top-32 glass-card rounded-[32px] md:rounded-[40px] p-8 md:p-12 flex flex-col gap-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
                            
                            <div className="text-center relative z-10">
                                <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-4">Secure Your Date</p>
                                <h3 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">Begin the <br/><span className="liquid-gold-text">Planning</span></h3>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <h4 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-4">
                                    <span className="h-[1px] flex-1 bg-white/10" />
                                    Destination Highlights
                                    <span className="h-[1px] flex-1 bg-white/10" />
                                </h4>
                                <ul className="flex flex-col gap-5">
                                    {destination.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <Sparkles size={10} className="text-gold" />
                                            </div>
                                            <span className="text-white/80 text-sm md:text-base leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/10 relative z-10">
                                <button className="luxury-button w-full rounded-full flex items-center justify-center gap-3">
                                    <CheckCircle size={16} />
                                    <span>Check Availability</span>
                                </button>
                                <p className="text-center text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium mt-4">
                                    Dedicated planner responds in 24h
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Gallery Section - Extracted to span full width below the main top split */}
                {destination.gallery && destination.gallery.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-10 mt-24 lg:mt-32 max-w-[1920px] mx-auto w-full"
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-gold/50" />
                            <h2 className="text-3xl md:text-5xl font-serif text-white">Visual <span className="liquid-gold-text">Journey</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[240px] md:auto-rows-[400px]">
                            {destination.gallery.slice(0, visibleImages).map((img, idx) => {
                                // Creating a bento grid pattern out of the loop index
                                let colSpanClass = "md:col-span-12";
                                let rowSpanClass = "row-span-1";
                                
                                if (idx % 4 === 0) {
                                    colSpanClass = "md:col-span-8"; // large horizontal
                                } else if (idx % 4 === 1) {
                                    colSpanClass = "md:col-span-4"; // square
                                } else if (idx % 4 === 2) {
                                    colSpanClass = "md:col-span-5"; // small horizontal
                                } else if (idx % 4 === 3) {
                                    colSpanClass = "md:col-span-7"; // medium horizontal
                                }

                                return (
                                    <motion.div 
                                        key={idx} 
                                        whileHover={{ y: -4 }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className={`glass-card relative rounded-[24px] md:rounded-[32px] overflow-hidden group ${colSpanClass} ${rowSpanClass} cursor-pointer`}
                                        onClick={() => setSelectedImageIndex(idx)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`Gallery ${idx + 1}`} 
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <ZoomIn className="text-white" size={24} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        <AnimatePresence>
                            {visibleImages < destination.gallery.length && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center mt-10"
                                >
                                    <button 
                                        onClick={() => setVisibleImages(prev => prev + 4)}
                                        className="luxury-button rounded-full"
                                    >
                                        Load More
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>

            {/* Fullscreen Image Modal via Portal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedImageIndex !== null && destination && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071a0e]/80 backdrop-blur-md p-4 md:p-8"
                            onClick={() => setSelectedImageIndex(null)}
                        >
                            <div className="absolute top-8 left-6 md:top-10 md:left-12 z-[110]">
                                <img src="/LOGO.svg" alt="Himalayan Luxe" className="h-10 md:h-12 w-auto opacity-70" />
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
                                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-gold transition-colors z-[110] p-3 bg-white/5 hover:bg-white/10 rounded-full"
                            >
                                <X size={28} />
                            </button>

                        <div className="relative flex-1 w-full flex items-center justify-center min-h-0 py-8">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : destination.gallery.length - 1);
                                }}
                                className="absolute left-4 md:left-10 text-white/50 hover:text-gold transition-colors p-4 z-[110] bg-white/5 hover:bg-white/10 rounded-full hidden md:flex"
                            >
                                <ChevronLeft size={36} />
                            </button>

                            <motion.img
                                key={selectedImageIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                src={destination.gallery[selectedImageIndex]}
                                alt={`Gallery view ${selectedImageIndex + 1}`}
                                className="max-w-full max-h-full object-contain rounded-[16px] shadow-2xl shadow-black/50"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex(prev => prev !== null && prev < destination.gallery.length - 1 ? prev + 1 : 0);
                                }}
                                className="absolute right-4 md:right-10 text-white/50 hover:text-gold transition-colors p-4 z-[110] bg-white/5 hover:bg-white/10 rounded-full hidden md:flex"
                            >
                                <ChevronRight size={36} />
                            </button>
                        </div>
                        
                        {/* Mini Thumbnail Carousel */}
                        <div 
                            ref={carouselRef}
                            className="h-24 md:h-28 w-full max-w-4xl flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide shrink-0 snap-x cursor-grab active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {destination.gallery.map((thumb, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        if (hasMoved.current) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            return;
                                        }
                                        setSelectedImageIndex(idx);
                                    }}
                                    className={`relative shrink-0 snap-start h-full rounded-xl overflow-hidden box-border transition-all duration-300 ${
                                        selectedImageIndex === idx 
                                        ? 'w-24 md:w-32 border-2 border-gold outline-none' 
                                        : 'w-16 md:w-20 opacity-40 hover:opacity-80'
                                    }`}
                                >
                                    <img 
                                        src={thumb} 
                                        alt={`Thumbnail ${idx + 1}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {selectedImageIndex === idx && (
                                        <div className="absolute inset-0 bg-gold/10" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>,
                document.body
            )}

            <SimpleCTA
                label="Explore More"
                title="Not the Perfect Fit?"
                subtitle="We have access to exclusive venues worldwide. Let's find exactly what you're looking for."
                buttonText="View All Venues"
            />
        </div>
    );
}

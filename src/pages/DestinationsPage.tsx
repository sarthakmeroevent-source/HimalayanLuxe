import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import SimpleCTA from '../components/common/SimpleCTA';

const destinations = [
    {
        name: 'Phewa Lake',
        description: 'Serene waters reflecting the majestic Annapurna range',
        image: 'https://unsplash.com/photos/yDtB8FppNK0/download?force=true',
        events: '50+ Events'
    },
    {
        name: 'Annapurna Himalaya',
        description: 'Snow-capped peaks setting an awe-inspiring backdrop',
        image: 'https://unsplash.com/photos/PbCCnvId660/download?force=true',
        events: '40+ Events'
    },
    {
        name: 'Mustang',
        description: 'Mystical desert landscapes and ancient Tibetan culture',
        image: 'https://unsplash.com/photos/KM1QLHnxA4c/download?force=true',
        events: '35+ Events'
    },
    {
        name: 'Illam',
        description: 'Lush tea gardens rolling across misty emerald hills',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
        events: '45+ Events'
    },
    {
        name: 'Badimalika',
        description: 'Pristine meadows offering untouched natural elegance',
        image: 'https://unsplash.com/photos/LoFYw82KdjY/download?force=true',
        events: '30+ Events'
    },
    {
        name: 'Manang',
        description: 'High altitude serenity hidden within the rocky passes',
        image: 'https://unsplash.com/photos/AJ3_RYsJs94/download?force=true',
        events: '55+ Events'
    },
    {
        name: 'Solukhumbu',
        description: 'The roof of the world in the legendary Everest region',
        image: 'https://unsplash.com/photos/Q5YNyu88_RU/download?force=true',
        events: '25+ Events'
    },
    {
        name: 'Gorkha',
        description: 'Historic grandeur steeped in rich royal heritage',
        image: 'https://unsplash.com/photos/xXrH3Oj5HZI/download?force=true',
        events: '20+ Events'
    }
];

export default function DestinationsPage() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const getOrder = (index: number) => {
        if (expandedIndex === null) return index;
        if (index === expandedIndex) {
            return Math.floor(expandedIndex / 3) * 3 - 1;
        }
        return index;
    };

    useEffect(() => {
        if (expandedIndex === null) return;

        const initialScrollY = window.scrollY;

        const handleClose = () => setExpandedIndex(null);

        const handleScroll = () => {
            // Close only if user scrolls away by more than 150px
            if (Math.abs(window.scrollY - initialScrollY) > 150) {
                setExpandedIndex(null);
            }
        };

        const timer = setTimeout(() => {
            window.addEventListener('click', handleClose);
            window.addEventListener('scroll', handleScroll, { passive: true });
        }, 100);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleClose);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [expandedIndex]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-8 md:px-16 py-20">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-20"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            Explore Us
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Dream <span className="liquid-gold-text">Destinations</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            From exotic islands to historic palaces, we transform the world's most stunning locations into your perfect venue
                        </p>
                    </motion.div>

                    {/* Destinations Grid */}
                    <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {destinations.map((destination, index) => (
                            <motion.div
                                layout
                                key={destination.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: index * 0.1, layout: { duration: 1.0, type: 'spring', bounce: 0.1 } }}
                                style={{ order: getOrder(index) }}
                                className={`group relative overflow-hidden rounded-[24px] cursor-pointer ${!isMobile && expandedIndex === index
                                    ? 'md:col-span-2 lg:col-span-3 aspect-video lg:aspect-[21/9]'
                                    : 'col-span-1 aspect-[4/5]'
                                    }`}
                                onClick={(e) => {
                                    if (isMobile) {
                                        setSelectedDestination(destination);
                                    } else {
                                        e.stopPropagation();
                                        setExpandedIndex(index === expandedIndex ? null : index);
                                    }
                                }}
                            >
                                <motion.img
                                    layout="position"
                                    src={destination.image}
                                    alt={destination.name}
                                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ${!isMobile && expandedIndex === index ? 'scale-105' : 'group-hover:scale-110'
                                        }`}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${!isMobile && expandedIndex === index
                                    ? 'from-black/80 via-black/20 to-transparent opacity-100'
                                    : 'from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90'
                                    }`}></div>

                                <motion.div layout="position" className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                                    <span className="text-gold text-xs tracking-[0.3em] uppercase mb-2 block">
                                        {destination.events}
                                    </span>
                                    <h3 className={`font-serif text-white transition-all duration-500 ${!isMobile && expandedIndex === index ? 'text-4xl lg:text-5xl mb-4' : 'text-2xl mb-2'}`}>
                                        {destination.name}
                                    </h3>
                                    <p className={`text-white/80 transition-all duration-500 ${!isMobile && expandedIndex === index ? 'text-lg max-w-2xl' : 'text-sm text-white/60'}`}>
                                        {destination.description}
                                    </p>

                                    <AnimatePresence>
                                        {!isMobile && expandedIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <button className="flex items-center gap-3 px-6 py-3 rounded-full border border-gold/40 text-gold text-xs uppercase tracking-widest hover:bg-gold/10 transition-colors pointer-events-auto">
                                                    Plan an event here
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </section>


            {/* Mobile Modal Overlay */}
            <AnimatePresence>
                {selectedDestination && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedDestination(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm overflow-hidden bg-emerald-deep border border-gold/20 rounded-[32px] shadow-2xl flex flex-col max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedDestination(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/80 transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative aspect-[4/3] w-full shrink-0">
                                <img
                                    src={selectedDestination.image}
                                    alt={selectedDestination.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent opacity-100"></div>
                            </div>

                            <div className="p-8 pt-4 flex flex-col overflow-y-auto">
                                <span className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2 block">
                                    {selectedDestination.events}
                                </span>
                                <h3 className="font-serif text-white/95 text-3xl mb-4">
                                    {selectedDestination.name}
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-8">
                                    {selectedDestination.description}
                                </p>

                                <button className="w-full py-4 rounded-full border border-gold/30 hover:border-gold bg-gold/5 transition-colors text-gold text-xs uppercase tracking-widest font-medium">
                                    Plan Event Here
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SimpleCTA
                label="Custom Destinations"
                title="Can't Find Your Dream Location?"
                subtitle="We specialize in creating extraordinary events anywhere in the world. Tell us your vision, and we'll make it a reality."
                buttonText="Discuss Your Vision"
            />
        </div>
    );
}

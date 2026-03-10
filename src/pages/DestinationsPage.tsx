import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SimpleCTA from '../components/common/SimpleCTA';
import { useDestinations } from '../hooks/useDestinations';

/**
 * Map DB destinations to the shape the UI expects
 */
function mapDestinations(dbData: ReturnType<typeof useDestinations>['data']) {
    if (!dbData || dbData.length === 0) return [];
    return dbData.map(d => ({
        id: d.slug || d.id,
        name: d.name,
        code: d.code || d.name.toUpperCase(),
        description: d.description,
        fullDescription: d.full_description || d.description,
        image: d.cover_image_url,
        events: d.events || '',
        features: d.features || [],
        gallery: [] as string[], // gallery loaded on detail page
    }));
}

type DestinationDisplay = {
    id: string;
    name: string;
    code: string;
    description: string;
    fullDescription: string;
    image: string;
    events: string;
    features: string[];
    gallery: string[];
};

/**
 * Reorder logic: selected card moves to the front of its row,
 * remaining row-mates shift down. Other rows stay untouched.
 */
function buildDisplayOrder(
    items: DestinationDisplay[],
    selectedIndex: number | null,
    columns: number
) {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= items.length) {
        return items;
    }
    const selectedRow = Math.floor(selectedIndex / columns);
    const rowStart = selectedRow * columns;
    const rowEnd = Math.min(rowStart + columns, items.length);
    const before = items.slice(0, rowStart);
    const selected = items[selectedIndex];
    const rowRemainder = items
        .slice(rowStart, rowEnd)
        .filter((_, i) => rowStart + i !== selectedIndex);
    const after = items.slice(rowEnd);
    return [...before, selected, ...rowRemainder, ...after];
}

/* ─────────────────────────── Collapsed Card ─────────────────────────── */
function CollapsedCard({
    destination,
    onClick,
    index,
}: {
    destination: DestinationDisplay;
    onClick: () => void;
    index: number;
}) {
    return (
        <motion.li
            layout
            key={destination.id}
            onClick={onClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                opacity: { duration: 0.6, delay: index * 0.08 },
                y: { duration: 0.6, delay: index * 0.08 },
                layout: { type: 'spring', stiffness: 200, damping: 30, mass: 0.8 },
            }}
            className="group relative overflow-hidden rounded-[24px] cursor-pointer aspect-[4/5] border border-gold/10 hover:border-gold/40 list-none transform-gpu"
            style={{ willChange: 'transform' }}
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
            </div>

            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 pointer-events-none">
                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
                    {destination.events}
                </span>
                <h3 className="font-serif text-white text-3xl mb-3 group-hover:text-gold transition-colors duration-400">
                    {destination.name}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2">
                    {destination.description}
                </p>
            </div>
        </motion.li>
    );
}

/* ─────────────────────────── Expanded Card ─────────────────────────── */
function ExpandedCard({
    destination,
    onClose,
}: {
    destination: DestinationDisplay;
    onClose: () => void;
}) {
    const expandedRef = useRef<HTMLLIElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!expandedRef.current) return;
            const rect = expandedRef.current.getBoundingClientRect();
            const navbarOffset = 120;
            const targetTop = window.scrollY + rect.top - navbarOffset;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const goToDetail = () => navigate(`/destinations/${destination.id}`);

    return (
        <motion.li
            ref={expandedRef}
            layout
            key={destination.id}
            onClick={goToDetail}
            transition={{ layout: { type: 'spring', stiffness: 200, damping: 30, mass: 0.8 } }}
            className="relative overflow-hidden rounded-[28px] cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 border border-gold/30 list-none transform-gpu"
            style={{ zIndex: 10, willChange: 'transform' }}
        >
            {/* Background image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover scale-[1.02] transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between p-8 md:p-12 lg:p-16 min-h-[420px] md:min-h-[520px] lg:min-h-[580px]">
                {/* Left: Text content */}
                <div className="flex flex-col md:w-3/5 lg:w-2/3">
                    <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block">
                        {destination.events}
                    </span>
                    <h3 className="font-serif text-gold/90 text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-4">
                        {destination.name}
                    </h3>
                    <p className="text-white/80 text-base md:text-lg font-medium mb-6">
                        {destination.description}
                    </p>

                    {/* Full description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-2xl"
                    >
                        {destination.fullDescription}
                    </motion.p>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="flex flex-wrap gap-2 md:gap-3"
                    >
                        {destination.features.map((feature: string) => (
                            <span
                                key={feature}
                                className="flex items-center gap-2 text-[11px] md:text-xs text-white bg-white/10 px-4 py-2 rounded-full border border-white/15 hover:bg-white/20 transition-colors duration-200"
                            >
                                <Sparkles size={12} className="text-gold" />
                                {feature}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Right: Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-8 md:mt-0 md:pl-8 shrink-0 flex flex-col gap-3 md:w-56"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetail();
                        }}
                        className="w-full py-3.5 px-6 rounded-full bg-gold hover:bg-[#F2D06B] transition-colors duration-200 text-black text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
                    >
                        <MapPin size={16} />
                        Plan Event
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-full py-3.5 px-6 rounded-full border border-white/30 hover:bg-white/10 transition-colors duration-200 text-white text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
                    >
                        <X size={16} />
                        Close
                    </button>
                </motion.div>
            </div>
        </motion.li>
    );
}

/* ─────────────────────────── Main Page ─────────────────────────── */
export default function DestinationsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [columns, setColumns] = useState(3);
    const { data: dbDestinations, isLoading, error, refetch } = useDestinations();
    const destinations = mapDestinations(dbDestinations);

    useEffect(() => {
        const updateCols = () => {
            if (window.innerWidth < 768) setColumns(1);
            else if (window.innerWidth < 1024) setColumns(2);
            else setColumns(3);
        };
        updateCols();
        window.addEventListener('resize', updateCols);
        return () => window.removeEventListener('resize', updateCols);
    }, []);

    const selectedOriginalIndex = expandedId !== null
        ? destinations.findIndex(d => d.id === expandedId)
        : null;

    const displayOrder = useMemo(
        () => buildDisplayOrder(destinations, selectedOriginalIndex, columns),
        [destinations, selectedOriginalIndex, columns]
    );

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-8 md:px-16 py-20 z-10">
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

                    {/* Grid — no layout animation on the container itself */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="aspect-[4/5] rounded-[24px] bg-white/5 animate-pulse border border-gold/10" />
                            ))}
                        </div>
                    ) : destinations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 mb-20">
                            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
                                {error ? 'Failed to load destinations' : 'No destinations available'}
                            </p>
                            {error && (
                                <button onClick={() => refetch()}
                                    className="px-6 py-2 rounded-full border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold/10 transition-colors">
                                    Try Again
                                </button>
                            )}
                        </div>
                    ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        <AnimatePresence mode="sync">
                            {displayOrder.map((destination, renderIndex) => {
                                const isExpanded = destination.id === expandedId;

                                if (isExpanded) {
                                    return (
                                        <ExpandedCard
                                            key={destination.id}
                                            destination={destination}
                                            onClose={() => setExpandedId(null)}
                                        />
                                    );
                                }

                                return (
                                    <CollapsedCard
                                        key={destination.id}
                                        destination={destination}
                                        onClick={() => setExpandedId(destination.id)}
                                        index={renderIndex}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                    )}
                </div>
            </section>

            <SimpleCTA
                label="Custom Destinations"
                title="Can't Find Your Dream Location?"
                subtitle="We specialize in creating extraordinary events anywhere in the world. Tell us your vision, and we'll make it a reality."
                buttonText="Discuss Your Vision"
            />
        </div>
    );
}

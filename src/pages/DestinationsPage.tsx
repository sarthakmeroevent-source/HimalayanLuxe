import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Sparkles, X } from 'lucide-react';
import SimpleCTA from '../components/common/SimpleCTA';

const destinations = [
    {
        id: 'phewa-lake',
        name: 'Phewa Lake',
        description: 'Serene waters reflecting the majestic Annapurna range',
        fullDescription: 'Experience the magic of Phewa Lake, where the reflection of Mount Machhapuchhre creates a picture-perfect backdrop. Ideal for both intimate ceremonies and grand celebrations, this location offers a blend of natural beauty and cultural richness.',
        image: 'https://images.unsplash.com/photo-1745677617593-75a5bbd1a8f7?auto=format&fit=crop&w=1200&q=80',
        events: '50+ Events',
        features: ['Lakeside Venues', 'Boat Access', 'Mountain Views']
    },
    {
        id: 'annapurna',
        name: 'Annapurna Himalaya',
        description: 'Snow-capped peaks setting an awe-inspiring backdrop',
        fullDescription: 'Immerse yourself in the breathtaking majesty of the Annapurna range. Our exclusive high-altitude venues provide unparalleled panoramic views, creating an unforgettable setting for your most significant moments.',
        image: 'https://images.unsplash.com/photo-1640876522637-9432f175581f?auto=format&fit=crop&w=1200&q=80',
        events: '40+ Events',
        features: ['Panoramic Views', 'Luxury Camps', 'Helicopter Access']
    },
    {
        id: 'mustang',
        name: 'Mustang',
        description: 'Mystical desert landscapes and ancient Tibetan culture',
        fullDescription: 'Discover the ancient and mystical kingdom of Mustang. Its unique desert landscape, striking red cliffs, and profound cultural heritage offer an extraordinarily dramatic and deeply spiritual setting for any celebration.',
        image: 'https://images.unsplash.com/photo-1592731056711-b3101e30584b?auto=format&fit=crop&w=1200&q=80',
        events: '35+ Events',
        features: ['Ancient Monasteries', 'Desert Landscapes', 'Cultural Immersion']
    },
    {
        id: 'illam',
        name: 'Illam',
        description: 'Lush tea gardens rolling across misty emerald hills',
        fullDescription: 'Step into the verdant paradise of Illam, famous for its rolling tea gardens and cool, misty climate. This serene and exceptionally green region provides a refreshing and elegant backdrop for daytime events and retreats.',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
        events: '45+ Events',
        features: ['Tea Garden Estates', 'Misty Mornings', 'Boutique Resorts']
    },
    {
        id: 'badimalika',
        name: 'Badimalika',
        description: 'Pristine meadows offering untouched natural elegance',
        fullDescription: 'A hidden jewel of the far-west, Badimalika boasts expansive alpine meadows that seemingly touch the sky. It represents the ultimate exclusive experience, pristine, untouched, and utterly magnificent.',
        image: 'https://images.unsplash.com/photo-1673129864790-0fa848c4720e?auto=format&fit=crop&w=1200&q=80',
        events: '30+ Events',
        features: ['Alpine Meadows', 'Remote Exclusivity', 'Wildflower Blooms']
    },
    {
        id: 'manang',
        name: 'Manang',
        description: 'High altitude serenity hidden within the rocky passes',
        fullDescription: 'Nestled amidst the spectacular Himalayas, Manang offers a raw and powerful landscape. Its stark beauty, traditional stone architecture, and proximity to glacial lakes make it an adventurous yet deeply romantic destination.',
        image: 'https://images.unsplash.com/photo-1733899740934-95dd57fc113b?auto=format&fit=crop&w=1200&q=80',
        events: '55+ Events',
        features: ['Glacial Lakes', 'Stone Architecture', 'Adventure Focus']
    },
    {
        id: 'solukhumbu',
        name: 'Solukhumbu',
        description: 'The roof of the world in the legendary Everest region',
        fullDescription: 'Host your event in the shadow of Mount Everest. Solukhumbu is the epitome of grandeur and triumph. Our bespoke services ensure that even in this remote and soaring environment, luxury and perfection are guaranteed.',
        image: 'https://images.unsplash.com/photo-1596221897845-b8ebacc61293?auto=format&fit=crop&w=1200&q=80',
        events: '25+ Events',
        features: ['Everest Views', 'Sherpa Culture', 'Luxury Lodges']
    },
    {
        id: 'gorkha',
        name: 'Gorkha',
        description: 'Historic grandeur steeped in rich royal heritage',
        fullDescription: 'Celebrate amidst the historical significance and architectural splendor of Gorkha. The dramatic hilltop palaces and ancient temples provide a regal and culturally profound atmosphere for grand, traditional ceremonies.',
        image: 'https://images.unsplash.com/photo-1680112365184-dc7dfb5db6ed?auto=format&fit=crop&w=1200&q=80',
        events: '20+ Events',
        features: ['Historic Forts', 'Palace Courtyards', 'Royal Heritage']
    },
    {
        id: 'lumbini',
        name: 'Lumbini',
        description: 'The birthplace of Buddha, radiating profound peace',
        fullDescription: 'Find tranquility and spiritual resonance in Lumbini. The sprawling sacred gardens, magnificent monasteries, and profound history make this an unparalleled destination for wellness retreats and serene, mindful ceremonies.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
        events: '60+ Events',
        features: ['Sacred Gardens', 'Monastic Zones', 'Spiritual Ambiance']
    }
];

/**
 * Reorder logic:
 *
 * Original (cols=3):   1 2 3 | 4 5 6 | 7 8 9
 *
 * Click 5 (row 1):
 *   - Rows before row 1 stay:  [1, 2, 3]
 *   - Selected card:           [5]          ← full-width
 *   - Rest of row 1:           [4, 6]       ← pushed down into next row
 *   - Rows after row 1 stay:   [7, 8, 9]
 *   Render: 1 2 3 | 5_expanded | 4 6 7 | 8 9
 *
 * This works for any number of rows and any column count.
 */
function buildDisplayOrder(
    items: typeof destinations,
    selectedIndex: number | null,
    columns: number
) {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= items.length) {
        return items;
    }

    const selectedRow = Math.floor(selectedIndex / columns);
    const rowStart = selectedRow * columns;
    const rowEnd = Math.min(rowStart + columns, items.length);

    // 1. Cards in rows BEFORE the selected row — unchanged
    const before = items.slice(0, rowStart);

    // 2. The selected card itself
    const selected = items[selectedIndex];

    // 3. Remaining cards from the same row (excluding the selected)
    const rowRemainder = items
        .slice(rowStart, rowEnd)
        .filter((_, i) => rowStart + i !== selectedIndex);

    // 4. Cards in rows AFTER the selected row — unchanged
    const after = items.slice(rowEnd);

    return [...before, selected, ...rowRemainder, ...after];
}

/* ─────────────────────────── Collapsed Card ─────────────────────────── */
function CollapsedCard({
    destination,
    onClick,
    index,
}: {
    destination: typeof destinations[0];
    onClick: () => void;
    index: number;
}) {
    return (
        <motion.li
            layout
            layoutId={`card-${destination.id}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                opacity: { duration: 0.7, delay: index * 0.06 },
                y: { duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
                layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group relative overflow-hidden rounded-[24px] cursor-pointer aspect-[4/5] border border-gold/10 hover:border-gold/40 transition-colors list-none"
        >
            <motion.div layoutId={`img-${destination.id}`} className="absolute inset-0 z-0">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />
            </motion.div>

            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 pointer-events-none">
                <motion.span layoutId={`ev-${destination.id}`} className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
                    {destination.events}
                </motion.span>
                <motion.h3 layoutId={`ttl-${destination.id}`} className="font-serif text-white text-3xl mb-3 group-hover:text-gold transition-colors duration-300">
                    {destination.name}
                </motion.h3>
                <motion.p layoutId={`dsc-${destination.id}`} className="text-white/60 text-sm line-clamp-2">
                    {destination.description}
                </motion.p>
            </div>
        </motion.li>
    );
}

/* ─────────────────────────── Expanded Card ─────────────────────────── */
function ExpandedCard({
    destination,
    onClose,
}: {
    destination: typeof destinations[0];
    onClose: () => void;
}) {
    const expandedRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.li
            ref={expandedRef}
            layout
            layoutId={`card-${destination.id}`}
            onClick={onClose}
            transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            className="relative overflow-hidden rounded-[28px] cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 border border-gold/30 list-none"
            style={{ zIndex: 10 }}
        >
            {/* Background image */}
            <motion.div layoutId={`img-${destination.id}`} className="absolute inset-0 z-0">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between p-8 md:p-12 lg:p-16 min-h-[320px] md:min-h-[400px] lg:min-h-[440px]">
                {/* Left: Text content */}
                <div className="flex flex-col md:w-3/5 lg:w-2/3">
                    <motion.span layoutId={`ev-${destination.id}`} className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block">
                        {destination.events}
                    </motion.span>
                    <motion.h3 layoutId={`ttl-${destination.id}`} className="font-serif text-gold/90 text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-4">
                        {destination.name}
                    </motion.h3>
                    <motion.p layoutId={`dsc-${destination.id}`} className="text-white/80 text-base md:text-lg font-medium mb-6">
                        {destination.description}
                    </motion.p>

                    {/* Extra details fade in */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                            {destination.fullDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {destination.features.map(feature => (
                                <span key={feature} className="flex items-center gap-2 text-[11px] md:text-xs text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15 hover:bg-white/20 transition-colors">
                                    <Sparkles size={12} className="text-gold" />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-8 md:mt-0 md:pl-8 shrink-0 flex flex-col gap-3 md:w-56"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="w-full py-3.5 px-6 rounded-full bg-gold hover:bg-[#F2D06B] transition-colors text-black text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
                    >
                        <MapPin size={16} />
                        Plan Event
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-full py-3.5 px-6 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-white text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
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

    // Find the original index of the selected card
    const selectedOriginalIndex = expandedId !== null
        ? destinations.findIndex(d => d.id === expandedId)
        : null;

    // Build the reordered list based on which card is expanded
    const displayOrder = useMemo(
        () => buildDisplayOrder(destinations, selectedOriginalIndex, columns),
        [selectedOriginalIndex, columns]
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

                    {/* Grid */}
                    <LayoutGroup>
                        <motion.ul layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            <AnimatePresence mode="popLayout">
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
                        </motion.ul>
                    </LayoutGroup>
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

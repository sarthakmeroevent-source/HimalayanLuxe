import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

/* ─────────────────────────── Destination Card ─────────────────────────── */
function DestinationCard({
    destination,
    index,
}: {
    destination: DestinationDisplay;
    index: number;
}) {
    const navigate = useNavigate();

    return (
        <motion.li
            layout
            key={destination.id}
            onClick={() => navigate(`/destinations/${destination.id}`)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                opacity: { duration: 0.6, delay: index * 0.08 },
                y: { duration: 0.6, delay: index * 0.08 },
            }}
            className="group relative overflow-hidden rounded-[24px] cursor-pointer aspect-[3/4] border border-gold/10 hover:border-gold/40 list-none transform-gpu"
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

/* ─────────────────────────── Main Page ─────────────────────────── */
export default function DestinationsPage() {
    const { data: dbDestinations, isLoading, error, refetch } = useDestinations();
    const destinations = mapDestinations(dbDestinations);

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-8 md:px-16 py-10 z-10">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-16 md:mb-[104px]"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-3 block">
                            Our Venues
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-4">
                            Dream <span className="liquid-gold-text">Destinations</span>
                        </h1>
                        <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                            Handpicked locations crafted for extraordinary celebrations
                        </p>
                    </motion.div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-[24px] bg-white/5 animate-pulse border border-gold/10" />
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
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
                        {destinations.map((destination, index) => (
                            <DestinationCard
                                key={destination.id}
                                destination={destination}
                                index={index}
                            />
                        ))}
                    </ul>
                    )}
                </div>
            </section>
        </div>
    );
}

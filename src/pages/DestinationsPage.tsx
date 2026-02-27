import { motion } from 'framer-motion';
import SimpleCTA from '../components/common/SimpleCTA';

const destinations = [
    {
        name: 'Udaipur, India',
        description: 'The City of Lakes offers palatial venues and royal grandeur',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
        events: '50+ Events'
    },
    {
        name: 'Tuscany, Italy',
        description: 'Rolling hills and historic villas create timeless romance',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80',
        events: '40+ Events'
    },
    {
        name: 'Santorini, Greece',
        description: 'Whitewashed beauty overlooking the Aegean Sea',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
        events: '35+ Events'
    },
    {
        name: 'Bali, Indonesia',
        description: 'Tropical paradise with spiritual serenity',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
        events: '45+ Events'
    },
    {
        name: 'Paris, France',
        description: 'The city of love and timeless elegance',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
        events: '30+ Events'
    },
    {
        name: 'Dubai, UAE',
        description: 'Modern luxury meets Arabian hospitality',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
        events: '55+ Events'
    },
    {
        name: 'Maldives',
        description: 'Overwater luxury in pristine paradise',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
        events: '25+ Events'
    },
    {
        name: 'Swiss Alps',
        description: 'Mountain majesty and alpine elegance',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80',
        events: '20+ Events'
    }
];

export default function DestinationsPage() {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {destinations.map((destination, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-[24px] aspect-[4/5] cursor-pointer"
                            >
                                <img 
                                    src={destination.image} 
                                    alt={destination.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <span className="text-gold text-xs tracking-[0.3em] uppercase mb-2 block">
                                        {destination.events}
                                    </span>
                                    <h3 className="font-serif text-white text-2xl mb-2">
                                        {destination.name}
                                    </h3>
                                    <p className="text-white/60 text-sm">
                                        {destination.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1 }}
                        className="glass-card p-12 rounded-[32px] text-center"
                    >
                        <h3 className="font-serif text-white/95 text-3xl md:text-4xl mb-6">
                            Can't Find Your Dream Location?
                        </h3>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
                            We specialize in creating extraordinary events anywhere in the world. 
                            Tell us your vision, and we'll make it a reality.
                        </p>
                        <button className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10">
                            <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                Discuss Your Vision
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>
            <SimpleCTA />
        </div>
    );
}

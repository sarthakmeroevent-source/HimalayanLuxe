import { motion } from 'framer-motion';
import SimpleCTA from '../components/common/SimpleCTA';

const services = [
    {
        title: 'Wedding Planning',
        subtitle: 'Complete Orchestration',
        description: 'From intimate ceremonies to grand celebrations, we handle every detail with precision and artistry.',
        features: [
            'Venue Selection & Design',
            'Vendor Coordination',
            'Timeline Management',
            'Guest Experience',
            'Day-of Coordination'
        ],
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80'
    },
    {
        title: 'Destination Events',
        subtitle: 'Global Experiences',
        description: 'Transform exotic locations into unforgettable venues with our worldwide network and expertise.',
        features: [
            'Location Scouting',
            'Travel Coordination',
            'Accommodation Management',
            'Cultural Integration',
            'Logistics Planning'
        ],
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80'
    },
    {
        title: 'Design & Decor',
        subtitle: 'Visual Masterpieces',
        description: 'Our design team creates immersive environments that tell your unique story.',
        features: [
            'Concept Development',
            'Floral Architecture',
            'Lighting Design',
            'Custom Installations',
            'Spatial Planning'
        ],
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80'
    },
    {
        title: 'Entertainment',
        subtitle: 'Curated Performances',
        description: 'From international artists to intimate ensembles, we curate entertainment that captivates.',
        features: [
            'Artist Booking',
            'Performance Curation',
            'Technical Production',
            'Sound & Lighting',
            'Stage Management'
        ],
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80'
    }
];

export default function ServicesDetailPage() {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <section className="relative w-full px-8 md:px-16 py-20">
                <div className="max-w-[1400px] mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-20"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            What We Offer
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Our <span className="liquid-gold-text">Services</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            Comprehensive luxury event services tailored to your vision
                        </p>
                    </motion.div>

                    {/* Services List */}
                    <div className="space-y-32">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className={`grid md:grid-cols-2 gap-12 items-center ${
                                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                    <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-4 block">
                                        {service.subtitle}
                                    </span>
                                    <h2 className="font-serif text-white/95 text-4xl md:text-5xl mb-6">
                                        {service.title}
                                    </h2>
                                    <p className="text-white/60 text-lg leading-relaxed mb-8">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white/70">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10">
                                        <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                            Learn More
                                        </span>
                                    </button>
                                </div>
                                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden glass-card p-3">
                                        <img 
                                            src={service.image} 
                                            alt={service.title}
                                            className="w-full h-full object-cover rounded-[28px]"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <SimpleCTA />
        </div>
    );
}

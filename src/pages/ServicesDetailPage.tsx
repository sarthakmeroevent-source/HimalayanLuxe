import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import SimpleCTA from '../components/common/SimpleCTA';

const services = [
    {
        id: '01',
        title: 'Bespoke Weddings',
        subtitle: "GRAND NUPTIALS & PALATIAL CEREMONIES",
        description: 'Palatial transformations executed with microscopic precision. We don\'t just plan weddings; we architect legends, ensuring every glance, every petal, and every note resonates with your family\'s legacy.',
        features: [
            'Architectural Venue Transformation',
            'Bespoke Scenography Design',
            'Global Logistics Orchestration',
            'Discerning Vendor Curation',
            'Full Concierge Guest Experience'
        ],
        image: '/experience_image.png',
        quote: '"To plan a wedding here is to curate a legacy of emotion and grandeur."'
    },
    {
        id: '02',
        title: 'Destination Weddings',
        subtitle: 'GLOBAL NUPTIALS REDEFINED',
        description: "From the peaks of the Himalayas to the world's most secluded shores, we sculpt worlds that seamlessly blend nature and luxury. Each location becomes a living canvas for your celebration.",
        features: [
            'Exclusive Location Scouting',
            'Global Charter Management',
            'Destination Protocol Handling',
            'Luxury Accommodation Buyouts',
            'Bespoke Excursion Design'
        ],
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1600',
        quote: '"The horizon is our canvas; your journey is the masterpiece."'
    },
    {
        id: '03',
        title: 'Luxury Events',
        subtitle: 'EXTRAORDINARY GALAS & PRIVATE PARTIES',
        description: 'Bespoke event architecture curated by internationally acclaimed artists. We create immersive environments that engage every sense, where every texture and light is considered with absolute precision.',
        features: [
            'Artistic Table Scenography',
            'Lighting & Atmospheric Design',
            'Custom Furniture Fabrication',
            'Textile & Surface Engineering',
            'World-Class Catering Management'
        ],
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80',
        quote: '"Design is not just what you see, but the atmosphere you breathe."'
    },
    {
        id: '04',
        title: 'Corporate Seminars',
        subtitle: 'ELITE EXECUTIVE GATHERINGS',
        description: 'From global summits to intimate executive retreats. We curate journeys through high-end knowledge and sound, ensuring the rhythm of your corporate gathering is both productive and prestigious.',
        features: [
            'Executive Protocol Direction',
            'Immersive Presentation Tech',
            'Bespoke Sound Sculpting',
            'Gourmet Networking Lounges',
            'Seamless Logistics Orchestration'
        ],
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1600',
        quote: '"Precision and prestige meet in every boardroom and banquet hall."'
    }
];

export default function ServicesDetailPage() {
    const [searchParams] = useSearchParams();
    const activeServiceId = searchParams.get('service');

    // Scroll to top on mount, then scroll to specific service if provided
    useEffect(() => {
        // Immediate scroll to top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Additional resets to handle Lenis
        const immediateTimers = [
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
            }, 10),
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
            }, 50)
        ];
        
        // If there's a service ID, scroll to it after page loads
        if (activeServiceId) {
            const timer = setTimeout(() => {
                const element = document.getElementById(activeServiceId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
            return () => {
                immediateTimers.forEach(t => clearTimeout(t));
                clearTimeout(timer);
            };
        }

        return () => immediateTimers.forEach(t => clearTimeout(t));
    }, [activeServiceId]);

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            {/* Header Section */}
            <section className="relative w-full px-8 md:px-16 pt-20 pb-12 flex flex-col items-center justify-center">
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            The Masterlist
                        </span>
                        <h1 className="font-serif text-white text-[clamp(40px,5vw,80px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Our <span className="liquid-gold-text italic">Services</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            Crafting palatial transformations executed with microscopic precision and grand vision.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Showcase - Full Width Container */}
            <div className="w-full px-6 md:px-12 lg:px-16 pb-32">
                {services.map((service, index) => (
                    <motion.section 
                        key={service.id || index}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
                    >
                        {/* Service Media: Takes up 6 columns */}
                        <div className={`lg:col-span-6 relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <div className={`relative aspect-[10/12] rounded-[32px] md:rounded-[48px] overflow-hidden group max-w-[85%] ${index % 2 === 0 ? 'lg:ml-auto lg:mr-0' : 'lg:mr-auto lg:ml-0'}`}>
                                <motion.img 
                                    initial={{ scale: 1.2 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    src={service.image} 
                                    alt={service.title} 
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#02140F]/80 via-transparent to-transparent opacity-60" />
                            </div>
                        </div>

                        {/* Service Content: Takes up 6 columns */}
                        <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <div className={`relative z-10 max-w-[85%] ${index % 2 === 0 ? 'lg:mr-auto lg:ml-0' : 'lg:ml-auto lg:mr-0'}`}>
                                <span className="liquid-gold-text text-[10px] tracking-[0.4em] uppercase font-bold mb-6 block">
                                    {service.subtitle}
                                </span>
                                <h2 className="font-serif text-white text-[clamp(28px,4vw,56px)] leading-[1.1] mb-8">
                                    {service.title}
                                </h2>
                                <p className="text-white/50 text-base md:text-xl leading-relaxed mb-10 font-light tracking-wide italic">
                                    {service.description}
                                </p>
                                
                                <ul className="grid grid-cols-1 gap-4 mb-12">
                                    {service.features.map((feature, fIndex) => (
                                        <motion.li 
                                            key={fIndex}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * fIndex }}
                                            className="flex items-center gap-4 group/item"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover/item:bg-gold transition-colors shadow-[0_0_8px_rgba(212,175,55,0.3)]" />
                                            <span className="text-white/40 text-xs md:text-sm tracking-[0.1em] uppercase group-hover/item:text-white/70 transition-colors">
                                                {feature}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>

                                <div className="pt-8 border-t border-white/5">
                                    <p className="text-gold/60 font-serif italic text-lg leading-relaxed">
                                        {service.quote}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                ))}
            </div>

            <SimpleCTA />
        </div>
    );
}

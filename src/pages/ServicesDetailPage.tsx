import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import SimpleCTA from '../components/common/SimpleCTA';
import { useServices } from '../hooks/useServices';

export default function ServicesDetailPage() {
    const [searchParams] = useSearchParams();
    const activeServiceId = searchParams.get('service');
    const { data: dbServices, isLoading, error } = useServices();

    const services = useMemo(() => {
        if (!dbServices) return [];
        return dbServices.map(s => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            description: s.description,
            features: s.features || [],
            image: s.image_url,
        }));
    }, [dbServices]);

    // Scroll to top on mount, then scroll to specific service if provided
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const immediateTimers = [
            setTimeout(() => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; }, 10),
            setTimeout(() => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; }, 50)
        ];
        if (activeServiceId) {
            const timer = setTimeout(() => {
                const element = document.getElementById(activeServiceId);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
            return () => { immediateTimers.forEach(t => clearTimeout(t)); clearTimeout(timer); };
        }
        return () => immediateTimers.forEach(t => clearTimeout(t));
    }, [activeServiceId]);

    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-32 pb-0">
                <section className="relative w-full px-8 md:px-16 py-20">
                    <div className="max-w-[1400px] mx-auto text-center">
                        <div className="h-4 w-32 mx-auto rounded bg-white/5 animate-pulse mb-6" />
                        <div className="h-12 w-64 mx-auto rounded bg-white/5 animate-pulse mb-8" />
                        <div className="h-6 w-96 mx-auto rounded bg-white/5 animate-pulse" />
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen pt-32 pb-0 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/60 mb-4">Failed to load services</p>
                    <button onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-full border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-8 md:px-16 py-10 flex flex-col items-center justify-center">
                <div className="max-w-[1600px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-10"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-3 block">
                            What We Do
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(28px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-4">
                            Our <span className="liquid-gold-text">Services</span>
                        </h1>
                        <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                            Precision-crafted experiences designed for the extraordinary
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="w-full px-6 md:px-12 lg:px-16 pb-32">
                {services.map((service, index) => (
                    <motion.section
                        key={service.id}
                        id={service.id}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
                    >
                        <div className={`lg:col-span-6 relative flex justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
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

                        <div className={`lg:col-span-6 flex justify-center lg:block ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <div className={`relative z-10 max-w-[85%] text-center lg:text-left ${index % 2 === 0 ? 'lg:mr-auto lg:ml-0' : 'lg:ml-auto lg:mr-0'}`}>
                                <span className="liquid-gold-text text-[10px] tracking-[0.4em] uppercase font-bold mb-6 block">
                                    {service.subtitle}
                                </span>
                                <h2 className="font-serif text-white text-[clamp(28px,4vw,56px)] leading-[1.1] mb-8">
                                    {service.title}
                                </h2>
                                <p className="text-white/50 text-base md:text-xl leading-relaxed mb-10 font-light tracking-wide italic">
                                    {service.description}
                                </p>

                                {service.features.length > 0 && (
                                    <ul className="grid grid-cols-1 gap-4 mb-12">
                                        {service.features.map((feature, fIndex) => (
                                            <motion.li
                                                key={fIndex}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 * fIndex }}
                                                className="flex items-center justify-center lg:justify-start gap-4 group/item"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover/item:bg-gold transition-colors shadow-[0_0_8px_rgba(212,175,55,0.3)]" />
                                                <span className="text-white/40 text-xs md:text-sm tracking-[0.1em] uppercase group-hover/item:text-white/70 transition-colors">
                                                    {feature}
                                                </span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </motion.section>
                ))}
            </div>

            <SimpleCTA />
        </div>
    );
}

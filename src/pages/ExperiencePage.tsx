import { motion } from 'framer-motion';
import { usePhilosophies } from '../hooks/usePhilosophies';
import { philosophiesData } from '../data/philosophies';
import SimpleCTA from '../components/common/SimpleCTA';

export default function ExperiencePage() {
    const { data: dbPhilosophies } = usePhilosophies();

    const philosophies = dbPhilosophies && dbPhilosophies.length > 0
        ? dbPhilosophies.map(p => ({ title: p.title, heading: p.heading, description: p.description, image: p.image_url }))
        : philosophiesData.map(p => ({ title: p.title, heading: p.title, description: p.description, image: p.image }));

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            {/* Hero Section - Kept consistent */}
            <section className="relative w-full px-8 md:px-16 py-10 flex flex-col items-center justify-center">
                <div className="max-w-[1600px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-10"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-3 block">
                            Our Philosophy
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(28px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-4">
                            The Art of <span className="liquid-gold-text">Perfection</span>
                        </h1>
                        <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                            Four pillars that define our pursuit of the extraordinary
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Scroll Showcase */}
            <div className="w-full px-6 md:px-12 lg:px-16 pb-32">
                {philosophies.map((phil, index) => (
                    <motion.section 
                        key={index}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
                    >
                        {/* Media Column */}
                        <div className={`lg:col-span-6 relative flex justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <div className={`relative aspect-[10/12] rounded-[32px] md:rounded-[48px] overflow-hidden group max-w-[85%] ${index % 2 === 0 ? 'lg:ml-auto lg:mr-0' : 'lg:mr-auto lg:ml-0'}`}>
                                <motion.img 
                                    initial={{ scale: 1.2 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    src={phil.image} 
                                    alt={phil.title} 
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#02140F]/80 via-transparent to-transparent opacity-60" />
                            </div>
                            
                            {/* Decorative Label */}
                            <div className={`absolute -bottom-6 ${index % 2 === 1 ? '-left-4' : '-right-4'} hidden md:block z-20`}>
                                <div className="glass-card px-8 py-4 rounded-full border-white/10 backdrop-blur-xl">
                                    <span className="liquid-gold-text text-[10px] tracking-[0.4em] uppercase font-bold">
                                        PILLAR {index + 1}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className={`lg:col-span-6 flex justify-center lg:block ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <div className={`relative z-10 max-w-[85%] text-center lg:text-left ${index % 2 === 0 ? 'lg:mr-auto lg:ml-0' : 'lg:ml-auto lg:mr-0'}`}>
                                <span className="liquid-gold-text text-[10px] tracking-[0.4em] uppercase font-bold mb-6 block">
                                    {phil.title}
                                </span>
                                <h2 className="font-serif text-white text-[clamp(28px,4vw,56px)] leading-[1.1] mb-8">
                                    {phil.heading}
                                </h2>
                                <p className="text-white/50 text-base md:text-xl leading-relaxed mb-10 font-light tracking-wide italic">
                                    {phil.description}
                                </p>
                                
                                <div className="w-24 h-[1px] bg-gold/30 mb-8 mx-auto lg:mx-0" />
                            </div>
                        </div>
                    </motion.section>
                ))}
            </div>

            <SimpleCTA />
        </div>
    );
}

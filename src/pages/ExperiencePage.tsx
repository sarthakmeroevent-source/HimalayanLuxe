import { motion } from 'framer-motion';
import { useState } from 'react';
import { philosophiesData } from '../data/philosophies';
import SimpleCTA from '../components/common/SimpleCTA';

export default function ExperiencePage() {
    const [activePhilosophy, setActivePhilosophy] = useState(0);
    const philosophies = philosophiesData;

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
                            Our Philosophy
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            The Art of <span className="liquid-gold-text">Perfection</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            Four pillars that define our approach to creating unforgettable experiences
                        </p>
                    </motion.div>

                    {/* Philosophy Selector */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center gap-4 mb-16 flex-wrap"
                    >
                        {philosophies.map((phil, index) => (
                            <button
                                key={index}
                                onClick={() => setActivePhilosophy(index)}
                                className={`px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 ${
                                    activePhilosophy === index
                                        ? 'bg-gold/20 border border-gold text-gold'
                                        : 'border border-white/20 text-white/60 hover:border-gold/50 hover:text-gold'
                                }`}
                            >
                                {phil.title}
                            </button>
                        ))}
                    </motion.div>

                    {/* Philosophy Content */}
                    <motion.div
                        key={activePhilosophy}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid md:grid-cols-2 gap-12 items-center mb-20"
                    >
                        <div>
                            <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                                {philosophies[activePhilosophy].title}
                            </span>
                            <h2 className="font-serif text-white/95 text-4xl md:text-5xl mb-6 leading-[1.1]">
                                {philosophies[activePhilosophy].heading}
                            </h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                {philosophies[activePhilosophy].description}
                            </p>
                        </div>
                        <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden glass-card p-3">
                            <img 
                                src={philosophies[activePhilosophy].image} 
                                alt={philosophies[activePhilosophy].title}
                                className="w-full h-full object-cover rounded-[28px]"
                            />
                        </div>
                    </motion.div>

                    {/* Additional Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1 }}
                        className="glass-card p-12 rounded-[32px] text-center"
                    >
                        <h3 className="font-serif text-white/95 text-3xl md:text-4xl mb-6">
                            Experience the Difference
                        </h3>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
                            Our philosophy isn't just words on a page—it's the foundation of every event we create. 
                            From the first consultation to the final farewell, these principles guide our every decision.
                        </p>
                        <button className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10">
                            <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                Start Your Journey
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>
            <SimpleCTA />
        </div>
    );
}

import { motion } from 'framer-motion';
import SimpleCTA from '../components/common/SimpleCTA';

export default function AboutPage() {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
            {/* Hero Section */}
            <section className="relative w-full px-8 md:px-16 py-20">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-20"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            Our Story
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Crafting <span className="liquid-gold-text">Legacies</span> Since 2010
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            We are not event planners. We are architects of emotion, curators of the extraordinary, 
                            and guardians of your most precious moments.
                        </p>
                    </motion.div>

                    {/* Story Grid */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-card p-8 md:p-12 rounded-[32px]"
                        >
                            <h3 className="font-serif text-white/95 text-3xl mb-6">The Beginning</h3>
                            <p className="text-white/60 leading-relaxed mb-4">
                                Founded in the heart of the Himalayas, our journey began with a singular vision: 
                                to transform celebrations into timeless masterpieces that transcend generations.
                            </p>
                            <p className="text-white/60 leading-relaxed">
                                What started as a passion for perfection has evolved into a legacy of creating 
                                the world's most sought-after luxury events.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-card p-8 md:p-12 rounded-[32px]"
                        >
                            <h3 className="font-serif text-white/95 text-3xl mb-6">Our Philosophy</h3>
                            <p className="text-white/60 leading-relaxed mb-4">
                                Every detail matters. Every moment counts. We believe that true luxury lies not 
                                in excess, but in the meticulous orchestration of perfection.
                            </p>
                            <p className="text-white/60 leading-relaxed">
                                Our approach combines traditional grandeur with contemporary innovation, 
                                creating experiences that are both timeless and revolutionary.
                            </p>
                        </motion.div>
                    </div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
                    >
                        {[
                            { number: '500+', label: 'Luxury Events' },
                            { number: '50+', label: 'Countries' },
                            { number: '15+', label: 'Years Excellence' },
                            { number: '100%', label: 'Satisfaction' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="font-serif text-5xl md:text-6xl liquid-gold-text mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-white/60 text-sm tracking-wider uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Team Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center"
                    >
                        <h2 className="font-serif text-white/95 text-4xl md:text-5xl mb-6">
                            The <span className="liquid-gold-text">Artisans</span>
                        </h2>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed mb-12">
                            Our team comprises world-renowned designers, master planners, and creative visionaries 
                            who have orchestrated events for royalty, celebrities, and discerning families worldwide.
                        </p>
                        <button className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10">
                            <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                Meet The Team
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>
            <SimpleCTA />
        </div>
    );
}

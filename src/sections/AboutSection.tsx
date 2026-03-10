import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutSection() {
    return (
        <section className="relative w-full flex flex-col items-center justify-center py-16 md:py-[72px] px-6 md:px-12 overflow-hidden" id="about">
            <div className="w-full max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
                >
                    <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                        Our Story
                    </span>
                    <h2 className="font-serif text-white/95 text-[clamp(32px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-6">
                        Crafting <span className="liquid-gold-text">Legacies</span> Since 2010
                    </h2>
                    <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed mb-12">
                        We are not event planners. We are architects of emotion, curators of the extraordinary,
                        and guardians of your most precious moments.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
                >
                    {[
                        { number: '500+', label: 'Luxury Events' },
                        { number: '50+', label: 'Countries' },
                        { number: '15+', label: 'Years Excellence' },
                        { number: '100%', label: 'Satisfaction' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="font-serif text-4xl md:text-5xl liquid-gold-text mb-2">
                                {stat.number}
                            </div>
                            <div className="text-white/60 text-sm tracking-wider uppercase">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="text-center"
                >
                    <Link
                        to="/about"
                        className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 inline-block"
                    >
                        <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                            Learn More About Us
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

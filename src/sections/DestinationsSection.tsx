import { motion } from 'framer-motion';
import { Skiper52 } from '../components/ui/expand-on-hover';
import { Link } from 'react-router-dom';

export default function DestinationsSection() {
    return (
        <section className="section-container relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-16 md:py-24 px-6 md:px-12" id="destinations">
            <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto">
                <div className="w-full flex items-center justify-center mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium block">
                            Explore Us
                        </span>
                    </motion.div>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,48px)] font-normal leading-[1.15] md:leading-[1.1] tracking-tight drop-shadow-2xl mb-10 text-center"
                >
                    Crafting timeless <span className="liquid-gold-text">moments</span>
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full mb-12"
                >
                    <Skiper52 />
                </motion.div>

                {/* View All button at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                    <Link
                        to="/destinations"
                        className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit inline-block"
                    >
                        <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                            View All Works
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

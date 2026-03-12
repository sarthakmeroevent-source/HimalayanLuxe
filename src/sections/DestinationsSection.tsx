import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DestinationGradientCarousel from '../components/ui/DestinationGradientCarousel';
import DestinationCarousel from '../components/ui/DestinationCarousel';

export default function DestinationsSection() {


    return (
        <section className="section-container relative w-full flex flex-col items-center justify-center py-16 md:py-[72px] overflow-hidden" id="destinations">
            <div className="w-full flex flex-col items-center mx-auto z-20">
                {/* Header Section */}
                <div className="w-full flex flex-col items-center mb-16 px-6 md:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center mb-4"
                    >
                        <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium block">
                            Our Destinations
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,56px)] font-normal leading-[1.1] tracking-tight drop-shadow-2xl mb-4 max-w-4xl"
                    >
                        Where luxury meets <span className="liquid-gold-text italic">the extraordinary</span>
                    </motion.h2>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="w-full mb-0 hidden md:block">
                <DestinationGradientCarousel />
            </div>
            <div className="w-full mb-0 md:hidden block">
                <DestinationCarousel />
            </div>

            <div className="w-full flex flex-col items-center mx-auto z-20">
                {/* View All button at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                    className="px-6 md:px-12 mt-16"
                >
                    <Link
                        to="/destinations"
                        className="group relative overflow-hidden rounded-full border border-gold/30 px-10 py-5 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit inline-block"
                    >
                        <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.3em] text-gold transition-colors duration-700 group-hover:text-white">
                            View All Destinations
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

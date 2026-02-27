import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTASection() {
    return (
        <section className="section-container relative min-h-[100dvh] w-full flex items-center justify-center py-24 px-8 md:px-12 overflow-hidden" id="cta">
            <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-100px", amount: 0.3 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card max-w-4xl w-full p-8 md:p-16 rounded-[30px] md:rounded-[40px] text-center relative z-10"
            >
                <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-12 block">Begin Your Legacy</span>
                <h2 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[0.9] font-normal tracking-tight mb-[clamp(1.5rem,4vh,2.5rem)]">
                    Shall we <br /> <span className="italic text-white/40">begin?</span>
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <Link 
                        to="/contact"
                        className="luxury-button rounded-full w-full md:w-auto inline-block text-center"
                    >
                        Contact Us
                    </Link>
                    <Link
                        to="/portfolio"
                        className="text-white/60 hover:text-gold text-xs tracking-[0.3em] font-medium uppercase transition-colors duration-500"
                    >
                        View Lookbook
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SimpleCTA() {
    return (
        <section className="relative w-full py-24 px-8 md:px-12">
            <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-100px", amount: 0.3 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card max-w-4xl w-full mx-auto p-8 md:p-16 rounded-[30px] md:rounded-[40px] text-center relative z-10"
            >
                <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-8 block">
                    Begin Your Legacy
                </span>
                <h2 className="font-serif text-white/95 text-[clamp(28px,4vw,48px)] leading-[1.1] font-normal tracking-tight mb-8">
                    Ready to create something <span className="liquid-gold-text">extraordinary?</span>
                </h2>
                <Link 
                    to="/contact"
                    className="luxury-button rounded-full inline-block"
                >
                    Contact Us Now
                </Link>
            </motion.div>
        </section>
    );
}

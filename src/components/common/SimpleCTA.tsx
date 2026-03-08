import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SimpleCTAProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    label?: React.ReactNode;
    buttonText?: React.ReactNode;
    buttonLink?: string;
}

export default function SimpleCTA({
    title = <>Ready to create something <span className="liquid-gold-text">extraordinary?</span></>,
    subtitle,
    label = "Begin Your Legacy",
    buttonText = "Contact Us Now",
    buttonLink = "/contact"
}: SimpleCTAProps = {}) {
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
                {label && (
                    <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-8 block">
                        {label}
                    </span>
                )}
                <h2 className={`font-serif text-white/95 text-[clamp(28px,4vw,48px)] leading-[1.1] font-normal tracking-tight ${subtitle ? 'mb-4' : 'mb-8'}`}>
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                        {subtitle}
                    </p>
                )}
                <Link
                    to={buttonLink}
                    className="luxury-button rounded-full inline-block"
                >
                    {buttonText}
                </Link>
            </motion.div>
        </section>
    );
}

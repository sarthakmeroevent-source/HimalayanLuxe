import { Link } from 'react-router-dom';
import { useFadeInView } from '../hooks/useFadeInView';

export default function CTASection() {
    const cardRef = useFadeInView();

    return (
        <section className="relative w-full flex items-center justify-center py-16 md:py-[72px] px-8 md:px-12 overflow-hidden" id="cta">
            <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
            <div
                ref={cardRef}
                className="fade-in-view glass-card max-w-4xl w-full p-12 md:p-16 rounded-[30px] md:rounded-[40px] text-center relative z-10"
            >
                <span className="liquid-gold-text text-[11px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase font-medium mb-6 md:mb-12 block">Begin Your Legacy</span>
                <h2 className="font-serif text-white/95 text-[40px] md:text-[clamp(32px,5vw,72px)] leading-[1.2] md:leading-[0.9] font-normal tracking-tight mb-[clamp(1.5rem,4vh,2.5rem)]">
                    Shall we <br /> <span className="italic text-white/40">begin?</span>
                </h2>
                <Link
                    to="/contact"
                    className="luxury-button rounded-full w-full md:w-auto inline-block text-center"
                >
                    Contact Us
                </Link>
            </div>
        </section>
    );
}

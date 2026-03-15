import { Link } from 'react-router-dom';
import { useFadeInView } from '../hooks/useFadeInView';
import { useAboutContent, useAboutStats } from '../hooks/useAboutContent';

const fallbackStats = [
    { number: '500+', label: 'Luxury Events' },
    { number: '50+', label: 'Countries' },
    { number: '15+', label: 'Years Excellence' },
    { number: '100%', label: 'Satisfaction' }
];

export default function AboutSection() {
    const headerRef = useFadeInView();
    const statsRef = useFadeInView();
    const buttonRef = useFadeInView();

    const { data: aboutContent } = useAboutContent();
    const { data: aboutStats } = useAboutStats();

    const heading = aboutContent?.heading || 'Crafting <gold>Legacies</gold> Since 2010';
    const subtitle = aboutContent?.subtitle || 'We are not event planners. We are architects of emotion, curators of the extraordinary, and guardians of your most precious moments.';
    const stats = aboutStats && aboutStats.length > 0 ? aboutStats : fallbackStats;

    // Parse heading to support <gold>text</gold> for styling
    const renderHeading = () => {
        const parts = heading.split(/(<gold>.*?<\/gold>)/);
        return parts.map((part, i) => {
            const match = part.match(/<gold>(.*?)<\/gold>/);
            if (match) return <span key={i} className="liquid-gold-text">{match[1]}</span>;
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <section className="relative w-full flex flex-col items-center justify-center py-16 md:py-[72px] px-6 md:px-12 overflow-hidden" id="about">
            <div className="w-full max-w-[1400px] mx-auto">
                <div ref={headerRef} className="fade-in-view text-center mb-16">
                    <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                        Our Story
                    </span>
                    <h2 className="font-serif text-white/95 text-[clamp(32px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-6">
                        {renderHeading()}
                    </h2>
                    <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed mb-12">
                        {subtitle}
                    </p>
                </div>

                <div ref={statsRef} className="fade-in-view grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="font-serif text-4xl md:text-5xl liquid-gold-text mb-2">
                                {stat.number}
                            </div>
                            <div className="text-white/60 text-sm tracking-wider uppercase">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div ref={buttonRef} className="fade-in-view text-center">
                    <Link
                        to="/about"
                        className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 inline-block"
                    >
                        <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                            Learn More About Us
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

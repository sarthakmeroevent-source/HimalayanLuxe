import { Link } from 'react-router-dom';
import DestinationGradientCarousel from '../components/ui/DestinationGradientCarousel';
import DestinationCarousel from '../components/ui/DestinationCarousel';
import { useFadeInView } from '../hooks/useFadeInView';

export default function DestinationsSection() {
    const headerRef = useFadeInView();
    const buttonRef = useFadeInView();

    return (
        <section className="section-container relative w-full flex flex-col items-center justify-center py-16 md:py-[72px] overflow-hidden" id="destinations">
            <div className="w-full flex flex-col items-center mx-auto z-20">
                <div ref={headerRef} className="fade-in-view w-full flex flex-col items-center mb-16 px-6 md:px-12 text-center">
                    <div className="flex flex-col items-center mb-4">
                        <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium block">
                            Our Destinations
                        </span>
                    </div>
                    <h2 className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,56px)] font-normal leading-[1.1] tracking-tight drop-shadow-2xl mb-4 max-w-4xl">
                        Where luxury meets <span className="liquid-gold-text italic">the extraordinary</span>
                    </h2>
                </div>
            </div>

            <div className="w-full mb-0 hidden md:block">
                <DestinationGradientCarousel />
            </div>
            <div className="w-full mb-0 md:hidden block">
                <DestinationCarousel />
            </div>

            <div className="w-full flex flex-col items-center mx-auto z-20">
                <div ref={buttonRef} className="fade-in-view px-6 md:px-12 mt-16">
                    <Link
                        to="/destinations"
                        className="group relative overflow-hidden rounded-full border border-gold/30 px-10 py-5 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit inline-block"
                    >
                        <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.3em] text-gold transition-colors duration-700 group-hover:text-white">
                            View All Destinations
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

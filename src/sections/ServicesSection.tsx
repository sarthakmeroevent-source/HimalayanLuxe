import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesData } from '../data/services';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const navigate = useNavigate();

    const handleCardClick = (serviceId: string) => {
        navigate(`/services?service=${serviceId}`);
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
            const totalCards = cards.length;

            cards.forEach((card, index) => {
                const isLastCard = index === totalCards - 1;
                const nextCard = cards[index + 1];

                // Pin each card below the navbar
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top+=100px',
                    end: isLastCard
                        ? '+=1'
                        : (nextCard ? `${nextCard.offsetTop - card.offsetTop}px` : `+=${window.innerHeight * 2}`),
                    pin: true,
                    pinSpacing: false,
                    id: `card-${index}`
                });

                // Scale down animation only for non-last cards when next card comes up
                if (!isLastCard && nextCard) {
                    ScrollTrigger.create({
                        trigger: nextCard,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: 1,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const scale = 1 - (progress * 0.15);
                            const y = progress * 40;
                            const opacity = 1 - (progress * 0.3);

                            gsap.set(card, {
                                scale: scale,
                                y: y,
                                opacity: opacity,
                                transformOrigin: 'center top'
                            });
                        }
                    });
                }
            });

            // Refresh ScrollTrigger once everything is rendered
            ScrollTrigger.refresh();
        });

        // Additional refresh after a short delay for safety in SPA
        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            ctx.revert();
            clearTimeout(refreshTimer);
        };
    }, []);

    return (
        <section className="relative w-full py-16 md:py-24 px-6 md:px-12" id="services">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 flex flex-col items-center text-center"
            >
                <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6">Masterpieces</span>
                <h2 className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,48px)] font-normal leading-[1.15] md:leading-[1.1] tracking-tight">
                    Curated <span className="italic text-white/50">Excellence</span>
                </h2>
            </motion.div>

            <div className="w-full max-w-[1400px] mx-auto relative z-10">
                {servicesData.map((service, i) => (
                    <div
                        key={service.id}
                        ref={(el) => (cardsRef.current[i] = el)}
                        onClick={() => handleCardClick(service.id)}
                        className="flex flex-col items-center justify-center w-full h-[70vh] md:h-[80vh] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border border-white/10 will-change-transform cursor-pointer"
                        style={{
                            position: 'relative',
                            marginBottom: i < servicesData.length - 1 ? '0' : '0',
                            zIndex: i + 1
                        }}
                    >
                        <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full"
                        >
                            <h3 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] mb-6 drop-shadow-2xl">
                                {service.title}
                            </h3>
                            <h4 className="text-white/80 font-sans tracking-[0.15em] md:tracking-[0.2em] text-[clamp(10px,1.2vw,14px)] font-semibold uppercase drop-shadow-lg">
                                {service.subtitle}
                            </h4>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}

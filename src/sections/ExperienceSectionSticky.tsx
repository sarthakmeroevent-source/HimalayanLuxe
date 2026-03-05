import { motion } from 'framer-motion';
import { philosophiesData } from '../data/philosophies';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionStickyProps {
    activePhilosophy: number;
    setActivePhilosophy: (index: number) => void;
    activePhilosophyRef: React.MutableRefObject<number>;
}

export default function ExperienceSectionSticky({
    activePhilosophy,
    setActivePhilosophy,
    activePhilosophyRef
}: ExperienceSectionStickyProps) {
    const philosophies = philosophiesData;
    const sectionRef = useRef<HTMLElement>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
    const [isDesktop, setIsDesktop] = useState(true);
    const [isInteracting, setIsInteracting] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!sectionRef.current || !isDesktop) return;

        const section = sectionRef.current;
        const totalPhilosophies = philosophies.length;

        // Set initial state for first content and image to be visible
        if (contentRefs.current[0]) {
            gsap.set(contentRefs.current[0], { y: '0%', opacity: 1 });
        }
        if (imageRefs.current[0]) {
            gsap.set(imageRefs.current[0], { opacity: 1 });
        }

        // Create ScrollTrigger for the section
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            pin: '.experience-sticky-content',
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                // Update active philosophy index
                const currentIndex = Math.min(
                    Math.floor(progress * totalPhilosophies),
                    totalPhilosophies - 1
                );

                if (currentIndex !== activePhilosophyRef.current) {
                    setActivePhilosophy(currentIndex);
                    activePhilosophyRef.current = currentIndex;
                }

                // Animate content with smooth, continuous scrolling
                contentRefs.current.forEach((content, index) => {
                    if (!content) return;

                    const sectionSize = 1 / totalPhilosophies;
                    const sectionStart = index * sectionSize;
                    const sectionEnd = (index + 1) * sectionSize;

                    let yPosition;
                    let opacity;

                    if (index === 0) {
                        if (progress < sectionEnd - 0.2) {
                            yPosition = 0;
                            opacity = 1;
                        } else if (progress >= sectionEnd - 0.2 && progress <= sectionEnd) {
                            const localProgress = (progress - (sectionEnd - 0.2)) / 0.2;
                            yPosition = -(localProgress * 100);
                            opacity = 1 - localProgress;
                        } else {
                            yPosition = -100;
                            opacity = 0;
                        }
                    }
                    else if (index === totalPhilosophies - 1) {
                        if (progress < sectionStart) {
                            yPosition = 100;
                            opacity = 0;
                        } else if (progress >= sectionStart && progress < sectionStart + 0.2) {
                            const localProgress = (progress - sectionStart) / 0.2;
                            yPosition = 100 - (localProgress * 100);
                            opacity = localProgress;
                        } else {
                            yPosition = 0;
                            opacity = 1;
                        }
                    }
                    else {
                        if (progress < sectionStart) {
                            yPosition = 100;
                            opacity = 0;
                        } else if (progress >= sectionStart && progress <= sectionEnd) {
                            const localProgress = (progress - sectionStart) / sectionSize;
                            yPosition = 100 - (localProgress * 200);
                            if (localProgress < 0.2) {
                                opacity = localProgress / 0.2;
                            } else if (localProgress > 0.8) {
                                opacity = (1 - localProgress) / 0.2;
                            } else {
                                opacity = 1;
                            }
                        } else {
                            yPosition = -100;
                            opacity = 0;
                        }
                    }

                    gsap.to(content, {
                        y: `${yPosition}%`,
                        opacity: opacity,
                        duration: 0,
                        ease: 'none'
                    });
                });

                // Animate images with smooth crossfade
                imageRefs.current.forEach((img, index) => {
                    if (!img) return;

                    const sectionSize = 1 / totalPhilosophies;
                    const sectionStart = index * sectionSize;
                    const sectionEnd = (index + 1) * sectionSize;
                    const sectionMid = (sectionStart + sectionEnd) / 2;

                    let opacity = 0;
                    if (index === 0 && progress < sectionSize * 0.5) {
                        opacity = 1;
                    }
                    else if (index === totalPhilosophies - 1 && progress > 1 - (sectionSize * 0.5)) {
                        opacity = 1;
                    }
                    else {
                        const fadeRange = sectionSize * 0.4;
                        if (progress >= sectionStart - fadeRange && progress <= sectionEnd + fadeRange) {
                            const distance = Math.abs(progress - sectionMid);
                            const maxDistance = sectionSize / 2 + fadeRange;
                            opacity = Math.max(0, 1 - (distance / maxDistance));
                        }
                    }

                    gsap.to(img, {
                        opacity: opacity,
                        duration: 0,
                        ease: 'none'
                    });
                });
            }
        });

        return () => {
            trigger.kill();
        };
    }, [isDesktop, philosophies.length, setActivePhilosophy, activePhilosophyRef]);

    const scrollToPhilosophy = (index: number) => {
        if (!sectionRef.current || !isDesktop) return;
        const section = sectionRef.current;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        const philosophyHeight = section.offsetHeight / philosophies.length;
        const targetScroll = sectionTop + (philosophyHeight * index) + (philosophyHeight * 0.3);
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
        setActivePhilosophy(index);
        activePhilosophyRef.current = index;
    };

    const isAnimatingRef = useRef(false);

    // Auto-play logic for mobile carousel
    useEffect(() => {
        if (isDesktop || isInteracting || !carouselRef.current) return;

        const timer = setTimeout(() => {
            const container = carouselRef.current;
            if (isAnimatingRef.current || !container) return;

            const nextIndex = (activePhilosophy + 1) % philosophies.length;
            const cardWidth = container.offsetWidth * 0.85;
            const gap = 24; // gap-6

            isAnimatingRef.current = true;

            gsap.to(container, {
                scrollLeft: nextIndex * (cardWidth + gap),
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    isAnimatingRef.current = false;
                    setActivePhilosophy(nextIndex);
                    activePhilosophyRef.current = nextIndex;
                }
            });
        }, 3000);

        return () => {
            clearTimeout(timer);
            gsap.killTweensOf(carouselRef.current);
        };
    }, [isDesktop, isInteracting, activePhilosophy, philosophies.length, setActivePhilosophy]);

    if (!isDesktop) {
        return (
            <section className="relative w-full py-12 px-6 overflow-hidden bg-transparent" id="experience">
                <div className="flex flex-col items-center text-center gap-6 mb-12">
                    <span className="liquid-gold-text text-[10px] tracking-[0.3em] uppercase font-medium">Experience</span>
                    <h2 className="font-serif text-white/95 text-4xl leading-[1.1] font-normal tracking-tight mx-auto max-w-[280px]">The Art of <span className="italic text-white/50">Details</span></h2>
                </div>

                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-6 snap-x snap-proximity scrollbar-hide pb-8"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    onMouseEnter={() => setIsInteracting(true)}
                    onMouseLeave={() => setIsInteracting(false)}
                    onTouchStart={() => setIsInteracting(true)}
                    onTouchEnd={() => setIsInteracting(false)}
                    onScroll={(e) => {
                        if (isAnimatingRef.current) return;
                        const target = e.target as HTMLDivElement;
                        const cardWidth = target.offsetWidth * 0.85;
                        const gap = 24;
                        const index = Math.round(target.scrollLeft / (cardWidth + gap));
                        if (index !== activePhilosophy) {
                            setActivePhilosophy(index);
                            activePhilosophyRef.current = index;
                        }
                    }}
                >
                    {philosophies.map((philosophy, index) => (
                        <div key={index} className="flex-shrink-0 w-[85vw] snap-center flex flex-col gap-6">
                            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-gold/20 shadow-2xl p-1 bg-transparent">
                                <img src={philosophy.image} alt={philosophy.title} className="w-full h-full object-cover rounded-[20px] brightness-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <span className="liquid-gold-text text-[10px] tracking-[0.2em] uppercase font-medium block mb-2">{philosophy.title}</span>
                                    <h3 className="font-serif text-white text-2xl leading-tight">{philosophy.heading}</h3>
                                </div>
                            </div>
                            <div className="px-2">
                                <p className="text-white/60 font-sans text-sm leading-relaxed mb-8 line-clamp-3">{philosophy.description}</p>
                                <div className="flex items-center justify-between gap-4">
                                    <Link
                                        to="/experience"
                                        className="group relative overflow-hidden rounded-full border border-gold/30 px-6 py-3 transition-all duration-700 hover:border-gold hover:bg-gold/10"
                                    >
                                        <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                            Discover Now
                                        </span>
                                    </Link>

                                    <div className="flex gap-1.5 px-2">
                                        {philosophies.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-[1px] rounded-full transition-all duration-500 ${activePhilosophy === i ? 'w-6 bg-gold' : 'w-2 bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="relative w-full mt-0"
            id="experience"
            style={{ height: `${philosophies.length * 100}vh` }}
        >
            <div className="experience-sticky-content sticky top-0 left-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden pt-[80px] md:pt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-[1600px] mx-auto flex-grow flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-8 px-6 md:px-32">
                    {/* Image Section - First on Mobile, Second on Desktop */}
                    <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center items-center">
                        <div className="relative w-full aspect-[4/3] md:h-[clamp(400px,60vh,700px)] max-w-2xl rounded-[16px] md:rounded-[32px] p-1 md:p-3 shadow-2xl border border-gold/20 bg-transparent flex-shrink-0">
                            <div className="relative w-full h-full rounded-[14px] md:rounded-[28px] overflow-hidden bg-transparent">
                                {philosophies.map((philosophy, index) => (
                                    <img
                                        key={index}
                                        ref={(el) => (imageRefs.current[index] = el)}
                                        src={philosophy.image}
                                        alt={philosophy.title}
                                        className="absolute inset-0 w-full h-full object-cover rounded-[14px] md:rounded-[28px] will-change-opacity brightness-105"
                                        style={{
                                            opacity: index === 0 ? 1 : 0,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Section - Second on Mobile, First on Desktop */}
                    <div className="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-start text-left justify-center relative">
                        <div className="relative w-full flex items-start justify-start overflow-hidden min-h-[400px] md:min-h-[60vh] pt-4 md:pt-0">
                            {philosophies.map((philosophy, index) => (
                                <div
                                    key={index}
                                    ref={(el) => (contentRefs.current[index] = el)}
                                    className="absolute top-0 left-0 w-full flex flex-col will-change-transform"
                                    style={{ transform: 'translateY(100%)', opacity: 0 }}
                                >
                                    <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.4em] uppercase font-medium mb-3 md:mb-8 block">
                                        {philosophy.title}
                                    </span>
                                    <h2 className="font-serif text-white/95 text-[28px] md:text-[clamp(28px,3vw,48px)] leading-[1.2] md:leading-[1.1] font-normal tracking-tight mb-4 md:mb-[clamp(1rem,3vh,2rem)] max-w-xl">
                                        {philosophy.heading}
                                    </h2>
                                    <p className="text-white/60 font-sans max-w-lg text-[14px] md:text-[clamp(14px,1vw,14px)] leading-[1.6] md:leading-[1.6] tracking-wide mb-6 md:mb-[clamp(1.5rem,4vh,2.5rem)]">
                                        {philosophy.description}
                                    </p>

                                    <div className="flex flex-col gap-6 md:gap-8">
                                        <Link
                                            to="/experience"
                                            className="group relative overflow-hidden rounded-full border border-gold/30 px-6 md:px-8 py-3 md:py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit"
                                        >
                                            <span className="relative z-10 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                                Discover The Art
                                            </span>
                                        </Link>

                                        <div className="flex items-center gap-2.5 md:gap-3">
                                            {philosophies.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => scrollToPhilosophy(i)}
                                                    className="group relative py-2.5"
                                                >
                                                    <div className={`h-[2px] transition-all duration-700 rounded-full ${activePhilosophy === i ? 'w-8 md:w-12 bg-gold' : 'w-2 md:w-4 bg-white/20 group-hover:bg-white/40'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                    <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                            <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

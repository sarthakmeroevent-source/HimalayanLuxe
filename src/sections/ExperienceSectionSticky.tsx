import { motion, AnimatePresence } from 'framer-motion';
import { philosophiesData } from '../data/philosophies';
import { useRef, useEffect } from 'react';
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

    useEffect(() => {
        if (!sectionRef.current) return;

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

                    // Each philosophy takes up equal space in the scroll
                    const sectionSize = 1 / totalPhilosophies;
                    const sectionStart = index * sectionSize;
                    const sectionEnd = (index + 1) * sectionSize;

                    // Calculate position relative to current scroll progress
                    let yPosition;
                    let opacity;

                    // Special handling for first philosophy
                    if (index === 0) {
                        if (progress < sectionEnd - 0.2) {
                            // Stay at top position
                            yPosition = 0;
                            opacity = 1;
                        } else if (progress >= sectionEnd - 0.2 && progress <= sectionEnd) {
                            // Fade out and scroll up at the end
                            const localProgress = (progress - (sectionEnd - 0.2)) / 0.2;
                            yPosition = -(localProgress * 100);
                            opacity = 1 - localProgress;
                        } else {
                            // After first section - above viewport
                            yPosition = -100;
                            opacity = 0;
                        }
                    }
                    // Special handling for last philosophy
                    else if (index === totalPhilosophies - 1) {
                        if (progress < sectionStart) {
                            // Before last section - below viewport
                            yPosition = 100;
                            opacity = 0;
                        } else if (progress >= sectionStart && progress < sectionStart + 0.2) {
                            // Fade in and scroll to position
                            const localProgress = (progress - sectionStart) / 0.2;
                            yPosition = 100 - (localProgress * 100);
                            opacity = localProgress;
                        } else {
                            // Stay in position
                            yPosition = 0;
                            opacity = 1;
                        }
                    }
                    // Middle philosophies
                    else {
                        if (progress < sectionStart) {
                            // Before this section - below viewport
                            yPosition = 100;
                            opacity = 0;
                        } else if (progress >= sectionStart && progress <= sectionEnd) {
                            // During this section - smoothly scroll from bottom to top
                            const localProgress = (progress - sectionStart) / sectionSize;
                            yPosition = 100 - (localProgress * 200); // Scroll from 100% to -100%

                            // Fade in at start, stay visible, fade out at end
                            if (localProgress < 0.2) {
                                opacity = localProgress / 0.2;
                            } else if (localProgress > 0.8) {
                                opacity = (1 - localProgress) / 0.2;
                            } else {
                                opacity = 1;
                            }
                        } else {
                            // After this section - above viewport
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

                // Animate images with smooth crossfade - always at full brightness
                imageRefs.current.forEach((img, index) => {
                    if (!img) return;

                    const sectionSize = 1 / totalPhilosophies;
                    const sectionStart = index * sectionSize;
                    const sectionEnd = (index + 1) * sectionSize;
                    const sectionMid = (sectionStart + sectionEnd) / 2;

                    let opacity = 0;

                    // Special handling for first image - always visible at start
                    if (index === 0 && progress < sectionSize * 0.5) {
                        opacity = 1;
                    }
                    // Special handling for last image - always visible at end
                    else if (index === totalPhilosophies - 1 && progress > 1 - (sectionSize * 0.5)) {
                        opacity = 1;
                    }
                    // Crossfade with overlap for middle transitions
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
    }, [philosophies.length, setActivePhilosophy, activePhilosophyRef]);

    const scrollToPhilosophy = (index: number) => {
        if (!sectionRef.current) return;

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

    return (
        <section
            ref={sectionRef}
            className="relative w-full mt-16 md:mt-24"
            id="experience"
            style={{ height: `${philosophies.length * 100}vh` }}
        >
            <div className="experience-sticky-content sticky top-0 left-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden pt-[80px] md:pt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-[1600px] mx-auto flex-grow flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-8 px-6 md:px-32">
                    {/* Image Section - Now First on Mobile */}
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

                    {/* Content Section - Now Second on Mobile */}
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

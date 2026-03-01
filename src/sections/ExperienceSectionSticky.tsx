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

                // Animate images with smooth crossfade
                imageRefs.current.forEach((img, index) => {
                    if (!img) return;
                    
                    const sectionSize = 1 / totalPhilosophies;
                    const sectionStart = index * sectionSize;
                    const sectionEnd = (index + 1) * sectionSize;
                    const sectionMid = (sectionStart + sectionEnd) / 2;
                    
                    let opacity = 0;
                    
                    // Crossfade with overlap
                    const fadeRange = sectionSize * 0.3; // 30% overlap
                    
                    if (progress >= sectionStart - fadeRange && progress <= sectionEnd + fadeRange) {
                        const distance = Math.abs(progress - sectionMid);
                        const maxDistance = sectionSize / 2 + fadeRange;
                        opacity = Math.max(0, 1 - (distance / maxDistance)) * 0.8;
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
            className="relative w-full" 
            id="experience"
            style={{ height: `${philosophies.length * 100}vh` }}
        >
            <div className="experience-sticky-content sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-[1600px] mx-auto flex-grow flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 px-12 md:px-32 py-12">
                    <div className="md:w-1/2 flex flex-col items-start text-left relative">
                        {/* Scrollable container for entire left content */}
                        <div className="relative w-full overflow-hidden" style={{ minHeight: '70vh' }}>
                            {philosophies.map((philosophy, index) => (
                                <div
                                    key={index}
                                    ref={(el) => (contentRefs.current[index] = el)}
                                    className="absolute top-0 left-0 w-full flex flex-col will-change-transform"
                                    style={{ transform: 'translateY(100%)', opacity: 0 }}
                                >
                                    <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-8 block">
                                        {philosophy.title}
                                    </span>
                                    <h2 className="font-serif text-white/95 text-[clamp(24px,3vw,48px)] leading-[1.1] font-normal tracking-tight mb-[clamp(1rem,3vh,2rem)] max-w-xl">
                                        {philosophy.heading}
                                    </h2>
                                    <p className="text-white/50 font-sans max-w-lg text-[clamp(12px,1vw,14px)] leading-[1.6] tracking-wide mb-[clamp(1.5rem,4vh,2.5rem)]">
                                        {philosophy.description}
                                    </p>

                                    {/* Buttons inside each philosophy content */}
                                    <div className="flex flex-col gap-8 mt-8">
                                        <Link 
                                            to="/experience"
                                            className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit"
                                        >
                                            <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                                Discover The Art
                                            </span>
                                        </Link>

                                        <div className="flex items-center gap-3">
                                            {philosophies.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => scrollToPhilosophy(i)}
                                                    className="group relative py-4"
                                                >
                                                    <div className={`h-[2px] transition-all duration-700 rounded-full ${activePhilosophy === i ? 'w-12 bg-gold' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-1/2 relative h-[clamp(300px,50vh,600px)] w-full max-w-2xl glass-card rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-2xl flex-shrink-0">
                        <div className="relative w-full h-full rounded-[20px] md:rounded-[28px] overflow-hidden">
                            {philosophies.map((philosophy, index) => (
                                <img
                                    key={index}
                                    ref={(el) => (imageRefs.current[index] = el)}
                                    src={philosophy.image}
                                    alt={philosophy.title}
                                    className="absolute inset-0 w-full h-full object-cover rounded-[20px] md:rounded-[28px] will-change-opacity"
                                    style={{ 
                                        opacity: 0,
                                        filter: 'grayscale(80%)',
                                        transition: 'filter 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%)'}
                                    onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(80%)'}
                                />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#022E22] via-transparent to-transparent opacity-80 pointer-events-none"></div>

                            <div className="absolute bottom-8 left-8 z-10 hidden md:block">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        key={activePhilosophy}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className="flex flex-col"
                                    >
                                        <span className="text-[40px] font-serif text-gold/20 leading-none mb-2">0{activePhilosophy + 1}</span>
                                        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium">Philosophy</span>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
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

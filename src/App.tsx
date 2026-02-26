import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Silk from './Silk';
import { Skiper52 } from './components/ui/expand-on-hover';
import Loader from './components/ui/Loader';
import Header from './components/layout/Header';
import NavigationOverlay from './components/layout/NavigationOverlay';
import Footer from './components/layout/Footer';

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isMuted, setIsMuted] = useState(true);
    const [activePhilosophy, setActivePhilosophy] = useState(0);

    const isAnimatingRef = useRef(false);
    const lastScrollTimeRef = useRef(0);
    const activeSectionRef = useRef('hero');
    const activePhilosophyRef = useRef(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const philosophies = [
        {
            title: "The Legacy",
            heading: <>We do not simply plan events. <br /><span className="italic text-white/50">We orchestrate</span> <span className="liquid-gold-text">legacies.</span></>,
            description: "For the discerning few who demand nothing less than absolute perfection, we offer an uncompromising vision of luxury. Every detail is a meticulous brushstroke on the canvas of your history. We transform ephemeral moments into eternal memories.",
            image: "/experience_image.png"
        },
        {
            title: "The Artistry",
            heading: <>Design is not a service. <br /><span className="italic text-white/50">It is a visual</span> <span className="liquid-gold-text">symphony.</span></>,
            description: "We believe that true luxury lies in the unseen. Our designs are architectural masterpieces of emotion, blending traditional grandeur with avant-garde aesthetics to create environments that breathe and tell your unique story.",
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"
        },
        {
            title: "The Precision",
            heading: <>Perfection is in the <br /><span className="italic text-white/50">details you</span> <span className="liquid-gold-text">never see.</span></>,
            description: "Excellence is not an accident; it is the result of relentless precision. From the acoustics of the hall to the timing of the reveal, we manage the invisible threads that make an event flawless and effortless.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
        },
        {
            title: "The Soul",
            heading: <>Every celebration <br /><span className="italic text-white/50">must have a</span> <span className="liquid-gold-text">heartbeat.</span></>,
            description: "Beyond the gold and the silk lies the essence of the moment. We capture the soul of your journey, ensuring that every laugh, every tear, and every breath is felt deeply by every soul in attendance.",
            image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80"
        }
    ];

    const sections = ['hero', 'experience', 'destinations', 'services', 'cta', 'footer'];

    useEffect(() => {
        if (showLoader) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
            infinite: false,
            autoRaf: false,
        });

        const scrollCooldown = 500;
        let touchStartY = 0;

        const handleWheel = (e: globalThis.WheelEvent) => {
            e.preventDefault();
            if (isAnimatingRef.current) return;

            const now = Date.now();
            if (now - lastScrollTimeRef.current < scrollCooldown) return;
            if (Math.abs(e.deltaY) < 1) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            scrollToSection(direction);
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (isAnimatingRef.current) return;

            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) < 5) return;

            const now = Date.now();
            if (now - lastScrollTimeRef.current < scrollCooldown) return;

            const direction = deltaY > 0 ? 1 : -1;
            scrollToSection(direction);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isAnimatingRef.current) return;

            const now = Date.now();
            if (now - lastScrollTimeRef.current < scrollCooldown) return;

            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                scrollToSection(1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                scrollToSection(-1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                scrollToSection(-sections.indexOf(activeSectionRef.current));
            } else if (e.key === 'End') {
                e.preventDefault();
                scrollToSection(sections.length - 1 - sections.indexOf(activeSectionRef.current));
            }
        };

        const scrollToSection = (direction: number) => {
            if (isAnimatingRef.current) return;

            const currentIndex = sections.indexOf(activeSectionRef.current);

            // Handle internal philosophy transitions when in the experience section
            if (activeSectionRef.current === 'experience') {
                const nextPhilosophy = activePhilosophyRef.current + direction;
                if (nextPhilosophy >= 0 && nextPhilosophy < philosophies.length) {
                    isAnimatingRef.current = true;
                    lastScrollTimeRef.current = Date.now();

                    setActivePhilosophy(nextPhilosophy);
                    activePhilosophyRef.current = nextPhilosophy;

                    // Strictly lock to experience section during philosophy switch
                    lenis.scrollTo('#experience', {
                        duration: 0.8,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        lock: true,
                        onComplete: () => {
                            setTimeout(() => {
                                isAnimatingRef.current = false;
                            }, 100);
                        }
                    });
                    return;
                }
            }

            let nextIndex = currentIndex + direction;

            if (nextIndex < 0) nextIndex = 0;
            if (nextIndex >= sections.length) nextIndex = sections.length - 1;

            if (nextIndex !== currentIndex) {
                isAnimatingRef.current = true;
                lastScrollTimeRef.current = Date.now();

                const nextSectionId = sections[nextIndex];
                setActiveSection(nextSectionId);
                activeSectionRef.current = nextSectionId;

                // Reset philosophy index when entering experience section from elsewhere
                if (nextSectionId === 'experience') {
                    if (direction > 0) {
                        setActivePhilosophy(0);
                        activePhilosophyRef.current = 0;
                    } else if (direction < 0) {
                        setActivePhilosophy(philosophies.length - 1);
                        activePhilosophyRef.current = philosophies.length - 1;
                    }
                }

                lenis.scrollTo(`#${nextSectionId}`, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    lock: true,
                    onComplete: () => {
                        setTimeout(() => {
                            isAnimatingRef.current = false;
                        }, 100);
                    }
                });
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isAnimatingRef.current) {
                    setActiveSection(entry.target.id);
                    activeSectionRef.current = entry.target.id;
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: "0px"
        });

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const handleScroll = () => {
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                setIsScrolled(window.scrollY > heroHeight - 100);
            }
        };

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll);
        const rafId = requestAnimationFrame(raf);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [showLoader]);

    useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 4700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative">
            {/* Custom Pagination Indicator */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col gap-6">
                {sections.map((id) => (
                    <button
                        key={id}
                        onClick={() => {
                            const element = document.getElementById(id);
                            if (element) {
                                isAnimatingRef.current = true;
                                lastScrollTimeRef.current = Date.now();
                                element.scrollIntoView({ behavior: 'smooth' });
                                setActiveSection(id);
                                activeSectionRef.current = id;

                                // Reset philosophy if jumping to experience
                                if (id === 'experience') {
                                    setActivePhilosophy(0);
                                    activePhilosophyRef.current = 0;
                                }

                                // Reset animating flag after smooth scroll is likely done
                                setTimeout(() => { isAnimatingRef.current = false; }, 1000);
                            }
                        }}
                        className="group flex items-center justify-end gap-4"
                    >
                        <span className={`text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-500 ${activeSection === id ? 'opacity-100 translate-x-0 text-gold' : 'opacity-0 translate-x-4 text-white hover:opacity-50'
                            }`}>
                            {id}
                        </span>
                        <div className="relative flex items-center justify-center">
                            <div className={`w-1 h-1 rounded-full transition-all duration-500 ${activeSection === id ? 'bg-gold scale-[2.5]' : 'bg-white/30 group-hover:bg-white/60'
                                }`}></div>
                            {activeSection === id && (
                                <motion.div
                                    layoutId="active-dot"
                                    className="absolute w-4 h-4 border border-gold rounded-full"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Silk Background for entire website */}
            <div className="fixed inset-0 z-0">
                <Silk
                    speed={0.8}
                    scale={0.8}
                    color="#50C878"
                    noiseIntensity={3.5}
                    rotation={0}
                />
                <div className="absolute inset-0 bg-black/70"></div>
            </div>

            {/* Logo Loader */}
            <Loader showLoader={showLoader} isDesktop={isDesktop} />

            <Header isScrolled={isScrolled} showLoader={showLoader} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Navigation Menu Overlay */}
            <NavigationOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <div className="scroll-wrapper relative z-10">
                <section className="section-container relative min-h-screen w-full flex items-center justify-center overflow-hidden" id="hero">
                    <div className="absolute inset-0 z-0">
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            playsInline
                            muted={isMuted}
                            className="w-full h-full object-cover"
                        >
                            <source src="/Video.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/80"></div>
                    </div>

                    <div className="absolute bottom-12 right-12 z-40">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5, duration: 1 }}
                            onClick={() => setIsMuted(!isMuted)}
                            className="group relative flex items-center justify-center p-4 rounded-full border border-gold/30 bg-black/20 backdrop-blur-md hover:border-gold hover:bg-gold/10 transition-all duration-500 overflow-hidden"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            <div className="relative z-10">
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-gold transition-colors duration-500">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                        <line x1="23" y1="9" x2="17" y2="15"></line>
                                        <line x1="17" y1="9" x2="23" y2="15"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                    </svg>
                                )}
                            </div>
                            {!isMuted && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute inset-0 border border-gold rounded-full"
                                />
                            )}
                        </motion.button>
                    </div>

                    <div className="absolute bottom-10 md:bottom-12 w-full px-8 md:px-16 flex flex-col items-start justify-end z-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="font-serif text-white/95 text-[32px] md:text-[48px] lg:text-[64px] font-normal leading-[1.1] max-w-6xl tracking-tight drop-shadow-2xl"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="block mb-0 pr-12 pb-2 overflow-visible"
                            >
                                <span className="liquid-gold-text text-[18px] md:text-[24px] lg:text-[28px] tracking-[0.1em] font-meno uppercase">Himalayan</span>
                                <span className="font-cursive liquid-gold-text text-[36px] md:text-[48px] lg:text-[56px] font-medium pl-2 pr-2 tracking-wide">Luxe</span>
                            </motion.span>
                            the most sought after nuptial artist in the world
                        </motion.h2>
                    </div>
                </section>

                <section className="section-container relative h-screen w-full flex flex-col px-8 md:px-24 overflow-hidden" id="experience">
                    <div className="h-24 md:h-32 w-full flex-shrink-0"></div> {/* Nav Bar Spacer */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-[1200px] mx-auto flex-grow flex flex-col md:flex-row items-center justify-between gap-8 md:gap-8 pb-12">
                        <div className="md:w-1/2 flex flex-col items-start text-left">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activePhilosophy}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full"
                                >
                                    <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-8 block">
                                        {philosophies[activePhilosophy].title}
                                    </span>
                                    <h2 className="font-serif text-white/95 text-[28px] md:text-[36px] lg:text-[48px] leading-[1.1] font-normal tracking-tight mb-8 max-w-xl">
                                        {philosophies[activePhilosophy].heading}
                                    </h2>
                                    <p className="text-white/50 font-sans max-w-lg text-[12px] md:text-[13px] leading-[1.6] tracking-wide mb-10">
                                        {philosophies[activePhilosophy].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex flex-col gap-8">
                                <button className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit">
                                    <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                        Discover The Art
                                    </span>
                                </button>

                                <div className="flex items-center gap-12">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => {
                                                const prev = (activePhilosophy - 1 + philosophies.length) % philosophies.length;
                                                setActivePhilosophy(prev);
                                                activePhilosophyRef.current = prev;
                                            }}
                                            className="group flex items-center justify-center p-3 rounded-full border border-white/10 hover:border-gold/50 transition-all duration-500"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-gold transition-colors">
                                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const next = (activePhilosophy + 1) % philosophies.length;
                                                setActivePhilosophy(next);
                                                activePhilosophyRef.current = next;
                                            }}
                                            className="group flex items-center justify-center p-3 rounded-full border border-white/10 hover:border-gold/50 transition-all duration-500"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-gold transition-colors">
                                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {philosophies.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setActivePhilosophy(i);
                                                    activePhilosophyRef.current = i;
                                                }}
                                                className="group relative py-4"
                                            >
                                                <div className={`h-[2px] transition-all duration-700 rounded-full ${activePhilosophy === i ? 'w-12 bg-gold' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 relative h-[300px] md:h-[50vh] w-full max-w-2xl glass-card rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-2xl flex-shrink-0">
                            <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activePhilosophy}
                                        src={philosophies[activePhilosophy].image}
                                        alt={philosophies[activePhilosophy].title}
                                        initial={{ opacity: 0, scale: 1.2, filter: 'grayscale(100%)' }}
                                        animate={{ opacity: 0.8, scale: 1, filter: 'grayscale(80%)' }}
                                        exit={{ opacity: 0, scale: 0.9, filter: 'grayscale(100%)' }}
                                        whileHover={{ filter: 'grayscale(0%)', scale: 1.05 }}
                                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#022E22] via-transparent to-transparent opacity-80 pointer-events-none"></div>

                                <div className="absolute bottom-8 left-8 z-10 hidden md:block">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={activePhilosophy}
                                        className="flex flex-col"
                                    >
                                        <span className="text-[40px] font-serif text-gold/20 leading-none mb-2">0{activePhilosophy + 1}</span>
                                        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium">Philosophy</span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-container relative h-screen w-full flex flex-col items-center justify-center px-8 md:px-12 pt-24" id="destinations">
                    <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto">
                        <div className="w-full flex items-center justify-center mb-4 relative">
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px", amount: 0.3 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col items-center"
                            >
                                <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium block">
                                    Explore Us
                                </span>
                            </motion.div>

                            <motion.a
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ margin: "-100px", amount: 0.3 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                href="#all-works"
                                className="absolute right-0 text-white/70 hover:text-gold text-sm md:text-base tracking-wide transition-colors duration-500 flex items-center gap-2 group"
                            >
                                View All
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-500 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.a>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px", amount: 0.3 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            className="font-serif text-white/95 text-[24px] md:text-[36px] lg:text-[48px] font-normal leading-[1.1] tracking-tight drop-shadow-2xl mb-10 text-center"
                        >
                            Crafting timeless <span className="liquid-gold-text">moments</span>
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 1 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ margin: "-100px" }}
                            className="w-full"
                        >
                            <Skiper52 />
                        </motion.div>
                    </div>
                </section>

                <section className="section-container relative h-screen w-full flex flex-col py-20 px-8 md:px-12" id="services">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-24 flex flex-col items-center text-center"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6">Masterpieces</span>
                        <h2 className="font-serif text-white/95 text-[24px] md:text-[36px] lg:text-[44px] font-normal leading-tight">
                            Curated <span className="italic text-white/50">Excellence</span>
                        </h2>
                    </motion.div>

                    <div className="w-full max-w-[1300px] mx-auto flex flex-col border-t border-white/10">
                        {[
                            { id: '01', title: 'Grand Nuptials', desc: 'A symphony of scale and intimacy. Palatial transformations executed with microscopic precision.' },
                            { id: '02', title: 'Royal Escapes', desc: "Destination events that redefine the locale. We don't just find venues; we sculpt worlds." },
                            { id: '03', title: 'Haute Couture Decor', desc: 'Floral architecture and spatial design curated by internationally acclaimed artists.' }
                        ].map((service, i) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-50px", amount: 0.3 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 * (i + 1) }}
                                className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-16 border-b border-white/10 hover:border-gold/50 transition-colors duration-700 cursor-pointer"
                            >
                                <div className="flex items-center gap-8 md:gap-16 mb-6 md:mb-0">
                                    <span className="text-gold/40 text-sm font-light tracking-[0.2em] group-hover:text-gold transition-colors duration-700">{service.id}</span>
                                    <h3 className="font-serif text-[20px] md:text-[32px] text-white/70 group-hover:text-white transition-all duration-700 group-hover:translate-x-4">
                                        {service.title}
                                    </h3>
                                </div>
                                <p className="text-white/40 text-[12px] md:text-[13px] max-w-sm leading-relaxed md:text-right group-hover:text-white/70 transition-colors duration-700">
                                    {service.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="section-container relative h-screen w-full flex items-center justify-center px-8 md:px-12 overflow-hidden" id="cta">
                    <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-card max-w-4xl w-full p-8 md:p-16 rounded-[30px] md:rounded-[40px] text-center relative z-10"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-12 block">Begin Your Legacy</span>
                        <h2 className="font-serif text-white/95 text-[32px] md:text-[54px] lg:text-[72px] leading-[0.9] font-normal tracking-tight mb-10">
                            Shall we <br /> <span className="italic text-white/40">begin?</span>
                        </h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <button className="luxury-button rounded-full w-full md:w-auto">
                                Secure Your Date
                            </button>
                            <button className="text-white/60 hover:text-gold text-xs tracking-[0.3em] font-medium uppercase transition-colors duration-500">
                                View Lookbook
                            </button>
                        </div>
                    </motion.div>
                </section>

                <Footer />
            </div>
        </div>
    );
}

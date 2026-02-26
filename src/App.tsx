import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Silk from './Silk';
import { Skiper52 } from './components/ui/expand-on-hover';

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isMuted, setIsMuted] = useState(true);
    const [activePhilosophy, setActivePhilosophy] = useState(0);
    const [activeService, setActiveService] = useState(0);

    const activeSectionRef = useRef('hero');
    const activePhilosophyRef = useRef(0);
    const activeServiceRef = useRef(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const experienceScrollCooldownRef = useRef(0);

    const philosophies = [
        {
            title: "The Legacy",
            heading: <>We do not simply plan events. <br /><span className="italic text-white/50">We orchestrate</span> <span className="liquid-gold-text">legacies.</span></>,
            description: "For the discerning few who demand nothing less than absolute perfection, we offer an uncompromising vision of luxury. Every detail is a meticulous brushstroke on the canvas of your history. We transform ephemeral moments into eternal memories.",
            image: "/experience_image.png"
        },
        {
            title: "The Artistry",
            heading: <>Design. <br /><span className="italic text-white/50">It is a visual</span> <span className="liquid-gold-text">symphony.</span></>,
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

    const servicesData = [
        {
            id: '01',
            title: 'Grand Nuptials',
            desc: 'A symphony of scale and intimacy. Palatial transformations executed with microscopic precision.',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
        },
        {
            id: '02',
            title: 'Royal Escapes',
            desc: "Destination events that redefine the locale. We don't just find venues; we sculpt worlds.",
            image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80'
        },
        {
            id: '03',
            title: 'Haute Couture Decor',
            desc: 'Floral architecture and spatial design curated by internationally acclaimed artists.',
            image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80'
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

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                    activeSectionRef.current = entry.target.id;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: "-10% 0px -10% 0px"
        });

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const scrollCooldown = 400;
        let touchStartY = 0;

        const isExperienceInView = () => {
            const el = document.getElementById('experience');
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            return rect.top < vh * 0.75 && rect.bottom > vh * 0.25;
        };

        const pinExperienceScroll = () => {
            const el = document.getElementById('experience');
            if (!el) return;
            const top = el.offsetTop;
            window.scrollTo(0, top);
            lenis.scrollTo(top, { duration: 0 });
        };

        const handleWheel = (e: globalThis.WheelEvent) => {
            if (!isExperienceInView()) return;
            const now = Date.now();
            const direction = e.deltaY > 0 ? 1 : -1;
            const current = activePhilosophyRef.current;
            const atFirst = current === 0;
            const atLast = current === philosophies.length - 1;
            const scrollOutUp = direction < 0 && atFirst;
            const scrollOutDown = direction > 0 && atLast;

            if (scrollOutUp || scrollOutDown) return;

            e.preventDefault();
            e.stopPropagation();
            requestAnimationFrame(pinExperienceScroll);

            if (now - experienceScrollCooldownRef.current < scrollCooldown) return;
            experienceScrollCooldownRef.current = now;
            if (direction > 0) {
                const next = current + 1;
                activePhilosophyRef.current = next;
                setActivePhilosophy(next);
            } else {
                const prev = current - 1;
                activePhilosophyRef.current = prev;
                setActivePhilosophy(prev);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isExperienceInView()) e.preventDefault();
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isExperienceInView()) return;
            const now = Date.now();
            if (now - experienceScrollCooldownRef.current < scrollCooldown) return;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            if (Math.abs(deltaY) < 30) return;
            const direction = deltaY > 0 ? 1 : -1;
            const current = activePhilosophyRef.current;
            if (direction > 0) {
                if (current < philosophies.length - 1) {
                    experienceScrollCooldownRef.current = now;
                    const next = current + 1;
                    activePhilosophyRef.current = next;
                    setActivePhilosophy(next);
                } else {
                    experienceScrollCooldownRef.current = now;
                    lenis.scrollTo('#destinations', { duration: 1, lock: false });
                }
            } else {
                if (current > 0) {
                    experienceScrollCooldownRef.current = now;
                    const prev = current - 1;
                    activePhilosophyRef.current = prev;
                    setActivePhilosophy(prev);
                } else {
                    experienceScrollCooldownRef.current = now;
                    lenis.scrollTo('#hero', { duration: 1, lock: false });
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        const rafId = requestAnimationFrame(raf);

        return () => {
            window.removeEventListener('wheel', handleWheel, { capture: true });
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove, { capture: true });
            window.removeEventListener('touchend', handleTouchEnd);
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
        <div className="relative w-full max-w-[100vw] min-w-0 overflow-x-hidden">
            {/* Custom Pagination Indicator - hidden on small screens to avoid clutter */}
            <div className="fixed right-[4%] sm:right-[5%] md:right-8 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col gap-4 lg:gap-6 max-w-[100vw]">
                {sections.map((id) => (
                    <button
                        key={id}
                        onClick={() => {
                            const element = document.getElementById(id);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                setActiveSection(id);
                                activeSectionRef.current = id;

                                if (id === 'experience') {
                                    setActivePhilosophy(0);
                                    activePhilosophyRef.current = 0;
                                }
                                if (id === 'services') {
                                    setActiveService(0);
                                    activeServiceRef.current = 0;
                                }
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
            <AnimatePresence>
                {showLoader && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[300] bg-black"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: [1, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 4.0, times: [0, 0.675, 1], ease: 'easeInOut' }}
                        >
                            <Silk
                                speed={0.8}
                                scale={0.8}
                                color="#50C878"
                                noiseIntensity={3.5}
                                rotation={0}
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </motion.div>
                        <motion.img
                            layoutId="himalayan-logo"
                            src="/LOGO.svg"
                            alt="Himalayan Luxe"
                            className="fixed z-[301]"
                            style={{ width: 'auto' }}
                            initial={{
                                height: '14rem',
                                left: '50%',
                                top: '50%',
                                x: '-50%',
                                y: '-50%',
                                scale: 1
                            }}
                            animate={{
                                height: '4rem',
                                left: isDesktop ? '3rem' : '2rem',
                                top: '2.5rem',
                                x: 0,
                                y: 0,
                                scale: [1, 1.15, 1.15, 1]
                            }}
                            transition={{
                                height: { duration: 2, delay: 2.7, ease: [0.16, 1, 0.3, 1] },
                                left: { duration: 2, delay: 2.7, ease: [0.16, 1, 0.3, 1] },
                                top: { duration: 2, delay: 2.7, ease: [0.16, 1, 0.3, 1] },
                                x: { duration: 2, delay: 2.7, ease: [0.16, 1, 0.3, 1] },
                                y: { duration: 2, delay: 2.7, ease: [0.16, 1, 0.3, 1] },
                                scale: { duration: 4.7, times: [0, 0.32, 0.57, 1], ease: "easeInOut" }
                            }}
                        />
                        <motion.div
                            className="fixed z-[301] flex items-center gap-1"
                            style={{
                                left: '50%',
                                top: 'calc(50% + 4.5rem)',
                                transform: 'translateX(-50%)'
                            }}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: [1, 1.15, 1.15] }}
                            transition={{
                                scale: { duration: 2.7, times: [0, 0.55, 1], ease: "easeInOut" }
                            }}
                        >
                            <span className="liquid-gold-text text-[18px] lg:text-[28px] tracking-[0.1em] font-meno uppercase flex">
                                {Array.from("HIMALAYAN").map((char, i) => {
                                    const totalDuration = 4.7;
                                    const typingDelay = 0.3 + (i * 0.08);
                                    const vaporizeStart = 2.7 + (i * 0.08);
                                    const vaporizeEnd = vaporizeStart + 0.8;
                                    const t1 = typingDelay / totalDuration;
                                    const t2 = (typingDelay + 0.05) / totalDuration;
                                    const t3 = vaporizeStart / totalDuration;
                                    const t4 = vaporizeEnd / totalDuration;
                                    const vaporX = (i % 2 === 0 ? 1 : -1) * (20 + i * 15);
                                    const vaporY = -40 - (i % 3) * 20;
                                    const vaporRotate = (i % 2 === 0 ? 45 : -45) + i * 5;
                                    return (
                                        <motion.span
                                            key={`h-${i}`}
                                            className="inline-block relative"
                                            initial={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
                                            animate={{
                                                opacity: [0, 0, 1, 1, 0, 0],
                                                y: [0, 0, 0, 0, vaporY, vaporY],
                                                x: [0, 0, 0, 0, vaporX, vaporX],
                                                scale: [1, 1, 1, 1, 0, 0],
                                                rotate: [0, 0, 0, 0, vaporRotate, vaporRotate]
                                            }}
                                            transition={{ duration: totalDuration, times: [0, t1, t2, t3, t4, 1], ease: "easeInOut" }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </motion.span>
                                    );
                                })}
                            </span>
                            <span className="font-cursive liquid-gold-text text-[36px] lg:text-[56px] font-medium pl-2 pr-2 tracking-wide flex">
                                {Array.from("Luxe").map((char, i) => {
                                    const totalDuration = 4.7;
                                    const delayOffset = 0.3 + ("HIMALAYAN".length * 0.08);
                                    const typingDelay = delayOffset + (i * 0.08);
                                    const vaporizeStart = 2.7 + ("HIMALAYAN".length * 0.08) + (i * 0.08);
                                    const vaporizeEnd = vaporizeStart + 0.8;
                                    const t1 = typingDelay / totalDuration;
                                    const t2 = (typingDelay + 0.05) / totalDuration;
                                    const t3 = vaporizeStart / totalDuration;
                                    const t4 = vaporizeEnd / totalDuration;
                                    const vaporX = (i % 2 === 0 ? 1 : -1) * (30 + i * 20);
                                    const vaporY = -50 - (i % 2) * 20;
                                    const vaporRotate = (i % 2 === 0 ? 60 : -60) - i * 10;
                                    return (
                                        <motion.span
                                            key={`l-${i}`}
                                            className="inline-block relative"
                                            initial={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
                                            animate={{
                                                opacity: [0, 0, 1, 1, 0, 0],
                                                y: [0, 0, 0, 0, vaporY, vaporY],
                                                x: [0, 0, 0, 0, vaporX, vaporX],
                                                scale: [1, 1, 1, 1, 0, 0],
                                                rotate: [0, 0, 0, 0, vaporRotate, vaporRotate]
                                            }}
                                            transition={{ duration: totalDuration, times: [0, t1, t2, t3, t4, 1], ease: "easeInOut" }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </motion.span>
                                    );
                                })}
                            </span>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <header
                className={`fixed top-0 left-0 right-0 w-full max-w-[100vw] z-[100] px-8 md:px-12 flex items-center justify-between transition-all duration-700 ease-in-out ${activeSection === 'hero' ? 'opacity-100 pointer-events-auto pb-8 md:pb-10' : 'opacity-0 pointer-events-none py-3 md:py-4'
                    }`}
                style={{ paddingTop: activeSection === 'hero' ? 'max(env(safe-area-inset-top), 2.5rem)' : 'max(env(safe-area-inset-top), 0.75rem)' }}
            >
                <motion.img
                    layoutId="himalayan-logo"
                    src="/LOGO.svg"
                    alt="Himalayan Luxe"
                    className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto min-w-0 flex-shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showLoader ? 0 : 1 }}
                    transition={{ duration: 0 }}
                />

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 3.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2"
                >
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white hover:opacity-70 transition-opacity font-['Manrope'] text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium"
                    >
                        MENU
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white hover:opacity-70 transition-opacity flex flex-col items-end gap-[4px] sm:gap-[5px]"
                    >
                        <div className="w-6 sm:w-7 h-[1px] bg-white opacity-80"></div>
                        <div className="w-8 sm:w-9 h-[1px] bg-white opacity-80"></div>
                    </button>
                </motion.div>
            </header>

            {/* Navigation Menu Overlay */}
            <div
                className={`fixed inset-0 z-[200] transition-transform duration-1000 ease-in-out overflow-hidden ${menuOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}
                onClick={() => setMenuOpen(false)}
            >
                <div className="absolute inset-0">
                    <Silk
                        speed={0.8}
                        scale={0.8}
                        color="#50C878"
                        noiseIntensity={3.5}
                        rotation={0}
                    />
                </div>

                <div className="absolute top-6 right-4 sm:right-6 md:top-10 md:right-8 lg:right-12 z-10">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-white hover:opacity-70 transition-opacity text-4xl md:text-5xl font-light leading-none p-2"
                    >
                        ×
                    </button>
                </div>

                <div className="h-full flex items-center justify-center relative z-10 px-4">
                    <nav className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12" onClick={(e) => e.stopPropagation()}>
                        {['home', 'experience', 'destinations', 'services'].map((item, i) => (
                            <motion.a
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                                href={`#${item === 'home' ? 'hero' : item}`}
                                onClick={() => setMenuOpen(false)}
                                className="text-white font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl hover:text-gold transition-colors capitalize"
                            >
                                {item}
                            </motion.a>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="scroll-wrapper relative z-10 w-full min-w-0">
                <section className="section-container relative min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex items-center justify-center overflow-hidden" id="hero">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            playsInline
                            muted={isMuted}
                            className="w-full h-full object-cover object-center"
                        >
                            <source src="/Video.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/80"></div>
                    </div>

                    <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-12 md:right-12 z-40">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5, duration: 1 }}
                            onClick={() => setIsMuted(!isMuted)}
                            className="group relative flex items-center justify-center p-3 sm:p-4 rounded-full border border-gold/30 bg-black/20 backdrop-blur-md hover:border-gold hover:bg-gold/10 transition-all duration-500 overflow-hidden"
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

                    <div className="absolute bottom-10 md:bottom-12 w-full px-8 md:px-16 flex flex-col items-start justify-end z-20 content-contain">
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="font-serif text-white/95 text-[34px] md:text-[46px] lg:text-[56px] xl:text-[72px] font-normal leading-[1.1] max-w-6xl w-full tracking-tight drop-shadow-2xl break-words"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="block mb-2 pr-12 pb-2 overflow-visible"
                            >
                                <span className="liquid-gold-text text-[19px] md:text-[24px] lg:text-[28px] xl:text-[32px] tracking-[0.1em] font-meno uppercase">Himalayan</span>
                                <span className="font-cursive liquid-gold-text text-[38px] md:text-[48px] lg:text-[58px] xl:text-[72px] font-medium pl-2 pr-2 tracking-wide">Luxe</span>
                            </motion.span>
                            the most sought after nuptial artist in the world
                        </motion.h2>
                    </div>
                </section>

                <section className="section-container relative min-h-screen min-h-[100dvh] h-auto w-full max-w-[100vw] flex flex-col justify-center px-[4%] sm:px-[5%] md:px-[6%] lg:px-[8%] overflow-hidden py-24 md:py-32" id="experience">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,90vw)] sm:w-[min(600px,85vw)] md:w-[min(800px,80vw)] h-[min(400px,90vw)] sm:h-[min(600px,85vw)] md:h-[min(800px,80vw)] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-[1300px] min-w-0 mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 content-contain">
                        <div className="w-full md:w-1/2 flex flex-col items-start text-left min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activePhilosophy}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full"
                                >
                                    <span className="liquid-gold-text text-[10px] sm:text-[11px] md:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase font-medium mb-4 sm:mb-6 md:mb-8 block">
                                        {philosophies[activePhilosophy].title}
                                    </span>
                                    <h2 className="font-serif text-white/95 text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[52px] leading-[1.15] font-normal tracking-tight mb-4 sm:mb-6 md:mb-8 max-w-2xl break-words">
                                        {philosophies[activePhilosophy].heading}
                                    </h2>
                                    <p className="text-white/50 font-sans max-w-lg text-[12px] sm:text-[13px] md:text-[14px] leading-[1.65] tracking-wide mb-6 sm:mb-8 md:mb-10">
                                        {philosophies[activePhilosophy].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
                                <button className="group relative overflow-hidden rounded-full border border-gold/30 px-6 sm:px-8 py-3 sm:py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit text-[11px] sm:text-xs">
                                    <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                        Discover The Art
                                    </span>
                                </button>

                                <div className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-12">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <button
                                            onClick={() => {
                                                const prev = (activePhilosophy - 1 + philosophies.length) % philosophies.length;
                                                setActivePhilosophy(prev);
                                                activePhilosophyRef.current = prev;
                                            }}
                                            className="group flex items-center justify-center p-2.5 sm:p-3 rounded-full border border-white/10 hover:border-gold/50 transition-all duration-500"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-gold transition-colors sm:w-5 sm:h-5">
                                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const next = (activePhilosophy + 1) % philosophies.length;
                                                setActivePhilosophy(next);
                                                activePhilosophyRef.current = next;
                                            }}
                                            className="group flex items-center justify-center p-2.5 sm:p-3 rounded-full border border-white/10 hover:border-gold/50 transition-all duration-500"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-gold transition-colors sm:w-5 sm:h-5">
                                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {philosophies.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setActivePhilosophy(i);
                                                    activePhilosophyRef.current = i;
                                                }}
                                                className="group relative py-4"
                                            >
                                                <div className={`h-[2px] transition-all duration-700 rounded-full ${activePhilosophy === i ? 'w-8 sm:w-12 bg-gold' : 'w-3 sm:w-4 bg-white/20 group-hover:bg-white/40'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative min-h-[240px] h-[280px] sm:h-[320px] md:h-[55vh] max-h-[420px] md:max-h-none w-full max-w-2xl glass-card rounded-[20px] sm:rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-2xl flex-shrink-0 mt-4 md:mt-0">
                            <div className="relative w-full h-full rounded-[18px] sm:rounded-[22px] md:rounded-[30px] overflow-hidden">
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

                                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={activePhilosophy}
                                        className="flex flex-col"
                                    >
                                        <span className="text-[28px] sm:text-[32px] md:text-[36px] xl:text-[40px] font-serif text-gold/20 leading-none mb-1 md:mb-2">0{activePhilosophy + 1}</span>
                                        <span className="text-[8px] sm:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/40 font-medium">Philosophy</span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-container relative w-full max-w-[100vw] flex flex-col items-center justify-center px-[4%] sm:px-[5%] md:px-[6%] lg:px-[8%] py-24 md:py-32" id="destinations">
                    <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto min-w-0 content-contain">
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px", amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center mb-4 sm:mb-6"
                        >
                            <span className="liquid-gold-text text-[10px] sm:text-[11px] md:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase font-medium block">
                                Explore Us
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px", amount: 0.3 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            className="font-serif text-white/95 text-[22px] sm:text-[28px] md:text-[38px] lg:text-[48px] xl:text-[56px] font-normal leading-[1.15] tracking-tight drop-shadow-2xl mb-6 sm:mb-8 md:mb-10 text-center px-2 break-words"
                        >
                            Crafting timeless <span className="liquid-gold-text">moments</span>
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 1 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ margin: "-100px" }}
                            className="w-full max-w-full min-w-0"
                        >
                            <Skiper52 />
                        </motion.div>

                        <motion.a
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px", amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            href="#all-works"
                            className="mt-8 text-white/70 hover:text-gold text-xs sm:text-sm md:text-base tracking-wide transition-colors duration-500 flex items-center justify-center gap-2 group"
                        >
                            View All
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-500 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.a>
                    </div>
                </section>

                <section className="section-container relative min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex flex-col px-[4%] sm:px-[5%] md:px-[6%] lg:px-[8%] overflow-hidden py-24 md:py-32" id="services">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-4 sm:mb-6 md:mb-12 flex flex-col items-center text-center flex-shrink-0"
                    >
                        <span className="liquid-gold-text text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase font-medium mb-3 sm:mb-4">Masterpieces</span>
                        <h2 className="font-serif text-white/95 text-[22px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[52px] font-normal leading-tight px-2 break-words">
                            Curated <span className="italic text-white/50">Excellence</span>
                        </h2>
                    </motion.div>

                    <div className="w-full max-w-[1200px] min-w-0 mx-auto flex flex-col border-t border-white/10 flex-grow content-contain">
                        {servicesData.map((service, i) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-50px", amount: 0.3 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 * (i + 1) }}
                                onClick={() => { setActiveService(i); activeServiceRef.current = i; }}
                                className={`group relative flex flex-col py-4 sm:py-6 md:py-8 border-b border-white/10 transition-colors duration-700 cursor-pointer ${activeService === i ? 'border-gold/50' : 'hover:border-gold/30'}`}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2">
                                    <div className="flex items-center gap-4 sm:gap-6 md:gap-16 min-w-0">
                                        <span className={`text-[11px] sm:text-[12px] md:text-sm font-light tracking-[0.25em] sm:tracking-[0.3em] flex-shrink-0 transition-colors duration-700 ${activeService === i ? 'text-gold' : 'text-gold/40 group-hover:text-gold/80'}`}>{service.id}</span>
                                        <h3 className={`font-serif text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px] xl:text-[36px] transition-all duration-700 min-w-0 break-words ${activeService === i ? 'text-white md:translate-x-4' : 'text-white/70 group-hover:text-white md:group-hover:translate-x-2'}`}>
                                            {service.title}
                                        </h3>
                                    </div>
                                    <div className="hidden md:block flex-shrink-0">
                                        <span className={`text-[10px] tracking-[0.2em] font-medium transition-all duration-700 uppercase ${activeService === i ? 'text-gold opacity-100' : 'opacity-0'}`}>
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {activeService === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 sm:pt-6 md:pt-8 pl-0 md:pl-[115px] flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-10 pb-2">
                                                <p className="text-white/60 text-[12px] sm:text-[13px] md:text-[15px] max-w-lg leading-relaxed">
                                                    {service.desc}
                                                </p>
                                                <div className="w-full md:w-56 h-40 sm:h-36 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden glass-card p-1 flex-shrink-0 max-w-full">
                                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover rounded-lg sm:rounded-xl opacity-90" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="section-container relative min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex items-center justify-center px-[4%] sm:px-[5%] md:px-[6%] py-24 md:py-32 overflow-hidden" id="cta">
                    <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-card max-w-4xl w-full max-w-[92vw] p-6 sm:p-8 md:p-12 lg:p-20 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] text-center relative z-10 content-contain"
                    >
                        <span className="liquid-gold-text text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase font-medium mb-6 sm:mb-8 md:mb-12 block">Begin Your Legacy</span>
                        <h2 className="font-serif text-white/95 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[58px] xl:text-[72px] leading-[0.95] font-normal tracking-tight mb-8 sm:mb-10 md:mb-12 break-words">
                            Shall we <br /> <span className="italic text-white/40">begin?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
                            <button className="luxury-button rounded-full w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm">
                                Secure Your Date
                            </button>
                            <button className="text-white/60 hover:text-gold text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] font-medium uppercase transition-colors duration-500">
                                View Lookbook
                            </button>
                        </div>
                    </motion.div>
                </section>

                <section className="section-container relative min-h-[60vh] min-h-[60dvh] w-full max-w-[100vw] flex flex-col items-center justify-between px-[4%] sm:px-[5%] md:px-[8%] lg:px-[10%] py-12 sm:py-16 md:py-24 bg-black/40 overflow-hidden" id="footer">
                    <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-start justify-between gap-12 sm:gap-16 md:gap-12 min-w-0 content-contain">
                        <div className="flex flex-col items-start max-w-md w-full">
                            <img src="/LOGO.svg" alt="Himalayan Luxe" className="h-10 sm:h-12 w-auto mb-6 sm:mb-10 opacity-80" />
                            <p className="text-white/40 text-[12px] sm:text-[13px] md:text-sm leading-relaxed tracking-wide font-sans mb-6 sm:mb-10">
                                International award-winning nuptial artist, specializing in palatial celebrations for the world's most discerning families.
                            </p>
                            <div className="flex flex-wrap gap-6 sm:gap-8">
                                {['Instagram', 'LinkedIn', 'Vimeo'].map((social) => (
                                    <a key={social} href="#" className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-medium text-white/40 hover:text-gold transition-colors duration-500">
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12 md:gap-16 lg:gap-24 w-full md:w-auto">
                            <div className="flex flex-col gap-4 sm:gap-6">
                                <span className="text-gold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-medium mb-0 sm:mb-2">Discover</span>
                                {['About', 'Gallery', 'Venues', 'Process'].map((link) => (
                                    <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-sm font-sans tracking-wide">{link}</a>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 sm:gap-6">
                                <span className="text-gold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-medium mb-0 sm:mb-2">Explore</span>
                                {['Destinations', 'Services', 'Artistry', 'Awards'].map((link) => (
                                    <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-sm font-sans tracking-wide">{link}</a>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 sm:gap-6 col-span-2 sm:col-span-1">
                                <span className="text-gold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-medium mb-0 sm:mb-2">Legal</span>
                                {['Privacy', 'Terms', 'Concierge'].map((link) => (
                                    <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-sm font-sans tracking-wide">{link}</a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between pt-16 sm:pt-24 md:pt-32 border-t border-white/5 gap-6 md:gap-0 min-w-0 content-contain">
                        <span className="text-[10px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/20 font-medium order-2 md:order-1 text-center md:text-left">
                            © 2026 Himalayan Luxe. All Rights Reserved.
                        </span>
                        <div className="flex items-center justify-center md:justify-end gap-2 order-1 md:order-2">
                            <span className="text-[10px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/40 font-medium">Bespoke Design By</span>
                            <span className="liquid-gold-text text-[10px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold">MeroEvent</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

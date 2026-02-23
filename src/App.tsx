import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Silk from './Silk';
import { Skiper52 } from './components/ui/expand-on-hover';

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    const sections = ['hero', 'experience', 'destinations', 'services', 'cta', 'footer'];

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
            autoRaf: false,
        });

        let isAnimating = false;
        let lastScrollTime = 0;
        const scrollCooldown = 1000; // 1 second cooldown after animation starts

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const now = Date.now();
            if (isAnimating || showLoader || (now - lastScrollTime < scrollCooldown)) return;

            // Only trigger if the scroll is significant enough (avoids accidental micro-scrolls)
            if (Math.abs(e.deltaY) < 10) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            const currentIndex = sections.indexOf(activeSection);
            const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));

            if (nextIndex !== currentIndex) {
                isAnimating = true;
                lastScrollTime = now;

                lenis.scrollTo(`#${sections[nextIndex]}`, {
                    onComplete: () => {
                        // Keep animating flag true for a tiny bit longer to absorb trackpad inertia
                        setTimeout(() => {
                            isAnimating = false;
                            setActiveSection(sections[nextIndex]);
                        }, 200);
                    }
                });
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        setIsDesktop(window.innerWidth >= 768);
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);

        const handleScroll = () => {
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroBottom = heroSection.offsetHeight;
                setIsScrolled(window.scrollY > heroBottom - 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            lenis.destroy();
        };
    }, [activeSection, showLoader]);

    useEffect(() => {
        // Hide loader after 3.5 seconds
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 4700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative">
            {/* Custom Pagination Indicator */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col gap-6">
                {sections.map((id, index) => (
                    <button
                        key={id}
                        onClick={() => {
                            const element = document.getElementById(id);
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
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
                {/* Black opacity layer */}
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
                            {/* Black opacity layer */}
                            <div className="absolute inset-0 bg-black/70"></div>
                        </motion.div>
                        <motion.img
                            layoutId="himalayan-logo"
                            src="/LOGO.svg"
                            alt="Himalayan Luxe"
                            className="fixed z-[301]"
                            style={{ width: 'auto' }}
                            initial={{
                                height: '18.72rem',
                                left: '50%',
                                top: '50%',
                                x: '-50%',
                                y: '-50%',
                                scale: 1
                            }}
                            animate={{
                                height: '5rem',
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
                            <span className="liquid-gold-text text-[24px] lg:text-[38px] tracking-[0.1em] font-meno uppercase flex">
                                {Array.from("HIMALAYAN").map((char, i) => {
                                    const totalDuration = 4.7;
                                    const typingDelay = 0.3 + (i * 0.08);

                                    // Vaporize starts at 2.7s for the first letter, and subsequent letters follow
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
                            <span className="font-cursive liquid-gold-text text-[48px] lg:text-[76px] font-medium pl-2 pr-2 tracking-wide flex">
                                {Array.from("Luxe").map((char, i) => {
                                    const totalDuration = 4.7;
                                    const delayOffset = 0.3 + ("HIMALAYAN".length * 0.08); // Starts after HIMALAYAN
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

            <header className={`fixed top-0 w-full z-[100] px-8 md:px-12 flex items-center justify-between transition-all duration-700 ${isScrolled ? 'py-4' : 'py-10'
                }`}>
                <motion.img
                    layoutId="himalayan-logo"
                    src="/LOGO.svg"
                    alt="Himalayan Luxe"
                    className="h-20 w-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showLoader ? 0 : 1 }}
                    transition={{ duration: 0 }}
                />

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 3.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3"
                >
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white hover:opacity-70 transition-opacity font-['Manrope'] text-[13px] tracking-[0.3em] uppercase font-medium"
                    >
                        MENU
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white hover:opacity-70 transition-opacity flex flex-col items-end gap-[6px]"
                    >
                        <div className="w-8 h-[1px] bg-white opacity-80"></div>
                        <div className="w-12 h-[1px] bg-white opacity-80"></div>
                    </button>
                </motion.div>
            </header>

            {/* Navigation Menu Overlay */}
            <div
                className={`fixed inset-0 z-[200] transition-transform duration-1000 ease-in-out overflow-hidden ${menuOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}
                onClick={() => setMenuOpen(false)}
            >
                {/* Silk Background for Menu */}
                <div className="absolute inset-0">
                    <Silk
                        speed={0.8}
                        scale={0.8}
                        color="#50C878"
                        noiseIntensity={3.5}
                        rotation={0}
                    />
                </div>

                <div className="absolute top-10 right-8 md:right-12 z-10">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-white hover:opacity-70 transition-opacity text-5xl font-light leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="h-full flex items-center justify-center relative z-10">
                    <nav className="flex flex-col items-center gap-12" onClick={(e) => e.stopPropagation()}>
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            href="#hero"
                            onClick={() => setMenuOpen(false)}
                            className="text-white font-['Playfair_Display'] text-4xl md:text-5xl hover:text-gold transition-colors"
                        >
                            Home
                        </motion.a>
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            href="#experience"
                            onClick={() => setMenuOpen(false)}
                            className="text-white font-['Playfair_Display'] text-4xl md:text-5xl hover:text-gold transition-colors"
                        >
                            Experience
                        </motion.a>
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            href="#destinations"
                            onClick={() => setMenuOpen(false)}
                            className="text-white font-['Playfair_Display'] text-4xl md:text-5xl hover:text-gold transition-colors"
                        >
                            Destinations
                        </motion.a>
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            href="#services"
                            onClick={() => setMenuOpen(false)}
                            className="text-white font-['Playfair_Display'] text-4xl md:text-5xl hover:text-gold transition-colors"
                        >
                            Services
                        </motion.a>
                    </nav>
                </div>
            </div>

            <div className="scroll-wrapper relative z-10">
                <section className="section-container relative min-h-screen w-full flex items-center justify-center overflow-hidden" id="hero">
                    <div className="absolute inset-0 z-0">
                        <video autoPlay loop playsInline muted className="w-full h-full object-cover">
                            <source src="/Video.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/80"></div>
                    </div>

                    <div className="absolute bottom-12 md:bottom-20 w-full px-8 md:px-16 flex flex-col items-start justify-end z-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="font-serif text-white/95 text-[48px] md:text-[72px] lg:text-[96px] font-normal leading-[1.05] max-w-7xl tracking-tight drop-shadow-2xl"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="block mb-0 pr-12 pb-2 overflow-visible"
                            >
                                <span className="liquid-gold-text text-[24px] md:text-[32px] lg:text-[38px] tracking-[0.1em] font-meno uppercase">Himalayan</span>
                                <span className="font-cursive liquid-gold-text text-[48px] md:text-[72px] lg:text-[76px] font-medium pl-2 pr-2 tracking-wide">Luxe</span>
                            </motion.span>
                            the most sought after nuptial artist in the world
                        </motion.h2>
                    </div>
                </section>

                {/* The Experience Section - The Philosophy */}
                <section className="section-container relative min-h-[100vh] w-full flex items-center justify-center px-4 md:px-12 pt-40 pb-20 mt-32 overflow-hidden" id="experience">
                    {/* Decorative subtle background element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ margin: "-100px", amount: 0.3 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="md:w-2/5 flex flex-col items-start text-left"
                        >
                            <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-8 block">
                                The Philosophy
                            </span>
                            <h2 className="font-serif text-white/95 text-[40px] md:text-[56px] lg:text-[72px] leading-[1.1] font-normal tracking-tight mb-8">
                                We do not simply <br className="hidden md:block" /> plan events. <br />
                                <span className="italic text-white/50">We orchestrate</span> <br />
                                <span className="liquid-gold-text">legacies.</span>
                            </h2>
                            <p className="text-white/50 font-sans max-w-md text-sm md:text-base leading-[2] tracking-wide mb-12">
                                For the discerning few who demand nothing less than absolute perfection, we offer an uncompromising vision of luxury. Every detail is a meticulous brushstroke on the canvas of your history. We transform ephemeral moments into eternal memories.
                            </p>

                            <button className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10">
                                <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                    Discover The Art
                                </span>
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ margin: "-100px", amount: 0.3 }}
                            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                            className="md:w-3/5 relative h-[600px] w-full max-w-3xl glass-card rounded-[40px] p-4 shadow-2xl flex-shrink-0"
                        >
                            <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1533444211158-450f68045610?w=800&q=80"
                                    alt="Luxury Details"
                                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:scale-105 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#022E22] via-transparent to-transparent opacity-80"></div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Expand on Hover Section */}
                <section className="section-container relative h-screen w-full flex flex-col items-start justify-center px-8 md:px-12 pt-24" id="destinations">
                    <div className="w-full flex flex-col items-start">
                        <div className="w-full flex items-center justify-between mb-4">
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px", amount: 0.3 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col items-start"
                            >
                                <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-4 block">
                                    Explore Us
                                </span>
                            </motion.div>

                            <motion.a
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ margin: "-100px", amount: 0.3 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                href="#all-works"
                                className="text-white/70 hover:text-gold text-sm md:text-base tracking-wide transition-colors duration-500 flex items-center gap-2 group"
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
                            className="font-serif text-white/95 text-[36px] md:text-[56px] lg:text-[72px] font-normal leading-[1.05] tracking-tight drop-shadow-2xl mb-16"
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

                {/* Services Section - The Offerings */}
                <section className="section-container relative min-h-[100vh] w-full flex flex-col py-32 px-8 md:px-12" id="services">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-24 flex flex-col items-center text-center"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6">Masterpieces</span>
                        <h2 className="font-serif text-white/95 text-[36px] md:text-[56px] lg:text-[64px] font-normal leading-tight">
                            Curated <span className="italic text-white/50">Excellence</span>
                        </h2>
                    </motion.div>

                    <div className="w-full max-w-[1300px] mx-auto flex flex-col border-t border-white/10">
                        {/* Service Item 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-50px", amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-16 border-b border-white/10 hover:border-gold/50 transition-colors duration-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-8 md:gap-16 mb-6 md:mb-0">
                                <span className="text-gold/40 text-sm font-light tracking-[0.2em] group-hover:text-gold transition-colors duration-700">01</span>
                                <h3 className="font-serif text-[32px] md:text-[48px] text-white/70 group-hover:text-white transition-all duration-700 group-hover:translate-x-4">
                                    Grand Nuptials
                                </h3>
                            </div>
                            <p className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed md:text-right group-hover:text-white/70 transition-colors duration-700">
                                A symphony of scale and intimacy. Palatial transformations executed with microscopic precision.
                            </p>
                        </motion.div>

                        {/* Service Item 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-50px", amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-16 border-b border-white/10 hover:border-gold/50 transition-colors duration-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-8 md:gap-16 mb-6 md:mb-0">
                                <span className="text-gold/40 text-sm font-light tracking-[0.2em] group-hover:text-gold transition-colors duration-700">02</span>
                                <h3 className="font-serif text-[32px] md:text-[48px] text-white/70 group-hover:text-white transition-all duration-700 group-hover:translate-x-4">
                                    Royal Escapes
                                </h3>
                            </div>
                            <p className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed md:text-right group-hover:text-white/70 transition-colors duration-700">
                                Destination events that redefine the locale. We don't just find venues; we sculpt worlds.
                            </p>
                        </motion.div>

                        {/* Service Item 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-50px", amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-16 border-b border-white/10 hover:border-gold/50 transition-colors duration-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-8 md:gap-16 mb-6 md:mb-0">
                                <span className="text-gold/40 text-sm font-light tracking-[0.2em] group-hover:text-gold transition-colors duration-700">03</span>
                                <h3 className="font-serif text-[32px] md:text-[48px] text-white/70 group-hover:text-white transition-all duration-700 group-hover:translate-x-4">
                                    Haute Couture Decor
                                </h3>
                            </div>
                            <p className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed md:text-right group-hover:text-white/70 transition-colors duration-700">
                                Floral architecture and spatial design curated by internationally acclaimed artists.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section - The Call to Legacy */}
                <section className="section-container relative min-h-[100vh] w-full flex items-center justify-center px-8 md:px-12 overflow-hidden" id="cta">
                    <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ margin: "-100px", amount: 0.3 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-card max-w-5xl w-full p-16 md:p-32 rounded-[60px] text-center relative z-10"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-12 block">Begin Your Legacy</span>
                        <h2 className="font-serif text-white/95 text-[48px] md:text-[86px] lg:text-[110px] leading-[0.9] font-normal tracking-tight mb-16">
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

                {/* Footer Section */}
                <section className="section-container relative min-h-[60vh] w-full flex flex-col items-center justify-between px-8 md:px-24 py-24 bg-black/40" id="footer">
                    <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-start justify-between gap-24 md:gap-12">
                        <div className="flex flex-col items-start max-w-md">
                            <img src="/LOGO.svg" alt="Himalayan Luxe" className="h-16 w-auto mb-10 opacity-80" />
                            <p className="text-white/40 text-sm leading-relaxed tracking-wide font-sans mb-10">
                                International award-winning nuptial artist, specializing in palatial celebrations for the world's most discerning families.
                            </p>
                            <div className="flex gap-8">
                                {['Instagram', 'LinkedIn', 'Vimeo'].map((social) => (
                                    <a key={social} href="#" className="text-[10px] tracking-[0.3em] uppercase font-medium text-white/40 hover:text-gold transition-colors duration-500">
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24">
                            <div className="flex flex-col gap-6">
                                <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Discover</span>
                                {['About', 'Gallery', 'Venues', 'Process'].map((link) => (
                                    <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-sm font-sans tracking-wide">
                                        {link}
                                    </a>
                                ))}
                            </div>
                            <div className="flex flex-col gap-6">
                                <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Explore</span>
                                {['Destinations', 'Services', 'Artistry', 'Awards'].map((link) => (
                                    <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-sm font-sans tracking-wide">
                                        {link}
                                    </a>
                                ))}
                            </div>
                            <div className="flex flex-col gap-6">
                                <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Legal</span>
                                {['Privacy', 'Terms', 'Concierge'].map((link) => (
                                    <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-sm font-sans tracking-wide">
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between pt-24 border-t border-white/5">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-medium order-2 md:order-1">
                            © 2026 Himalayan Luxe. All Rights Reserved.
                        </span>
                        <div className="flex items-center gap-2 mb-8 md:mb-0 order-1 md:order-2">
                            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium">Bespoke Design By</span>
                            <span className="liquid-gold-text text-[10px] tracking-[0.3em] uppercase font-bold">MeroEvent</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

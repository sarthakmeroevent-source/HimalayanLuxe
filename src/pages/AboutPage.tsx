import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SimpleCTA from '../components/common/SimpleCTA';
import { Sparkles, Heart, Crown, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { number: '500+', label: 'Luxury Events', icon: Crown },
    { number: '50+', label: 'Countries', icon: Sparkles },
    { number: '15+', label: 'Years Excellence', icon: Award },
    { number: '100%', label: 'Satisfaction', icon: Heart }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
};

export default function AboutPage() {
    const heroRef = useRef(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        const timers = [
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
            }, 10),
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
            }, 50)
        ];

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean);
        const totalCards = cards.length;

        cards.forEach((card, index) => {
            if (!card) return;

            const isLastCard = index === totalCards - 1;
            const nextCard = cards[index + 1];

            ScrollTrigger.create({
                trigger: card,
                start: 'top top+=100px',
                end: isLastCard
                    ? '+=1'
                    : (nextCard ? `${nextCard.offsetTop - card.offsetTop}px` : `+=${window.innerHeight * 2}`),
                pin: true,
                pinSpacing: false,
            });

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

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger && cardsRef.current.includes(trigger.vars.trigger as HTMLDivElement)) {
                    trigger.kill();
                }
            });
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const yTransform = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="relative min-h-screen pt-32 pb-0 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none -mr-40 -mt-20"></div>
            <div className="absolute top-1/3 left-0 w-[800px] h-[800px] bg-emerald-deep/30 rounded-full blur-[150px] pointer-events-none -ml-60"></div>

            {/* Hero Section */}
            <section ref={heroRef} className="relative w-full px-8 md:px-16 pt-20 pb-24 md:pb-32 flex flex-col items-center justify-center min-h-[60vh]">
                <motion.div
                    style={{ y: yTransform, opacity: opacityTransform }}
                    className="max-w-[1200px] mx-auto text-center relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="flex items-center justify-center gap-3 text-gold text-xs tracking-[0.4em] uppercase font-medium mb-8">
                            <span className="h-[1px] w-8 bg-gold/50"></span>
                            Our Legacy
                            <span className="h-[1px] w-8 bg-gold/50"></span>
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Architects of <br />
                            <span className="liquid-gold-text italic">Emotion</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            We are not just event planners. We are curators of the extraordinary,
                            and guardians of your most precious moments.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Story Layout */}
            <section className="relative w-full px-8 md:px-16 py-12 md:py-20 z-10">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-6 relative order-2 lg:order-1"
                    >
                        <div className="h-[400px] lg:h-[450px] w-full rounded-[40px] overflow-hidden glass-card relative group p-2">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
                            <div className="w-full h-full rounded-[32px] bg-emerald-deep border border-white/10 flex items-center justify-center overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
                                    alt="Luxury Event Heritage"
                                    className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity hover:mix-blend-normal group-hover:scale-110 group-hover:opacity-100 transition-all duration-[1.5s]"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2"
                    >
                        <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-medium">The Beginning</span>
                        <h2 className="font-serif text-white/95 text-4xl lg:text-5xl leading-tight mb-8">
                            A passion for <span className="text-gold italic">perfection</span> evolved into a legacy.
                        </h2>
                        <div className="space-y-6 text-white/60 text-lg leading-relaxed font-light">
                            <p>
                                Founded in the heart of the Himalayas, our journey began with a singular vision:
                                to transform celebrations into timeless masterpieces that transcend generations.
                            </p>
                            <p>
                                What started as a prestigious boutique planning firm has blossomed into globally recognized
                                artisans of luxury, meticulously orchestrating the world's most sought-after and exclusive events.
                            </p>
                            <div className="pt-6 mt-6 border-t border-white/10">
                                <p className="font-serif text-white/80 text-xl italic">
                                    "Every detail matters. Every moment counts."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stacked Philosophy Section */}
            <section className="relative w-full px-4 md:px-8 py-20 z-10" id="philosophy">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 flex flex-col items-center text-center"
                >
                    <h2 className="font-serif text-white/95 text-4xl lg:text-5xl text-center">
                        Our <span className="liquid-gold-text">Philosophy</span>
                    </h2>
                </motion.div>

                <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col gap-0 items-center">
                    {[
                        { title: 'Emotional Architecture', icon: Heart, desc: "We don't just design spaces; we design how those spaces make you feel. Every element is chosen to evoke a specific emotional resonance." },
                        { title: 'Bespoke Grandeur', icon: Crown, desc: "True luxury lies in the unseen details. Our approach combines traditional grandeur with contemporary innovation." },
                        { title: 'Flawless Execution', icon: Sparkles, desc: "Perfection is our baseline. Our meticulous orchestration guarantees that your celebration unfolds effortlessly behind the scenes." }
                    ].map((phil, i) => {
                        const Icon = phil.icon;
                        return (
                            <div
                                key={i}
                                ref={(el) => (cardsRef.current[i] = el)}
                                className="flex flex-col items-center text-center justify-center w-full max-w-[1000px] h-[50vh] md:h-[60vh] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border border-white/10 will-change-transform glass-card p-10 md:p-20"
                                style={{
                                    position: 'relative',
                                    zIndex: i + 1
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none"></div>
                                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-8 border border-gold/20 relative z-10">
                                    <Icon className="w-8 h-8 text-gold" />
                                </div>
                                <h3 className="font-serif text-3xl md:text-5xl text-white/95 mb-6 relative z-10">{phil.title}</h3>
                                <p className="text-white/60 leading-relaxed font-light text-lg md:text-xl max-w-2xl relative z-10">{phil.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Metrics Glass Strip */}
            <section className="relative w-full px-8 md:px-16 pb-20 md:pb-32 z-10">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-card relative overflow-hidden rounded-[40px] p-8 md:p-16 border border-gold/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"></div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className="flex flex-col items-center text-center group">
                                        <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:border-gold/50 transition-colors duration-500">
                                            <Icon className="w-6 h-6 text-gold opacity-80" />
                                        </div>
                                        <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/95 mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-500">
                                            {stat.number}
                                        </div>
                                        <div className="text-gold text-xs tracking-[0.2em] uppercase font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team/Artisans Final Hook */}
            <section className="relative w-full px-8 md:px-16 pb-20 md:pb-32 z-10">
                <div className="max-w-[800px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="text-gold/80 text-xs tracking-[0.4em] uppercase mb-6 block font-medium">The Artisans</span>
                        <h2 className="font-serif text-white/95 text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8">
                            Meet the visionaries behind the <span className="liquid-gold-text italic">magic.</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed font-light mb-12">
                            Our team comprises world-renowned designers, master planners, and creative
                            minds who have orchestrated events for royalty, celebrities, and discerning families worldwide.
                        </p>
                        <button className="group relative overflow-hidden rounded-full border border-gold/30 px-10 py-5 transition-all duration-700 hover:border-gold hover:bg-gold/10">
                            <span className="relative z-10 text-xs font-medium uppercase tracking-[0.3em] text-gold transition-colors duration-700 group-hover:text-white">
                                Discover Our Team
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>

            <SimpleCTA />
        </div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';
import { philosophiesData } from '../data/philosophies';

interface ExperienceSectionProps {
    activePhilosophy: number;
    setActivePhilosophy: (index: number) => void;
    activePhilosophyRef: React.MutableRefObject<number>;
}

export default function ExperienceSection({ 
    activePhilosophy, 
    setActivePhilosophy, 
    activePhilosophyRef 
}: ExperienceSectionProps) {
    const philosophies = philosophiesData;

    return (
        <section className="section-container relative min-h-[100dvh] py-12 md:py-24 w-full flex flex-col px-8 md:px-24 overflow-hidden" id="experience">
            <div className="h-24 md:h-32 w-full flex-shrink-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

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
                            <h2 className="font-serif text-white/95 text-[clamp(24px,3vw,48px)] leading-[1.1] font-normal tracking-tight mb-[clamp(1rem,3vh,2rem)] max-w-xl">
                                {philosophies[activePhilosophy].heading}
                            </h2>
                            <p className="text-white/50 font-sans max-w-lg text-[clamp(12px,1vw,14px)] leading-[1.6] tracking-wide mb-[clamp(1.5rem,4vh,2.5rem)]">
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

                <div className="md:w-1/2 relative h-[clamp(300px,50vh,600px)] w-full max-w-2xl glass-card rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-2xl flex-shrink-0">
                    <div className="relative w-full h-full rounded-[20px] md:rounded-[28px] overflow-hidden">
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
                                className="absolute inset-0 w-full h-full object-cover rounded-[20px] md:rounded-[28px]"
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
    );
}

import { motion } from 'framer-motion';
import Silk from '../Silk';

export default function ServerErrorPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-6">
            {/* Local vibrant Green Silk Background */}
            <div className="absolute inset-0 z-0">
                <Silk
                    speed={0.6}
                    scale={0.7}
                    color="#16B371" // Vibrant Emerald
                    noiseIntensity={2.5}
                    rotation={45}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-deep/90 via-black/40 to-emerald-deep/80" />
            </div>

            {/* Grainy Texture */}
            <div className="grainy-texture pointer-events-none opacity-20 z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-20 w-full max-w-xl"
            >
                {/* Glass Card with Large Rounded Corners */}
                <div className="glass-card rounded-[3rem] p-12 md:p-16 text-center border-gold/10 overflow-hidden relative">
                    {/* Subtle Internal Flare */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-dark/20 blur-[80px] rounded-full" />
                    
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        >
                            <span className="liquid-gold-text text-[clamp(120px,20vw,180px)] font-meno leading-none tracking-[0.07em] block mb-4 opacity-90 select-none">
                                500
                            </span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="font-meno text-white/95 text-2xl md:text-4xl mb-6 tracking-tight uppercase"
                        >
                            Veiled in Mist
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-white/60 font-sans text-[10px] md:text-[11px] tracking-[0.3em] uppercase mb-12 max-w-xs mx-auto font-light leading-relaxed"
                        >
                            The peaks are experiencing a brief interruption. Please rest and return shortly.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <button 
                                onClick={() => window.location.reload()}
                                className="luxury-button min-w-[220px] rounded-full hover:scale-105 transition-transform duration-500"
                            >
                                Refresh
                            </button>

                            <div className="flex items-center justify-center gap-8 border-t border-white/5 pt-8 w-full">
                                <a 
                                    href="/" 
                                    className="text-white/30 hover:text-gold transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-medium"
                                >
                                    Home
                                </a>
                                <a 
                                    href="/contact" 
                                    className="text-white/30 hover:text-gold transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-medium"
                                >
                                    Contact
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Subtle Floating Flare */}
            <div className="gold-flare bottom-0 left-0 opacity-10 pointer-events-none scale-150" />
        </main>
    );
}

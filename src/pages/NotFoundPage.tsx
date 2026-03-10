import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="liquid-gold-text text-xs tracking-[0.5em] uppercase font-medium mb-8 block">
                        Lost in the Heights
                    </span>
                    
                    <h1 className="font-serif text-white/95 text-[clamp(80px,15vw,180px)] leading-none font-normal tracking-tighter mb-8">
                        4<span className="liquid-gold-text">0</span>4
                    </h1>
                    
                    <div className="h-px w-20 bg-gold/30 mx-auto mb-10"></div>
                    
                    <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed mb-12">
                        The destination you are seeking remains undiscovered or has moved to a more private summit.
                    </p>
                    
                    <Link 
                        to="/"
                        className="group relative inline-block overflow-hidden rounded-xl border border-gold/30 px-12 py-5 transition-all duration-700 hover:border-gold hover:bg-gold/10"
                    >
                        <span className="relative z-10 text-xs font-medium uppercase tracking-[0.3em] text-gold transition-colors duration-700 group-hover:text-white">
                            Return to Base
                        </span>
                    </Link>
                </motion.div>
            </div>

            {/* Subtle grain texture overlay if desired - though already in layout usually */}
            <div className="grainy-texture pointer-events-none"></div>
        </div>
    );
}

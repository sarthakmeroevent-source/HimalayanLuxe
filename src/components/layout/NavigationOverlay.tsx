import { motion } from 'framer-motion';
import Silk from '../../Silk';

interface NavigationOverlayProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export default function NavigationOverlay({ menuOpen, setMenuOpen }: NavigationOverlayProps) {
    return (
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
                    {['home', 'experience', 'destinations', 'services'].map((item, i) => (
                        <motion.a
                            key={item}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                            href={`#${item === 'home' ? 'hero' : item}`}
                            onClick={() => setMenuOpen(false)}
                            className="text-white font-['Playfair_Display'] text-3xl md:text-5xl hover:text-gold transition-colors capitalize"
                        >
                            {item}
                        </motion.a>
                    ))}
                </nav>
            </div>
        </div>
    );
}

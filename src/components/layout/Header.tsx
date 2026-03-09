import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeaderProps {
    isScrolled: boolean;
    showLoader: boolean;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export default function Header({ isScrolled, showLoader, menuOpen, setMenuOpen }: HeaderProps) {
    return (
        <header className={`fixed top-0 w-full z-[400] px-6 md:px-12 transition-all duration-700 pointer-events-auto ${isScrolled ? 'py-3 md:py-5 bg-transparent backdrop-blur-lg md:backdrop-blur-none' : 'py-8 md:py-10 bg-transparent'}`}>
            <div className="w-full flex items-center justify-between">
                <a
                    href="/"
                    className="cursor-pointer"
                    onClick={(e) => {
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                >
                    <motion.img
                        src="/LOGO.svg"
                        alt="Himalayan Luxe"
                        className="h-16 w-auto hover:opacity-80 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showLoader ? 0 : 1 }}
                        transition={{ duration: 0 }}
                    />
                </a>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 3.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-3 text-white group cursor-pointer relative z-[101] pointer-events-auto"
                        aria-label="Toggle menu"
                    >
                        <span className="font-['Manrope'] text-[11px] md:text-[13px] tracking-[0.3em] uppercase font-medium group-hover:opacity-70 transition-opacity">
                            MENU
                        </span>
                        <div className="flex flex-col items-end gap-[6px] group-hover:opacity-70 transition-opacity">
                            <div className="w-8 h-[1px] bg-white opacity-80 group-hover:w-10 transition-all duration-300"></div>
                            <div className="w-12 h-[1px] bg-white opacity-80 group-hover:w-12 transition-all duration-300"></div>
                        </div>
                    </button>
                </motion.div>
            </div>
        </header>
    );
}

import { motion } from 'framer-motion';

interface HeaderProps {
    isScrolled: boolean;
    showLoader: boolean;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export default function Header({ isScrolled, showLoader, menuOpen, setMenuOpen }: HeaderProps) {
    return (
        <header className={`fixed top-0 w-full z-[100] px-8 md:px-12 flex items-center justify-between transition-all duration-700 ${isScrolled ? 'py-4' : 'py-10'}`}>
            <motion.img
                layoutId="himalayan-logo"
                src="/LOGO.svg"
                alt="Himalayan Luxe"
                className="h-16 w-auto"
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
                    className="text-white hover:opacity-70 transition-opacity font-['Manrope'] text-[11px] md:text-[13px] tracking-[0.3em] uppercase font-medium"
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
    );
}

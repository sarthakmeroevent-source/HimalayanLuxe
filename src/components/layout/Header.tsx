import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeaderProps {
    isScrolled: boolean;
    showLoader: boolean;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export default function Header({ isScrolled, showLoader, menuOpen, setMenuOpen }: HeaderProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // Don't trigger if typing in an input or textarea
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            if (e.key.toLowerCase() === 'm' && !menuOpen) {
                setMenuOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen, setMenuOpen]);

    return (
        <header className={`fixed top-0 w-full z-[100] px-6 md:px-12 flex items-center justify-between transition-all duration-700 ease-in-out ${isScrolled ? 'py-3 md:py-4 bg-[#022E22]/30 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'py-8 md:py-10 bg-gradient-to-b from-black/40 to-transparent'}`}>
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
                className="flex items-center gap-3"
            >
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white hover:opacity-70 transition-opacity font-['Manrope'] text-[11px] md:text-[13px] tracking-[0.3em] uppercase font-medium focus:outline-none"
                >
                    MENU
                </button>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white hover:opacity-70 transition-opacity flex flex-col items-end gap-[6px] focus:outline-none"
                >
                    <div className="w-8 h-[1px] bg-white opacity-80"></div>
                    <div className="w-12 h-[1px] bg-white opacity-80"></div>
                </button>
            </motion.div>
        </header>
    );
}

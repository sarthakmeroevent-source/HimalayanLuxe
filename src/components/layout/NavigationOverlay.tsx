import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationOverlayProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

const menuItems = [
    { label: 'Home', path: '/', hash: '' },
    { label: 'Experience', path: '/experience', hash: '' },
    { label: 'Destinations', path: '/destinations', hash: '' },
    { label: 'Gallery', path: '/gallery', hash: '' },
    { label: 'Services', path: '/services', hash: '' },
    { label: 'About', path: '/about', hash: '' },
    { label: 'Contact', path: '/contact', hash: '' }
];

export default function NavigationOverlay({ menuOpen, setMenuOpen }: NavigationOverlayProps) {
    const navigate = useNavigate();
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    useEffect(() => {
        if (!menuOpen) {
            setFocusedIndex(-1);
        }
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
            } else if (e.key === 'Enter') {
                if (focusedIndex >= 0 && focusedIndex < menuItems.length) {
                    e.preventDefault();
                    handleNavigation(menuItems[focusedIndex].path);
                } else if (focusedIndex === -1) {
                    // Default to first item if nothing is hovered/focused but enter is pressed
                    e.preventDefault();
                    handleNavigation(menuItems[0].path);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen, focusedIndex, setMenuOpen]);

    const handleNavigation = (path: string) => {
        setMenuOpen(false);
        if (path === '/' && window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(path);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[500] transition-all duration-1000 ease-in-out overflow-hidden backdrop-blur-xl ${menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
                }`}
            onClick={() => setMenuOpen(false)}
        >
            {/* Premium darker glass emerald gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#022E22]/60 via-[#011F17]/85 to-[#010C08]/95 border-b border-white/5"></div>
            {/* Subtle radial glow in the center behind the links */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_60%)]"></div>

            {/* Navigation Overlay Header - pointer-events-none to prevent blocking centered links */}
            <div className="absolute top-0 left-0 w-full z-20 px-8 md:px-12 py-10 pointer-events-none">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between pointer-events-auto">
                    <motion.img
                        src="/LOGO.svg"
                        alt="Himalayan Luxe"
                        className="h-16 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: menuOpen ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onClick={() => handleNavigation('/')}
                    />

                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-white hover:text-yellow-400 transition-colors duration-500 text-5xl font-light leading-none pointer-events-auto focus:outline-none"
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="h-full flex items-center justify-center relative z-10 pointer-events-auto">
                <nav className="flex flex-col items-center gap-10 md:gap-12" onClick={(e) => e.stopPropagation()}>
                    {menuItems.map((item, i) => (
                        <motion.button
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                            onClick={() => handleNavigation(item.path)}
                            onMouseEnter={() => setFocusedIndex(i)}
                            onMouseLeave={() => setFocusedIndex(-1)}
                            onFocus={() => setFocusedIndex(i)}
                            className={`relative font-['Playfair_Display'] text-2xl md:text-3xl lg:text-4xl transition-all duration-300 ${focusedIndex === i ? 'text-yellow-400 tracking-widest' : 'text-white hover:text-yellow-400 hover:tracking-widest'}`}
                        >
                            {item.label}
                            {/* Animated elegant underline */}
                            <span 
                                className={`absolute left-1/2 -bottom-2 h-[1px] bg-yellow-400 transition-all duration-300 ease-in-out -translate-x-1/2 ${focusedIndex === i ? 'w-full' : 'w-0'}`} 
                            />
                        </motion.button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

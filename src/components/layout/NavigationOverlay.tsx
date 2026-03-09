import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationOverlayProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

const menuItems = [
    { label: 'Home', path: '/', hash: '' },
    { label: 'Destinations', path: '/destinations', hash: '' },
    { label: 'Experience', path: '/experience', hash: '' },
    { label: 'Services', path: '/services', hash: '' },
    { label: 'Gallery', path: '/gallery', hash: '' },
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
                    handleNavigation(menuItems[focusedIndex]);
                } else if (focusedIndex === -1) {
                    // Default to first item if nothing is hovered/focused but enter is pressed
                    e.preventDefault();
                    handleNavigation(menuItems[0]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen, focusedIndex, setMenuOpen]);

    const handleNavigation = (item: typeof menuItems[0]) => {
        setMenuOpen(false);
        if (item.path === '/' && window.location.pathname !== '/') {
            window.location.href = '/';
        } else {
            navigate(item.path);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[200] transition-transform duration-1000 ease-in-out overflow-hidden ${menuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            onClick={() => setMenuOpen(false)}
        >
            {/* Plain dark emerald green background */}
            <div className="absolute inset-0 bg-[#022E22]"></div>

            <div className="absolute top-10 left-8 md:left-12 z-10">
                <motion.img
                    src="/LOGO.svg"
                    alt="Himalayan Luxe"
                    className="h-16 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: menuOpen ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />
            </div>

            <div className="absolute top-10 right-8 md:right-12 z-10 flex items-center h-16">
                <button
                    onClick={() => setMenuOpen(false)}
                    className="text-white hover:text-yellow-400 transition-colors duration-500 text-5xl font-light leading-none"
                    aria-label="Close menu"
                >
                    ×
                </button>
            </div>

            <div className="h-full flex items-center justify-center relative z-10">
                <nav className="flex flex-col items-center gap-12" onClick={(e) => e.stopPropagation()}>
                    {menuItems.map((item, i) => (
                        <motion.button
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                            onClick={() => handleNavigation(item)}
                            onMouseEnter={() => setFocusedIndex(i)}
                            onMouseLeave={() => setFocusedIndex(-1)}
                            onFocus={() => setFocusedIndex(i)}
                            className={`font-['Playfair_Display'] text-2xl md:text-4xl transition-colors duration-300 ${focusedIndex === i ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}
                        >
                            {item.label}
                        </motion.button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

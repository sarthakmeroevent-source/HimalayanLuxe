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
    { label: 'Services', path: '/services', hash: '' },
    { label: 'About', path: '/about', hash: '' },
    { label: 'Contact', path: '/contact', hash: '' }
];

export default function NavigationOverlay({ menuOpen, setMenuOpen }: NavigationOverlayProps) {
    const navigate = useNavigate();

    const handleNavigation = (item: typeof menuItems[0]) => {
        setMenuOpen(false);
        navigate(item.path);
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
                    className="text-white hover:text-gold transition-colors duration-500 text-5xl font-light leading-none"
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
                            className="text-white font-['Playfair_Display'] text-2xl md:text-4xl hover:text-gold transition-colors"
                        >
                            {item.label}
                        </motion.button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

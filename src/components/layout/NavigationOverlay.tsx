import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationOverlayProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Experience', path: '/experience' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

export default function NavigationOverlay({ menuOpen, setMenuOpen }: NavigationOverlayProps) {
    const navigate = useNavigate();

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
            className={`fixed inset-0 z-[500] transition-transform duration-1000 ease-in-out overflow-hidden ${menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
                }`}
            onClick={() => setMenuOpen(false)}
        >
            {/* Plain dark emerald green background */}
            <div className="absolute inset-0 bg-[#022E22]"></div>

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
                        className="text-white hover:text-gold transition-colors duration-500 text-5xl font-light leading-none pointer-events-auto"
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
                            className="text-white font-['Playfair_Display'] text-2xl md:text-3xl lg:text-4xl hover:text-gold transition-all duration-300 hover:tracking-widest"
                        >
                            {item.label}
                        </motion.button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

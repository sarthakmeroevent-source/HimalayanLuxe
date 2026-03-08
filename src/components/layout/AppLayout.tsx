import { ReactNode } from 'react';
import Silk from '../../Silk';
import Loader from '../ui/Loader';
import Header from './Header';
import NavigationOverlay from './NavigationOverlay';
import Footer from './Footer';

interface AppLayoutProps {
    children: ReactNode;
    showLoader: boolean;
    isDesktop: boolean;
    isScrolled: boolean;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export default function AppLayout({
    children,
    showLoader,
    isDesktop,
    isScrolled,
    menuOpen,
    setMenuOpen
}: AppLayoutProps) {
    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 z-0">
                <Silk
                    speed={0.8}
                    scale={0.8}
                    color="#50C878"
                    noiseIntensity={3.5}
                    rotation={0}
                />
                <div className="absolute inset-0 bg-black/70"></div>
            </div>

            <Loader showLoader={showLoader} isDesktop={isDesktop} />

            <Header
                isScrolled={isScrolled}
                showLoader={showLoader}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />

            <NavigationOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <div className="scroll-wrapper relative z-10">
                {children}
                <Footer />
            </div>
        </div>
    );
}

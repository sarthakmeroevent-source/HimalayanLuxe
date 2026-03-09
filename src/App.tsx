import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'lenis/dist/lenis.css';
import AppLayout from './components/layout/AppLayout';
import WhatsAppFloat from './components/common/WhatsAppFloat';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import GalleryPage from './pages/GalleryPage';
import ServicesDetailPage from './pages/ServicesDetailPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPage from './pages/CookiesPage';
import TermsPage from './pages/TermsPage';
import { useScrollHandler } from './hooks/useScrollHandler';

function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // Disable browser's automatic scroll restoration to prevent flickering
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Multiple aggressive scroll resets
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Also scroll the primary scroll container if it exists
        const scrollContainer = document.querySelector('main') || document.documentElement;
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        // Additional reset after a tiny delay to catch any post-render adjustments
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 10);

        return () => clearTimeout(timer);
    }, [pathname, search]);

    return null;
}

function AppContent() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [activePhilosophy, setActivePhilosophy] = useState(0);

    const activeSectionRef = useRef('hero');
    const activePhilosophyRef = useRef(0);
    const hasShownLoader = useRef(false);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useScrollHandler({
        showLoader,
        isHomePage,
        setIsScrolled,
        setActiveSection,
        setActivePhilosophy,
        activePhilosophy,
        activeSectionRef,
        activePhilosophyRef
    });

    useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show loader when entering the home page
    useEffect(() => {
        if (isHomePage) {
            if (!hasShownLoader.current) {
                setShowLoader(true);
                hasShownLoader.current = true;
                const timer = setTimeout(() => {
                    setShowLoader(false);
                }, 4700);
                return () => clearTimeout(timer);
            }
        } else {
            hasShownLoader.current = false;
            setShowLoader(false);
        }
    }, [isHomePage]);

    return (
        <div className="relative">
            <WhatsAppFloat />
            <AppLayout
                showLoader={showLoader}
                isDesktop={isDesktop}
                isScrolled={isScrolled}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                activeSectionRef={activeSectionRef}
                                activePhilosophy={activePhilosophy}
                                setActivePhilosophy={setActivePhilosophy}
                                activePhilosophyRef={activePhilosophyRef}
                                showLoader={showLoader}
                            />
                        }
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/destinations" element={<DestinationsPage />} />
                    <Route path="/destinations/:id" element={<DestinationDetailPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/services" element={<ServicesDetailPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                </Routes>
            </AppLayout>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <AppContent />
        </Router>
    );
}

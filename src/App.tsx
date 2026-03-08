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
import PortfolioPage from './pages/PortfolioPage';
import ServicesDetailPage from './pages/ServicesDetailPage';
import ContactPage from './pages/ContactPage';
import { useScrollHandler } from './hooks/useScrollHandler';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

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
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/services" element={<ServicesDetailPage />} />
                    <Route path="/contact" element={<ContactPage />} />
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

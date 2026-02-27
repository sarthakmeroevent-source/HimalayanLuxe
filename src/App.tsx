import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'lenis/dist/lenis.css';
import AppLayout from './components/layout/AppLayout';
import SectionPagination from './components/common/SectionPagination';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import DestinationsPage from './pages/DestinationsPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesDetailPage from './pages/ServicesDetailPage';
import ContactPage from './pages/ContactPage';
import { useScrollHandler } from './hooks/useScrollHandler';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        // Also force scroll for any Lenis instance
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
    const [showActiveLabel, setShowActiveLabel] = useState(true);

    const activeSectionRef = useRef('hero');
    const activePhilosophyRef = useRef(0);

    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const sections = ['hero', 'experience', 'destinations', 'services', 'cta', 'footer'];

    useEffect(() => {
        setShowActiveLabel(true);
        const timer = setTimeout(() => setShowActiveLabel(false), 3000);
        return () => clearTimeout(timer);
    }, [activeSection]);

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

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(false), 4700);
        return () => clearTimeout(timer);
    }, []);

    const handleSectionClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 0;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight;
            
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            
            setActiveSection(id);
            activeSectionRef.current = id;

            if (id === 'experience') {
                setActivePhilosophy(0);
                activePhilosophyRef.current = 0;
            }
        }
    };

    return (
        <div className="relative">
            {isHomePage && (
                <SectionPagination
                    sections={sections}
                    activeSection={activeSection}
                    showActiveLabel={showActiveLabel}
                    onSectionClick={handleSectionClick}
                />
            )}

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
                            />
                        } 
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/destinations" element={<DestinationsPage />} />
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

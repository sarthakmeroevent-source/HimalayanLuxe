import { useEffect } from 'react';
import Lenis from 'lenis';
import { philosophiesData } from '../data/philosophies';

interface UseScrollHandlerProps {
    showLoader: boolean;
    isHomePage: boolean;
    setIsScrolled: (scrolled: boolean) => void;
    setActiveSection: (section: string) => void;
    setActivePhilosophy: (index: number) => void;
    activePhilosophy: number;
    activeSectionRef: React.MutableRefObject<string>;
    activePhilosophyRef: React.MutableRefObject<number>;
}

export function useScrollHandler({
    showLoader,
    isHomePage,
    setIsScrolled,
    setActiveSection,
    setActivePhilosophy,
    activePhilosophy,
    activeSectionRef,
    activePhilosophyRef
}: UseScrollHandlerProps) {
    useEffect(() => {
        if (showLoader) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 100);

            if (!isHomePage) return;

            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                setIsScrolled(scrollY > heroHeight - 100);
            }

            const experienceSection = document.getElementById('experience');
            if (experienceSection) {
                const rect = experienceSection.getBoundingClientRect();
                const navHeight = 100;
                
                if (rect.top <= navHeight && rect.bottom > window.innerHeight) {
                    setActiveSection('experience');
                    
                    const sectionHeight = rect.height - window.innerHeight;
                    const scrolledInSection = navHeight - rect.top;
                    const sectionScrollProgress = scrolledInSection / sectionHeight;
                    
                    const philosophyThreshold = 1 / philosophiesData.length;
                    const philosophyIndex = Math.max(0, Math.min(
                        Math.floor(sectionScrollProgress / philosophyThreshold),
                        philosophiesData.length - 1
                    ));
                    
                    const progressInCurrentPhilosophy = (sectionScrollProgress % philosophyThreshold) / philosophyThreshold;
                    
                    if (progressInCurrentPhilosophy > 0.15 && philosophyIndex !== activePhilosophy) {
                        setActivePhilosophy(philosophyIndex);
                        activePhilosophyRef.current = philosophyIndex;
                    }
                }
            }

            const sections = ['hero', 'experience', 'destinations', 'services', 'cta', 'footer'];
            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        setActiveSection(sectionId);
                        activeSectionRef.current = sectionId;
                    }
                }
            });
        };

        lenis.on('scroll', handleScroll);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);
        handleScroll();

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, [showLoader, activePhilosophy, isHomePage, setIsScrolled, setActiveSection, setActivePhilosophy, activeSectionRef, activePhilosophyRef]);
}

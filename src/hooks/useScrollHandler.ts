import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { philosophiesData } from '../data/philosophies';

gsap.registerPlugin(ScrollTrigger);

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

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 100);

            if (!isHomePage) return;

            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                setIsScrolled(scrollY > heroHeight - 100);
            }

            const sections = ['hero', 'experience', 'destinations', 'services', 'about', 'cta', 'footer'];
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

        // Refresh ScrollTrigger to ensure all section positions are accurate
        ScrollTrigger.refresh();

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
        };
    }, [showLoader, isHomePage, setIsScrolled, setActiveSection, setActivePhilosophy, activeSectionRef, activePhilosophyRef]);
}

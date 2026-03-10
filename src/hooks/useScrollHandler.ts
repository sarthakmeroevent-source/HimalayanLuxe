import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollHandlerProps {
    showLoader: boolean;
    isHomePage: boolean;
    setIsScrolled: (scrolled: boolean) => void;
    setActiveSection: (section: string) => void;
    activeSectionRef: React.MutableRefObject<string>;
}

export function useScrollHandler({
    showLoader,
    isHomePage,
    setIsScrolled,
    setActiveSection,
    activeSectionRef,
}: UseScrollHandlerProps) {
    useEffect(() => {
        if (showLoader) return;

        const isMobile = window.innerWidth < 1024;

        let lenis: Lenis | null = null;
        let tick: ((time: number) => void) | null = null;
        
        if (!isMobile) {
            lenis = new Lenis({
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

            tick = (time: number) => {
                lenis?.raf(time * 1000);
            };

            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);

            lenis.on('scroll', handleScroll);
        } else {
            // On mobile, just use the window scroll listener
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        // Use IntersectionObserver instead of getBoundingClientRect in a scroll loop
        const sectionIds = ['hero', 'experience', 'destinations', 'services', 'about', 'cta', 'footer'];
        const observers: IntersectionObserver[] = [];

        if (isHomePage) {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        setActiveSection(id);
                        activeSectionRef.current = id;
                    }
                });
            }, observerOptions);

            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.observe(el);
            });
            observers.push(observer);
        }

        function handleScroll() {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 100);

            if (!isHomePage) return;

            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                setIsScrolled(scrollY > heroHeight - 100);
            }
        }

        handleScroll();
        ScrollTrigger.refresh();

        return () => {
            if (lenis) {
                lenis.destroy();
            }
            if (tick) {
                gsap.ticker.remove(tick);
            }
            window.removeEventListener('scroll', handleScroll);
            observers.forEach(o => o.disconnect());
        };
    }, [showLoader, isHomePage, setIsScrolled, setActiveSection, activeSectionRef]);
}

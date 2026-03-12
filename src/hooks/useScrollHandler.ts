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

            lenis.on('scroll', ScrollTrigger.update);

            tick = (time: number) => {
                lenis?.raf(time * 1000);
            };

            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
        }

        // Cache hero height once — don't read it on every scroll
        let cachedHeroHeight = 0;
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            cachedHeroHeight = heroSection.offsetHeight;
        }

        // Debounced scroll state — only update React state when the value actually changes
        let lastIsScrolled = false;

        function handleScroll() {
            const scrollY = window.scrollY;
            const threshold = isHomePage && cachedHeroHeight > 0
                ? cachedHeroHeight - 100
                : 100;
            const nowScrolled = scrollY > threshold;

            if (nowScrolled !== lastIsScrolled) {
                lastIsScrolled = nowScrolled;
                setIsScrolled(nowScrolled);
            }
        }

        if (lenis) {
            lenis.on('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        // Section tracking via IntersectionObserver (no scroll-loop reads)
        const observers: IntersectionObserver[] = [];

        if (isHomePage) {
            const sectionIds = ['hero', 'experience', 'destinations', 'services', 'about', 'cta', 'footer'];

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        if (activeSectionRef.current !== id) {
                            activeSectionRef.current = id;
                            setActiveSection(id);
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: '-20% 0px -20% 0px',
                threshold: 0.1
            });

            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.observe(el);
            });
            observers.push(observer);
        }

        // Recache hero height on resize
        const handleResize = () => {
            if (heroSection) {
                cachedHeroHeight = heroSection.offsetHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        handleScroll();
        ScrollTrigger.refresh();

        return () => {
            if (lenis) lenis.destroy();
            if (tick) gsap.ticker.remove(tick);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            observers.forEach(o => o.disconnect());
        };
    }, [showLoader, isHomePage, setIsScrolled, setActiveSection, activeSectionRef]);
}

import { useState } from 'react';
import HeroSection from '../sections/HeroSection';
import ExperienceSectionSticky from '../sections/ExperienceSectionSticky';
import DestinationsSection from '../sections/DestinationsSection';
import ServicesSection from '../sections/ServicesSection';
import AboutSection from '../sections/AboutSection';
import GallerySection from '../sections/GallerySection';
import CTASection from '../sections/CTASection';
import { useDestinations } from '../hooks/useDestinations';

interface HomePageProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    activeSectionRef: React.MutableRefObject<string>;
    activePhilosophy: number;
    setActivePhilosophy: (index: number) => void;
    activePhilosophyRef: React.MutableRefObject<number>;
    showLoader?: boolean;
}

export default function HomePage({
    activeSection,
    setActiveSection,
    activeSectionRef,
    activePhilosophy,
    setActivePhilosophy,
    activePhilosophyRef,
    showLoader
}: HomePageProps) {
    // Start muted to ensure autoplay works on all devices (especially mobile)
    const [isMuted, setIsMuted] = useState(true);
    
    // Prefetch destinations data early
    useDestinations();

    return (
        <>
            <HeroSection isMuted={isMuted} setIsMuted={setIsMuted} />

            <ExperienceSectionSticky
                activePhilosophy={activePhilosophy}
                setActivePhilosophy={setActivePhilosophy}
                activePhilosophyRef={activePhilosophyRef}
            />

            <DestinationsSection />

            <ServicesSection />

            <AboutSection />

            <GallerySection />

            <CTASection />
        </>
    );
}

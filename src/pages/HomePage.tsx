import { useState } from 'react';
import HeroSection from '../sections/HeroSection';
import ExperienceSectionSticky from '../sections/ExperienceSectionSticky';
import DestinationsSection from '../sections/DestinationsSection';
import ServicesSection from '../sections/ServicesSection';
import AboutSection from '../sections/AboutSection';
import CTASection from '../sections/CTASection';

interface HomePageProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    activeSectionRef: React.MutableRefObject<string>;
    activePhilosophy: number;
    setActivePhilosophy: (index: number) => void;
    activePhilosophyRef: React.MutableRefObject<number>;
}

export default function HomePage({ 
    activeSection, 
    setActiveSection, 
    activeSectionRef,
    activePhilosophy,
    setActivePhilosophy,
    activePhilosophyRef
}: HomePageProps) {
    const [isMuted, setIsMuted] = useState(true);

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

            <CTASection />
        </>
    );
}

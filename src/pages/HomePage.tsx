import { useState, useMemo, useEffect } from 'react';
import HeroSection from '../sections/HeroSection';
import ExperienceSectionSticky from '../sections/ExperienceSectionSticky';
import DestinationsSection from '../sections/DestinationsSection';
import ServicesSection from '../sections/ServicesSection';
import AboutSection from '../sections/AboutSection';
import GallerySection from '../sections/GallerySection';
import CTASection from '../sections/CTASection';
import { useDestinations } from '../hooks/useDestinations';
import { useGallery } from '../hooks/useGallery';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { imgSize } from '../lib/imageOptimizer';

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
    // Start with sound off (muted) for both mobile and desktop
    // This matches the actual video state (muted for autoplay compliance)
    // User can click volume button to unmute
    const [isMuted, setIsMuted] = useState(true);
    
    // Prefetch destinations & gallery data early so images start loading before scroll
    const { data: destinations } = useDestinations();
    const { data: galleryImages } = useGallery();

    const preloadUrls = useMemo(() => {
        const urls: string[] = [];
        if (destinations) {
            destinations.slice(0, 10).forEach((d) => {
                if (d.cover_image_url) urls.push(imgSize.destinationCard(d.cover_image_url));
            });
        }
        if (galleryImages) {
            galleryImages.slice(0, 9).forEach((img) => {
                if (img.image_url) urls.push(imgSize.galleryThumb(img.image_url));
            });
        }
        return urls;
    }, [destinations, galleryImages]);

    useImagePreloader(preloadUrls);

    return (
        <>
            <HeroSection isMuted={isMuted} setIsMuted={setIsMuted} showLoader={showLoader} />

            <ExperienceSectionSticky
                activePhilosophy={activePhilosophy}
                setActivePhilosophy={setActivePhilosophy}
                activePhilosophyRef={activePhilosophyRef}
            />

            <DestinationsSection />

            <ServicesSection />

            <GallerySection />

            <AboutSection />

            <CTASection />
        </>
    );
}

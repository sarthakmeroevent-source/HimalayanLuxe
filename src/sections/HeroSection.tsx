import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useActiveHero } from '../hooks/useHeroSettings';

interface HeroSectionProps {
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
}

const FALLBACK_VIDEO = '/Video.mp4';
const FALLBACK_TAGLINE = 'the most sought after nuptial artist in the world';

export default function HeroSection({ isMuted, setIsMuted }: HeroSectionProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [fixedHeight, setFixedHeight] = useState<string | number>('100dvh');
    const { data: hero } = useActiveHero();
    const [mediaError, setMediaError] = useState(false);

    const mediaUrl = (!mediaError && hero?.media_url) || FALLBACK_VIDEO;
    const tagline = hero?.tagline || FALLBACK_TAGLINE;
    const isVideo = mediaError ? true : (hero ? hero.media_type === 'video' : true);

    // Lock height on mobile to prevent address bar resizing jumps
    useLayoutEffect(() => {
        let initialWidth = window.innerWidth;

        const lockHeight = () => {
            if (window.innerWidth < 768) {
                setFixedHeight(window.innerHeight);
            } else {
                setFixedHeight('100dvh');
            }
        };

        lockHeight();

        const handleResize = () => {
            if (Math.abs(window.innerWidth - initialWidth) > 50) {
                initialWidth = window.innerWidth;
                lockHeight();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            video.play().catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const section = sectionRef.current;

        if (!video || !section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log("Play prevented:", e));
                        video.muted = isMuted;
                    } else {
                        video.pause();
                        video.muted = true;
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [isMuted]);

    return (
        <section
            ref={sectionRef}
            className="section-container relative w-full flex flex-col justify-between overflow-visible bg-transparent md:mb-0"
            id="hero"
            style={{ minHeight: fixedHeight }}
        >
            <div className="absolute inset-0 z-0" style={{ height: fixedHeight }}>
                {isVideo ? (
                    <video
                        key={mediaUrl}
                        ref={videoRef}
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        className="w-full h-full object-cover"
                        onError={() => setMediaError(true)}
                    >
                        <source src={mediaUrl} type="video/mp4" onError={() => setMediaError(true)} />
                    </video>
                ) : (
                    <img key={mediaUrl} src={mediaUrl} alt="Hero" className="w-full h-full object-cover" onError={() => setMediaError(true)} />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/80"></div>
            </div>

            <div className="absolute bottom-14 right-[clamp(1.5rem,4vw,3rem)] z-40 hidden md:flex items-center justify-center">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="group relative flex items-center justify-center p-4 rounded-full border border-gold/30 bg-black/20 backdrop-blur-md hover:border-gold hover:bg-gold/10 transition-all duration-500 overflow-hidden"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    <div className="relative z-10">
                        {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-white/60 group-hover:text-gold transition-colors duration-500">
                                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                <line x1="23" y1="9" x2="17" y2="15"></line>
                                <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gold">
                                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </svg>
                        )}
                    </div>
                </motion.button>
            </div>

            <div className="w-full px-[clamp(1.5rem,4vw,4rem)] pb-6 md:pb-14 pt-[120px] flex flex-col items-start justify-end z-20" style={{ height: fixedHeight }}>
                {/* Mobile Sound Button */}
                <div className="md:hidden mb-6">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3.5, duration: 1 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className="group relative flex items-center justify-center p-2 rounded-full border border-gold/30 bg-black/20 backdrop-blur-md hover:border-gold hover:bg-gold/10 transition-all duration-500 overflow-hidden"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        <div className="relative z-10">
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px] text-white/60 group-hover:text-gold transition-colors duration-500">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                    <line x1="23" y1="9" x2="17" y2="15"></line>
                                    <line x1="17" y1="9" x2="23" y2="15"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px] text-gold">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            )}
                        </div>
                        {!isMuted && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 border border-gold rounded-full"
                            />
                        )}
                    </motion.button>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-white/95 text-[clamp(38px,4vw,64px)] font-normal leading-[1.1] max-w-[80vw] md:max-w-4xl tracking-tight drop-shadow-2xl"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="block pr-12 overflow-visible"
                    >
                        <span className="liquid-gold-text text-[clamp(18px,1.5vw,28px)] tracking-[0.1em] font-meno uppercase">Himalayan</span>
                        <span className="font-cursive liquid-gold-text text-[clamp(40px,3.5vw,56px)] font-medium pl-2 pr-2 tracking-wide">Luxe</span>
                    </motion.span>
                    {tagline}
                </motion.h2>
            </div>
        </section>
    );
}

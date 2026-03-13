import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useActiveHero } from '../hooks/useHeroSettings';
import { videoSize } from '../lib/imageOptimizer';

interface HeroSectionProps {
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
}

export default function HeroSection({ isMuted, setIsMuted }: HeroSectionProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [fixedHeight, setFixedHeight] = useState<string | number>('100dvh');
    const [mediaError, setMediaError] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    
    // Always call hooks at the top level - never conditionally
    const { data: hero, isLoading, error } = useActiveHero();

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

        // Detect mobile and iOS
        const detectDevice = () => {
            const mobile = window.innerWidth < 768;
            const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
            setIsMobile(mobile);
            setIsIOS(ios);
        };

        lockHeight();
        detectDevice();

        const handleResize = () => {
            if (Math.abs(window.innerWidth - initialWidth) > 50) {
                initialWidth = window.innerWidth;
                lockHeight();
                detectDevice();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const section = sectionRef.current;
        
        if (!video || !section || hero?.media_type !== 'video') return;

        // Intersection Observer to pause video when out of view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === section) {
                        if (entry.isIntersecting) {
                            // Video is in view - resume if it was playing
                            if (video.paused && !isIOS) {
                                video.play().catch(e => console.log("Resume play failed:", e));
                            }
                        } else {
                            // Video is out of view - pause to save resources
                            if (!video.paused) {
                                video.pause();
                                console.log("Video paused - out of view");
                            }
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of video is visible
                rootMargin: '0px 0px -30% 0px' // Very aggressive margin to pause sooner
            }
        );

        observer.observe(section);

        // Additional scroll-based fallback
        const handleScroll = () => {
            if (!section || !video) return;
            
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If hero section is mostly out of view (less than 40% visible)
            if (rect.bottom < windowHeight * 0.4) {
                if (!video.paused) {
                    video.pause();
                    console.log("Video paused - scroll fallback");
                }
            } else if (rect.top < windowHeight * 0.6) {
                // If hero section is mostly in view and video is paused
                if (video.paused && !isIOS) {
                    video.play().catch(e => console.log("Resume play failed - scroll fallback:", e));
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hero?.media_type, isIOS]);

    useEffect(() => {
        const video = videoRef.current;
        if (video && hero?.media_type === 'video') {
            // Mobile-specific optimizations
            if (isMobile) {
                // Reduce quality for mobile performance
                video.preload = 'metadata';
                // Disable picture-in-picture on mobile
                video.disablePictureInPicture = true;
            }
            
            // Always start muted for autoplay compliance
            video.muted = true;
            video.defaultMuted = true;
            
            // Multiple attempts to ensure video plays
            const attemptPlay = async () => {
                try {
                    // For iOS, don't attempt autoplay - wait for user interaction
                    if (isIOS) {
                        console.log("iOS detected - waiting for user interaction");
                        return;
                    }
                    
                    await video.play();
                    console.log("Video playing successfully");
                } catch (error) {
                    console.log("Play attempt failed:", error);
                    // For Android, retry with lower quality settings
                    if (isMobile && !isIOS) {
                        video.preload = 'none';
                        setTimeout(() => {
                            video.load();
                            video.play().catch(e => console.log("Retry failed:", e));
                        }, 1000);
                    }
                }
            };
            
            // Try to play immediately (except on iOS)
            if (!isIOS) {
                attemptPlay();
            }
            
            // Also try when video loads
            video.addEventListener('loadeddata', attemptPlay);
            video.addEventListener('canplay', attemptPlay);
            
            // Handle page visibility changes (mobile address bar issues)
            const handleVisibilityChange = () => {
                if (!document.hidden && video.paused && !isIOS) {
                    console.log("Page became visible, restarting video");
                    attemptPlay();
                }
            };
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // Handle focus/blur events
            const handleFocus = () => {
                if (video.paused && !isIOS) {
                    console.log("Window focused, restarting video");
                    attemptPlay();
                }
            };
            
            window.addEventListener('focus', handleFocus);
            
            return () => {
                video.removeEventListener('loadeddata', attemptPlay);
                video.removeEventListener('canplay', attemptPlay);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('focus', handleFocus);
            };
        }
    }, [hero?.media_type, isMobile, isIOS]);

    // Handle mobile hero click for sound toggle
    const handleMobileHeroClick = () => {
        if (!isMobile || hero?.media_type !== 'video') return;
        
        setHasUserInteracted(true);
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        const video = videoRef.current;
        if (video) {
            // On iOS, first interaction should start the video
            if (isIOS && video.paused) {
                video.muted = true; // Start muted for iOS
                video.play().then(() => {
                    // Then apply user's mute preference
                    video.muted = newMutedState;
                }).catch(e => console.log("iOS play failed:", e));
            } else {
                video.muted = newMutedState;
                // Ensure video plays when unmuting
                if (!newMutedState && video.paused) {
                    video.play().catch(e => console.log("Play failed:", e));
                }
            }
        }
    };
    useEffect(() => {
        const video = videoRef.current;
        if (!video || hero?.media_type !== 'video') return;

        // Simple approach: just ensure video plays and handle mute state
        const handleMuteState = () => {
            if (hasUserInteracted) {
                video.muted = isMuted;
            } else {
                video.muted = true; // Always muted until user interacts
            }
        };

        handleMuteState();
    }, [isMuted, hasUserInteracted, hero?.media_type]);

    // Determine what to render based on state
    const mediaUrl = !mediaError ? hero?.media_url : null;
    const optimizedVideoUrl = mediaUrl && hero?.media_type === 'video' ? videoSize.hero(mediaUrl) : mediaUrl;
    const posterUrl = mediaUrl && hero?.media_type === 'video' ? videoSize.poster(mediaUrl) : undefined;
    const tagline = hero?.tagline;
    const isVideo = hero?.media_type === 'video';

    // Fallback to original URL if optimized version fails
    const [videoSrc, setVideoSrc] = useState<string | undefined>(optimizedVideoUrl || undefined);
    
    useEffect(() => {
        setVideoSrc(optimizedVideoUrl || undefined);
    }, [optimizedVideoUrl]);

    // Show loading state while fetching hero data
    if (isLoading) {
        return (
            <section
                className="section-container relative w-full flex flex-col justify-center items-center overflow-visible bg-transparent"
                id="hero"
                style={{ minHeight: fixedHeight }}
            >
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    // Show error state if API fails
    if (error || !hero) {
        return (
            <section
                className="section-container relative w-full flex flex-col justify-center items-center overflow-visible bg-transparent"
                id="hero"
                style={{ minHeight: fixedHeight }}
            >
                <div className="text-center">
                    <p className="text-white/60 text-sm mb-4">Unable to load hero content</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-2 rounded-full border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold/10 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    // Show error state if no media URL
    if (!mediaUrl) {
        return (
            <section
                className="section-container relative w-full flex flex-col justify-center items-center overflow-visible bg-transparent"
                id="hero"
                style={{ minHeight: fixedHeight }}
            >
                <div className="text-center">
                    <p className="text-white/60 text-sm mb-4">Media content unavailable</p>
                    <button 
                        onClick={() => setMediaError(false)} 
                        className="px-6 py-2 rounded-full border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold/10 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            className={`section-container relative w-full flex flex-col justify-between overflow-visible bg-transparent mb-16 md:mb-0 ${
                isMobile && hero?.media_type === 'video' ? 'cursor-pointer' : ''
            }`}
            id="hero"
            style={{ minHeight: fixedHeight }}
            onClick={handleMobileHeroClick}
        >
            <div className="absolute inset-0 z-0" style={{ height: fixedHeight }}>
                {isVideo ? (
                    <>
                        <video
                            key={videoSrc}
                            ref={videoRef}
                            autoPlay={!isIOS}
                            loop
                            playsInline
                            muted
                            preload={isMobile ? "metadata" : "auto"}
                            className="w-full h-full object-cover"
                            poster={posterUrl}
                            disablePictureInPicture={isMobile}
                            controls={isIOS}
                            style={{
                                // Performance optimizations for mobile
                                ...(isMobile && {
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden',
                                    willChange: 'auto'
                                })
                            }}
                            onLoadStart={() => {
                                console.log("Video load started");
                            }}
                            onLoadedData={() => {
                                console.log("Video data loaded");
                                const video = videoRef.current;
                                if (video) {
                                    video.muted = true;
                                    video.play().catch(e => console.log("onLoadedData play failed:", e));
                                }
                            }}
                            onCanPlay={() => {
                                console.log("Video can play");
                                const video = videoRef.current;
                                if (video && video.paused) {
                                    video.muted = true;
                                    video.play().catch(e => console.log("onCanPlay play failed:", e));
                                }
                            }}
                            onPlay={() => {
                                console.log("Video started playing");
                            }}
                            onStalled={() => {
                                // Handle Android stuttering
                                if (isMobile && !isIOS) {
                                    console.log("Video stalled, attempting recovery");
                                    const video = videoRef.current;
                                    if (video) {
                                        video.load();
                                    }
                                }
                            }}
                            onWaiting={() => {
                                // Handle buffering issues on mobile
                                if (isMobile) {
                                    console.log("Video waiting/buffering");
                                }
                            }}
                            onError={(e) => {
                                console.error("Video error:", e);
                                // If optimized video fails, fallback to original
                                if (videoSrc !== mediaUrl && mediaUrl) {
                                    console.log("Falling back to original video URL");
                                    setVideoSrc(mediaUrl || undefined);
                                } else {
                                    setMediaError(true);
                                }
                            }}
                        >
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {/* Fallback image if video fails */}
                        {mediaError && posterUrl && (
                            <img 
                                src={posterUrl} 
                                alt="Hero" 
                                className="w-full h-full object-cover" 
                                onError={() => console.log("Fallback image also failed")}
                            />
                        )}
                    </>
                ) : (
                    <img key={mediaUrl} src={mediaUrl} alt="Hero" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/80"></div>
            </div>

            {/* Mobile tap hint - only show on mobile for videos */}
            {isMobile && hero?.media_type === 'video' && !hasUserInteracted && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ 
                            duration: 2, 
                            repeat: 3, 
                            repeatDelay: 1,
                            ease: "easeInOut" 
                        }}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="opacity-80"
                        >
                            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        </svg>
                    </motion.div>
                </div>
            )}

            <div className="absolute bottom-14 right-[clamp(1.5rem,4vw,3rem)] z-40 hidden md:flex items-center justify-center">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    onClick={() => {
                        setHasUserInteracted(true);
                        const newMutedState = !isMuted;
                        setIsMuted(newMutedState);
                        const video = videoRef.current;
                        if (video) {
                            video.muted = newMutedState;
                            // Ensure video plays when unmuting
                            if (!newMutedState && video.paused) {
                                video.play().catch(e => console.log("Play failed:", e));
                            }
                        }
                    }}
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

            <div className="w-full px-[clamp(1.5rem,4vw,4rem)] pb-10 md:pb-14 pt-[120px] flex flex-col items-start justify-end z-20" style={{ height: fixedHeight }}>
                {/* Mobile Sound Button */}
                <div className="md:hidden mb-6">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent hero section click
                            setHasUserInteracted(true);
                            const newMutedState = !isMuted;
                            setIsMuted(newMutedState);
                            const video = videoRef.current;
                            if (video) {
                                // On iOS, first interaction should start the video
                                if (isIOS && video.paused) {
                                    video.muted = true; // Start muted for iOS
                                    video.play().then(() => {
                                        // Then apply user's mute preference
                                        video.muted = newMutedState;
                                    }).catch(e => console.log("iOS play failed:", e));
                                } else {
                                    video.muted = newMutedState;
                                    // Ensure video plays when unmuting
                                    if (!newMutedState && video.paused) {
                                        video.play().catch(e => console.log("Play failed:", e));
                                    }
                                }
                            }
                        }}
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
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={isMobile ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-white/95 text-[clamp(38px,4vw,64px)] font-normal leading-[1.1] max-w-[80vw] md:max-w-4xl tracking-tight drop-shadow-2xl"
                >
                    <motion.span
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={isMobile ? { duration: 0 } : { duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
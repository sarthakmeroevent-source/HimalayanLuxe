import { useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Silk from '../../Silk';

interface LoaderProps {
    showLoader: boolean;
    isDesktop: boolean;
}

export default function Loader({ showLoader, isDesktop }: LoaderProps) {
    const logoRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        if (!logoRef.current || !showLoader) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Initial setup
            gsap.set(logoRef.current, {
                height: '14rem',
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                scale: 1,
            });

            // Scale heartbeat
            tl.to(logoRef.current, {
                scale: 1.15,
                duration: 1.175,
                ease: "power2.inOut"
            }, 1.504)
                .to(logoRef.current, {
                    scale: 1,
                    duration: 2.021,
                    ease: "power2.inOut"
                }, 2.679);

            // Move to exactly match the header logo coordinates
            tl.to(logoRef.current, {
                height: '4rem',
                left: isDesktop ? '48px' : '32px',
                top: isDesktop ? '40px' : '48px',
                xPercent: 0,
                yPercent: 0,
                duration: 2.2,
                ease: "expo.inOut"
            }, 2.5);
        }, logoRef);

        return () => {
            ctx.revert();
        };
    }, [showLoader, isDesktop]);

    return (
        <AnimatePresence>
            {showLoader && (
                <>
                    <motion.div
                        className="fixed inset-0 z-[300] bg-black pointer-events-none"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, delay: 3.5, ease: 'easeOut' }}
                    >
                        <Silk
                            speed={0.8}
                            scale={0.8}
                            color="#50C878"
                            noiseIntensity={3.5}
                            rotation={0}
                        />
                        <div className="absolute inset-0 bg-black/70"></div>
                    </motion.div>

                    <motion.div
                        className="fixed inset-0 z-[301] pointer-events-none"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0 }}
                    >
                        <img
                            ref={logoRef}
                            src="/LOGO.svg"
                            alt="Himalayan Luxe"
                            className="absolute pointer-events-auto"
                            style={{
                                width: 'auto',
                                height: '4rem',
                                left: isDesktop ? '48px' : '32px',
                                top: isDesktop ? '40px' : '48px'
                            }}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

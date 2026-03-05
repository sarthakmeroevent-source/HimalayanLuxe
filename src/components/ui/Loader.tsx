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
                        className="fixed inset-0 z-[300] bg-black"
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

                    <motion.div
                        className="fixed z-[301] flex items-center gap-1"
                        style={{
                            left: '50%',
                            top: 'calc(50% + 4.5rem)',
                            transform: 'translateX(-50%)'
                        }}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: [1, 1.15, 1.15] }}
                        exit={{ opacity: 0 }}
                        transition={{
                            scale: { duration: 2.7, times: [0, 0.55, 1], ease: "easeInOut" },
                            opacity: { duration: 0.5 }
                        }}
                    >
                        <span className="liquid-gold-text text-[18px] lg:text-[28px] tracking-[0.1em] font-meno uppercase flex">
                            {Array.from("HIMALAYAN").map((char, i) => {
                                const totalDuration = 4.7;
                                const typingDelay = 0.3 + (i * 0.08);
                                const vaporizeStart = 2.7 + (i * 0.08);
                                const vaporizeEnd = vaporizeStart + 0.8;
                                const t1 = typingDelay / totalDuration;
                                const t2 = (typingDelay + 0.05) / totalDuration;
                                const t3 = vaporizeStart / totalDuration;
                                const t4 = vaporizeEnd / totalDuration;
                                const vaporX = (i % 2 === 0 ? 1 : -1) * (20 + i * 15);
                                const vaporY = -40 - (i % 3) * 20;
                                const vaporRotate = (i % 2 === 0 ? 45 : -45) + i * 5;
                                return (
                                    <motion.span
                                        key={`h-${i}`}
                                        className="inline-block relative"
                                        initial={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
                                        animate={{
                                            opacity: [0, 0, 1, 1, 0, 0],
                                            y: [0, 0, 0, 0, vaporY, vaporY],
                                            x: [0, 0, 0, 0, vaporX, vaporX],
                                            scale: [1, 1, 1, 1, 0, 0],
                                            rotate: [0, 0, 0, 0, vaporRotate, vaporRotate]
                                        }}
                                        transition={{ duration: totalDuration, times: [0, t1, t2, t3, t4, 1], ease: "easeInOut" }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                );
                            })}
                        </span>
                        <span className="font-cursive liquid-gold-text text-[36px] lg:text-[56px] font-medium pl-2 pr-2 tracking-wide flex">
                            {Array.from("Luxe").map((char, i) => {
                                const totalDuration = 4.7;
                                const delayOffset = 0.3 + ("HIMALAYAN".length * 0.08);
                                const typingDelay = delayOffset + (i * 0.08);
                                const vaporizeStart = 2.7 + ("HIMALAYAN".length * 0.08) + (i * 0.08);
                                const vaporizeEnd = vaporizeStart + 0.8;
                                const t1 = typingDelay / totalDuration;
                                const t2 = (typingDelay + 0.05) / totalDuration;
                                const t3 = vaporizeStart / totalDuration;
                                const t4 = vaporizeEnd / totalDuration;
                                const vaporX = (i % 2 === 0 ? 1 : -1) * (30 + i * 20);
                                const vaporY = -50 - (i % 2) * 20;
                                const vaporRotate = (i % 2 === 0 ? 60 : -60) - i * 10;
                                return (
                                    <motion.span
                                        key={`l-${i}`}
                                        className="inline-block relative"
                                        initial={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
                                        animate={{
                                            opacity: [0, 0, 1, 1, 0, 0],
                                            y: [0, 0, 0, 0, vaporY, vaporY],
                                            x: [0, 0, 0, 0, vaporX, vaporX],
                                            scale: [1, 1, 1, 1, 0, 0],
                                            rotate: [0, 0, 0, 0, vaporRotate, vaporRotate]
                                        }}
                                        transition={{ duration: totalDuration, times: [0, t1, t2, t3, t4, 1], ease: "easeInOut" }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                );
                            })}
                        </span>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

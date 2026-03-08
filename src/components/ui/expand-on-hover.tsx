"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { cn } from "@/lib/utils";

const Skiper52 = () => {
  const images = useMemo(() => [
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format",
      alt: "Phewa Lake",
      code: "PHEWA LAKE",
    },
    {
      src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80&auto=format",
      alt: "Annapurna Himalaya",
      code: "ANNAPURNA",
    },
    {
      src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80&auto=format",
      alt: "Mustang",
      code: "MUSTANG",
    },
    {
      src: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80&auto=format",
      alt: "Illam",
      code: "ILLAM",
    },
    {
      src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&auto=format",
      alt: "Badimalika",
      code: "BADIMALIKA",
    },
    {
      src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&auto=format",
      alt: "Manang",
      code: "MANANG",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format",
      alt: "Solukhumbu",
      code: "SOLUKHUMBU",
    },
    {
      src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80&auto=format",
      alt: "Gorkha",
      code: "GORKHA",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format",
      alt: "Lumbini",
      code: "LUMBINI",
    },
  ], []);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-transparent">
      <HoverExpand_001 className="" images={images} />
    </div>
  );
};

export { Skiper52 };

const HoverExpand_001 = ({
  images,
  className,
}: {
  images: { src: string; alt: string; code: string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Memoize isMobile to prevent recalculation on every render
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      onViewportEnter={() => setHasAnimated(true)}
      viewport={{ amount: 0.1, margin: "200px", once: true }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
      className={cn("relative w-full px-0", className)}
    >
      <div className="w-full"
      >
        {/* Mobile Premium Masonry Layout */}
        <div className="flex flex-col gap-4 md:hidden px-2">
          {/* Row 1: Large featured card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-gold/30 h-[400px] w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div 
              className="absolute flex h-full w-full flex-col items-start justify-end p-6 z-20"
            >
              <div className="w-16 h-[2px] bg-gold mb-4" />
              <p className="text-base text-gold font-medium tracking-[0.2em] uppercase mb-2">
                {images[0].code}
              </p>
              <p className="text-sm text-white/70 tracking-wide">
                {images[0].alt}
              </p>
            </div>
            <img
              src={images[0].src}
              className="size-full object-cover"
              alt={images[0].alt}
              loading="lazy"
            />
          </motion.div>

          {/* Row 2: Two medium cards */}
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 3).map((image, idx) => (
              <motion.div
                key={idx + 1}
                className="relative overflow-hidden rounded-2xl border border-gold/30 h-[240px]"
                initial={{ opacity: 0, y: 30 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 + (idx * 0.05), ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute h-full w-full bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                <div className="absolute flex h-full w-full flex-col items-start justify-end p-4 z-20">
                  <div className="w-10 h-[2px] bg-gold mb-2" />
                  <p className="text-xs text-gold font-medium tracking-[0.2em] uppercase">
                    {image.code}
                  </p>
                </div>
                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          {/* Row 3: Three small cards */}
          <div className="grid grid-cols-3 gap-3">
            {images.slice(3, 6).map((image, idx) => (
              <motion.div
                key={idx + 3}
                className="relative overflow-hidden rounded-2xl border border-gold/30 h-[180px]"
                initial={{ opacity: 0, y: 30 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.15 + (idx * 0.05), ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute h-full w-full bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                <div className="absolute flex h-full w-full flex-col items-center justify-end p-3 z-20">
                  <p className="text-[10px] text-gold font-medium tracking-wider">
                    {image.code}
                  </p>
                </div>
                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          {/* Row 4: Two medium cards */}
          <div className="grid grid-cols-2 gap-4">
            {images.slice(6, 8).map((image, idx) => (
              <motion.div
                key={idx + 6}
                className="relative overflow-hidden rounded-2xl border border-gold/30 h-[240px]"
                initial={{ opacity: 0, y: 30 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + (idx * 0.05), ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute h-full w-full bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                <div className="absolute flex h-full w-full flex-col items-start justify-end p-4 z-20">
                  <div className="w-10 h-[2px] bg-gold mb-2" />
                  <p className="text-xs text-gold font-medium tracking-[0.2em] uppercase">
                    {image.code}
                  </p>
                </div>
                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          {/* Row 5: Final large card */}
          {images.length > 8 && (
            <motion.div
              className="relative overflow-hidden rounded-3xl border border-gold/30 h-[360px] w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div 
                className="absolute flex h-full w-full flex-col items-start justify-end p-6 z-20"
              >
                <div className="w-16 h-[2px] bg-gold mb-4" />
                <p className="text-base text-gold font-medium tracking-[0.2em] uppercase mb-2">
                  {images[8].code}
                </p>
                <p className="text-sm text-white/70 tracking-wide">
                  {images[8].alt}
                </p>
              </div>
              <img
                src={images[8].src}
                className="size-full object-cover"
                alt={images[8].alt}
                loading="lazy"
              />
            </motion.div>
          )}
        </div>

        {/* Desktop Expand on Hover Layout */}
        <div className="hidden md:flex w-full items-center justify-center gap-2 md:gap-3 py-4 lg:py-8">
          {images.map((image, index) => {
            return (
              <motion.div
                key={index}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border border-gold/30 hover:border-gold/60 transition-all duration-500"
                )}
                initial={{ opacity: 0, x: 200 }}
                animate={hasAnimated ? {
                  opacity: 1,
                  x: 0,
                  width: activeImage === index
                    ? (isMobile ? "14rem" : "28rem")
                    : (isMobile ? "5rem" : "7rem"),
                  height: isMobile ? "15rem" : "24rem"
                } : {
                  opacity: 0,
                  x: 200,
                  width: isMobile ? "5rem" : "7rem",
                  height: isMobile ? "15rem" : "24rem"
                }}
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                  x: { duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                  width: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                  height: { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
                }}
                onClick={() => setActiveImage(index)}
                onPointerEnter={() => setActiveImage(index)}
              >
                <div 
                  className="absolute h-full w-full bg-gradient-to-t from-black/60 via-gold/10 to-transparent transition-opacity duration-150"
                  style={{ opacity: activeImage === index ? 1 : 0 }}
                />

                <div 
                  className="absolute flex h-full w-full flex-col items-end justify-end p-4 transition-opacity duration-150"
                  style={{ opacity: activeImage === index ? 1 : 0 }}
                >
                  <p className="text-left text-xs text-gold/80 font-medium tracking-wider">
                    {image.code}
                  </p>
                </div>

                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export { HoverExpand_001 };

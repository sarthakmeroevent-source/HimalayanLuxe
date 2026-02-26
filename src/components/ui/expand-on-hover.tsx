"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { cn } from "@/lib/utils";

function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const Skiper52 = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      alt: "Wedding ceremony",
      code: "# 01",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
      alt: "Wedding couple",
      code: "# 02",
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      alt: "Wedding reception",
      code: "# 03",
    },
    {
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
      alt: "Wedding details",
      code: "# 04",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
      alt: "Wedding venue",
      code: "# 05",
    },
    {
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
      alt: "Wedding celebration",
      code: "# 06",
    },
    {
      src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800",
      alt: "Wedding decor",
      code: "# 07",
    },
    {
      src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
      alt: "Wedding flowers",
      code: "# 08",
    },
    {
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800",
      alt: "Wedding moments",
      code: "# 09",
    },
    {
      src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
      alt: "Wedding elegance",
      code: "# 10",
    },
  ];

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
  const width = useWindowWidth();
  const isMobile = width < 1024;
  const isSmall = width < 640;
  const expandedWidth = isSmall ? "11rem" : isMobile ? "14rem" : "24rem";
  const collapsedWidth = isSmall ? "3.5rem" : isMobile ? "4rem" : "6rem";
  const cardHeight = isSmall ? "14rem" : isMobile ? "16rem" : "24rem";

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      onViewportEnter={() => setHasAnimated(true)}
      onViewportLeave={() => setHasAnimated(false)}
      viewport={{ amount: 0.3 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-full min-w-0 px-0 overflow-hidden", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 -mb-2"
      >
        <div className="flex w-max lg:w-full items-center justify-start gap-1.5 sm:gap-2 md:gap-3 py-4 lg:py-8">
          {images.map((image, index) => (
              <motion.div
                key={index}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border border-gold/30 hover:border-gold/60 flex-shrink-0"
                )}
                style={{ willChange: "transform, opacity, width" }}
                initial={{ opacity: 0, x: 200 }}
                animate={hasAnimated ? {
                  opacity: 1,
                  x: 0,
                  width: activeImage === index ? expandedWidth : collapsedWidth,
                  height: cardHeight,
                } : {
                  opacity: 0,
                  x: 200,
                  width: collapsedWidth,
                  height: cardHeight,
                }}
                transition={{
                  opacity: { duration: 1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] },
                  x: { duration: 1.2, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] },
                  width: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                  height: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                }}
                onClick={() => setActiveImage(index)}
                onPointerEnter={() => setActiveImage(index)}
              >
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute h-full w-full bg-gradient-to-t from-black/60 via-gold/10 to-transparent"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute flex h-full w-full flex-col items-end justify-end p-4"
                    >
                      <p className="text-left text-xs text-gold/80 font-medium tracking-wider">
                        {image.code}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                />
              </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };

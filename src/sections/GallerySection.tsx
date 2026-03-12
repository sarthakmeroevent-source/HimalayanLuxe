import { motion } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGallery } from "../hooks/useGallery";
import { cn } from "../lib/utils";
import { useFadeInView } from "../hooks/useFadeInView";
import { imgSize } from "../lib/imageOptimizer";

const GallerySection = () => {
  const { data: images, isLoading } = useGallery();
  const headerRef = useFadeInView();
  const buttonRef = useFadeInView();

  const galleryItems = useMemo(() => {
    return (images || []).slice(0, 9).map((img) => ({
      src: imgSize.galleryThumb(img.image_url),
      srcLarge: imgSize.galleryLarge(img.image_url),
      alt: img.caption || "Gallery Image",
      code: img.caption || "LUXE",
      id: img.id,
    }));
  }, [images]);

  return (
    <section
      className="section-container relative w-full flex flex-col items-center justify-center py-16 md:py-[72px] px-6 md:px-12"
      id="gallery"
    >
      <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto">
        {/* Header — always rendered so fade-in-view works on first load */}
        <div ref={headerRef} className="fade-in-view w-full flex flex-col items-center mb-16 px-6 md:px-12 text-center">
          <div className="flex flex-col items-center mb-4">
            <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium block">
              Our Gallery
            </span>
          </div>
          <h2 className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,56px)] font-normal leading-[1.1] tracking-tight drop-shadow-2xl mb-4 max-w-4xl">
            Moments of <span className="liquid-gold-text italic">captured elegance</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 md:py-[72px]">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : galleryItems.length === 0 ? null : (
          <>
            <div className="w-full mb-12">
              <div className="flex h-full w-full items-center justify-center overflow-hidden bg-transparent">
                <GalleryExpand items={galleryItems} />
              </div>
            </div>

            {/* View All button */}
            <div ref={buttonRef} className="fade-in-view">
              <Link
                to="/gallery"
                className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit inline-block"
              >
                <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                  View Full Gallery
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default GallerySection;

const GalleryExpand = ({
  items,
  className,
}: {
  items: { src: string; srcLarge: string; alt: string; code: string; id: string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number>(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver instead of framer-motion's onViewportEnter
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "100px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full px-0", className)}
    >
      <div className="w-full">
        {/* Mobile Masonry Layout — pure CSS transitions for performance */}
        <div className="flex flex-col gap-4 md:hidden px-2">
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border border-gold/30 h-[400px] w-full transition-all duration-600 ease-out",
              hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            onClick={() => navigate('/gallery')}
          >
            <img src={items[0].src} className="size-full object-cover" alt={items[0].alt} decoding="async" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {items.slice(1, 3).map((image, idx) => (
              <div
                key={idx + 1}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-gold/30 h-[240px] transition-all duration-600 ease-out",
                  hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: hasAnimated ? `${100 + idx * 50}ms` : '0ms' }}
                onClick={() => navigate('/gallery')}
              >
                <img src={image.src} className="size-full object-cover" alt={image.alt} decoding="async" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {items.slice(3, 6).map((image, idx) => (
              <div
                key={idx + 3}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-gold/30 h-[180px] transition-all duration-600 ease-out",
                  hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: hasAnimated ? `${150 + idx * 50}ms` : '0ms' }}
                onClick={() => navigate('/gallery')}
              >
                <img src={image.src} className="size-full object-cover" alt={image.alt} decoding="async" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Expand on Hover Layout */}
        <div className="hidden md:flex w-full items-center justify-center gap-2 md:gap-3">
          {items.map((image, index) => (
            <motion.div
              key={index}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border border-gold/30 hover:border-gold/60"
              )}
              style={{ willChange: "width" }}
              initial={false}
              animate={{
                width: activeImage === index ? "28rem" : "7rem",
                height: "24rem",
                opacity: hasAnimated ? 1 : 0,
              }}
              transition={{
                width: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.5, delay: index * 0.06 },
              }}
              onClick={() => {
                if (activeImage === index) {
                  navigate('/gallery');
                } else {
                  setActiveImage(index);
                }
              }}
              onPointerEnter={() => setActiveImage(index)}
            >
              <div
                className="absolute h-full w-full bg-black/20 transition-opacity duration-300 pointer-events-none"
                style={{ opacity: activeImage === index ? 0 : 1 }}
              />
              <img
                src={activeImage === index ? image.srcLarge : image.src}
                decoding="async"
                className="size-full object-cover transition-transform duration-[2s] ease-out hover:scale-110"
                alt={image.alt}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

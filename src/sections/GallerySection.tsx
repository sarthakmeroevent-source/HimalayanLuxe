import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGallery } from "../hooks/useGallery";
import { cn } from "../lib/utils";

const GallerySection = () => {
  const { data: images, isLoading } = useGallery();
  const navigate = useNavigate();

  const galleryItems = useMemo(() => {
    return (images || []).slice(0, 9).map((img) => ({
      src: img.image_url,
      alt: img.caption || "Gallery Image",
      code: img.caption || "LUXE",
      id: img.id,
    }));
  }, [images]);

  if (isLoading) {
    return (
      <section className="relative w-full py-16 md:py-[72px] px-6 md:px-12" id="gallery">
        <div className="flex justify-center py-16 md:py-[72px]">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!galleryItems.length) return null;

  return (
    <section 
      className="section-container relative w-full flex flex-col items-center justify-center py-16 md:py-[72px] px-6 md:px-12" 
      id="gallery"
    >
      <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto">
        {/* Header - Consistent with Destinations */}
        <div className="w-full flex items-center justify-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="liquid-gold-text text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium block">
              Visual Legacy
            </span>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,48px)] font-normal leading-[1.15] md:leading-[1.1] tracking-tight drop-shadow-2xl mb-10 text-center"
        >
          Captured <span className="italic text-white/50">Elegance</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mb-12"
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden bg-transparent">
            <GalleryExpand items={galleryItems} />
          </div>
        </motion.div>

        {/* View All button - Consistent with Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Link
            to="/gallery"
            className="group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 w-fit inline-block"
          >
            <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
              View Full Gallery
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;

const GalleryExpand = ({
  items,
  className,
}: {
  items: { src: string; alt: string; code: string; id: string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number>(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isReadyForAnim, setIsReadyForAnim] = useState(false);
  const navigate = useNavigate();

  // Defer animation allowance to prevent heavy synchronous reflows right after paint
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadyForAnim(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const isMobile = useMemo(() => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
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
      <div className="w-full">
        {/* Mobile Premium Masonry Layout - Same as Destination */}
        <div className="flex flex-col gap-4 md:hidden px-2">
          {/* Row 1: Large featured card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-gold/30 h-[400px] w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={hasAnimated && isReadyForAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate('/gallery')}
          >
            <img src={items[0].src} className="size-full object-cover" alt={items[0].alt} loading="lazy" />
          </motion.div>

          {/* Row 2: Two medium cards */}
          <div className="grid grid-cols-2 gap-4">
            {items.slice(1, 3).map((image, idx) => (
              <motion.div
                key={idx + 1}
                className="relative overflow-hidden rounded-2xl border border-gold/30 h-[240px]"
                initial={{ opacity: 0, y: 30 }}
                animate={hasAnimated && isReadyForAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate('/gallery')}
              >
                <img src={image.src} className="size-full object-cover" alt={image.alt} loading="lazy" />
              </motion.div>
            ))}
          </div>

          {/* Row 3: Three small cards */}
          <div className="grid grid-cols-3 gap-3">
            {items.slice(3, 6).map((image, idx) => (
              <motion.div
                key={idx + 3}
                className="relative overflow-hidden rounded-2xl border border-gold/30 h-[180px]"
                initial={{ opacity: 0, y: 30 }}
                animate={hasAnimated && isReadyForAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.15 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate('/gallery')}
              >
                <img src={image.src} className="size-full object-cover" alt={image.alt} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Expand on Hover Layout - Same as Destination */}
        <div className="hidden md:flex w-full items-center justify-center gap-2 md:gap-3 py-4 lg:py-8">
          {items.map((image, index) => {
            return (
              <motion.div
                key={index}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border border-gold/30 hover:border-gold/60"
                )}
                style={{ willChange: "transform, opacity, width" }}
                initial={{ opacity: 0, x: 200 }}
                animate={
                  hasAnimated && isReadyForAnim
                    ? {
                        opacity: 1,
                        x: 0,
                        width: activeImage === index ? "28rem" : "7rem",
                        height: "24rem",
                      }
                    : {
                        opacity: 0,
                        x: 200,
                        width: "7rem",
                        height: "24rem",
                      }
                }
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                  x: { duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                  width: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
                  src={image.src}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[2s] ease-out hover:scale-110"
                  alt={image.alt}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

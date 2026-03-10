import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface OrbitItem {
  id: string | number;
  url: string;
  label: string;
  slug?: string;
}

interface OrbitCarouselProps {
  items: OrbitItem[];
  imageSize?: number;
  zDepth?: number;
  pauseOnHover?: boolean;
}

export default function OrbitCarousel({ 
  items, 
  imageSize = 210, // Increased by ~20% from 175
  zDepth = 380, 
  pauseOnHover = true 
}: OrbitCarouselProps) {
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const borderRadius = 16;
  const backfaceVisible = false;

  const numImages = items.length;
  const angleSlice = 360 / numImages;

  React.useEffect(() => {
    if (isHovering && pauseOnHover) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.4) % 360); // Slightly slower for elegance
    }, 50);

    return () => clearInterval(interval);
  }, [isHovering, pauseOnHover]);

  const handleImageClick = (index: number, slug?: string) => {
    const targetRotation = -index * angleSlice;
    setRotation(targetRotation);
  };

  return (
    <div className="relative w-full h-[550px] md:h-[650px] flex flex-col items-center justify-center overflow-visible">
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="relative"
          style={{
            width: imageSize * 2,
            height: imageSize * 2,
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: rotation }}
          transition={{ type: 'tween', duration: 0.8, ease: 'easeOut' }}
        >
          {items.map((image, index) => {
            const angle = (index * angleSlice * Math.PI) / 180;
            const x = Math.cos(angle) * zDepth;
            const z = Math.sin(angle) * zDepth;
            
            // Calculate how far the item is from the 'front'
            // Card is at front when rotation is approx -index * angleSlice
            const itemRotation = (index * angleSlice + rotation) % 360;
            const normalizedRotation = Math.abs(((itemRotation + 180 + 360) % 360) - 180);
            
            // frontness: 1 at front, 0 at back
            // The front is actually around 270 degrees in this trig setup
            // Let's use distance from 270 (or -90)
            const diff = Math.abs(((itemRotation + 90 + 180 + 360) % 360) - 180);
            const frontness = Math.max(0, 1 - diff / 120); 
            
            // Background items are blurred and faded
            const blurValue = (1 - frontness) * 8;
            const opacityValue = 0.15 + (frontness * 0.85);

            return (
              <motion.div
                key={image.id}
                className="absolute cursor-pointer"
                style={{
                  width: imageSize,
                  height: imageSize,
                  left: '50%',
                  top: '50%',
                  marginLeft: -imageSize / 2,
                  marginTop: -imageSize / 2,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: backfaceVisible ? 'visible' : 'hidden',
                }}
                animate={{
                  x,
                  z,
                  rotateY: -rotation,
                  filter: `blur(${blurValue}px)`,
                  opacity: opacityValue,
                }}
                transition={{ type: 'tween', duration: 0.8, ease: 'easeOut' }}
                onClick={() => handleImageClick(index, image.slug)}
                whileHover={{ scale: 1.15, filter: 'blur(0px)', opacity: 1 }}
              >
                <div
                  className="w-full h-full rounded-lg shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 ring-2 ring-gold/20 hover:ring-gold/50"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  <img
                    src={image.url}
                    alt={image.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div 
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (image.slug) navigate(`/destinations/${image.slug}`);
                    }}
                  >
                    <div className="text-white text-center font-serif italic text-xl drop-shadow-lg mb-2">
                      {image.label}
                    </div>
                    <span className="text-gold text-[10px] uppercase tracking-widest font-medium border-t border-gold/30 pt-2">
                        Explore
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

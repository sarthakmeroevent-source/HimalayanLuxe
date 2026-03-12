import { useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useDestinations, DestinationItem } from '../../hooks/useDestinations';
import { imgSize } from '../../lib/imageOptimizer';
import SectionUnavailable from '../common/SectionUnavailable';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';

const DestinationCarousel = () => {
  const { data: destinations, isLoading, isError } = useDestinations();
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const displayDestinations = useMemo(() => {
    if (!destinations) return [];
    const top10 = destinations.slice(0, 10);
    // Repeat the array multiple times to ensure Swiper has enough slides to loop seamlessly
    // even on large screens with high slidesPerView
    return [...top10, ...top10, ...top10, ...top10];
  }, [destinations]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!destinations || destinations.length === 0) return <SectionUnavailable message="Destinations are temporarily unavailable" />;

  return (
    <div 
      className="w-full relative py-0 md:py-6 overflow-visible destination-ticker-wrapper"
      onMouseEnter={() => {
        setIsPaused(true);
        swiperRef.current?.autoplay?.pause();
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        swiperRef.current?.autoplay?.resume();
      }}
    >
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView="auto"
        spaceBetween={20}
        loop={true}
        speed={8000}
        allowTouchMove={true}
        grabCursor={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loopAdditionalSlides={5}
        modules={[Autoplay, FreeMode]}
        freeMode={true}
        className="destination-swiper-container !overflow-visible [&>.swiper-wrapper]:ease-linear"
        breakpoints={{
          320: {
            slidesPerView: 1.4,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 25,
          },
          1440: {
            slidesPerView: 4.5,
            spaceBetween: 30,
          }
        }}
      >
        {displayDestinations.map((dest: DestinationItem, index: number) => (
          <SwiperSlide key={`${dest.id}-${index}`} className="!w-auto">
            <div 
              onClick={() => navigate(`/destinations/${dest.slug || dest.id}`)}
              className="relative w-[70vw] md:w-[280px] h-[400px] md:h-[420px] rounded-[24px] overflow-hidden group cursor-pointer border border-white/10 shadow-lg transition-all duration-700 hover:border-gold/40"
            >
              <img 
                src={imgSize.destinationCard(dest.cover_image_url)} 
                alt={dest.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end items-start text-left">
                <div className="w-8 h-[1.5px] bg-gold mb-3 transition-all duration-700 group-hover:w-16" />
                <span className="liquid-gold-text text-[8px] tracking-[0.3em] uppercase font-medium mb-1.5 block opacity-80">
                  {dest.code || 'LUXE'}
                </span>
                <h3 className="font-serif text-white text-xl md:text-2xl leading-tight mb-2 drop-shadow-lg">
                  {dest.name}
                </h3>
                <p className="text-white/50 text-[13px] font-sans line-clamp-3 max-w-[260px] transform translate-y-3 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 leading-normal">
                  {dest.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DestinationCarousel;

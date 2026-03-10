import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';

export default function GallerySection() {
    const navigate = useNavigate();
    const { data: images, isLoading } = useGallery();

    // Show first 6 images as preview
    const previewImages = images?.slice(0, 6) ?? [];

    if (isLoading) {
        return (
            <section className="relative w-full py-20 md:py-32 px-6 md:px-12" id="gallery">
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    if (!previewImages.length) return null;

    return (
        <section className="relative w-full py-20 md:py-32 px-6 md:px-12" id="gallery">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 flex flex-col items-center text-center"
            >
                <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6">
                    Visual Legacy
                </span>
                <h2 className="font-serif text-white/95 text-[32px] md:text-[clamp(28px,3vw,48px)] font-normal leading-[1.15] md:leading-[1.1] tracking-tight mb-6">
                    Captured <span className="italic text-white/50">Elegance</span>
                </h2>
                <div className="w-16 h-[1px] bg-gold/30"></div>
            </motion.div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {previewImages.map((img, i) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-lg group cursor-pointer aspect-[4/3]"
                        onClick={() => navigate('/gallery')}
                    >
                        <img
                            src={img.image_url}
                            alt={img.caption || ''}
                            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center mt-14"
            >
                <button
                    onClick={() => navigate('/gallery')}
                    className="group flex items-center gap-3 border border-gold/30 rounded-full px-10 py-4 hover:border-gold hover:bg-gold/10 transition-all duration-500"
                >
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold group-hover:text-white transition-colors duration-500">
                        View Full Gallery
                    </span>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:text-white group-hover:translate-x-1 transition-all duration-500" />
                </button>
            </motion.div>
        </section>
    );
}

import { motion } from 'framer-motion';
import { servicesData } from '../data/services';

export default function ServicesSection() {
    return (
        <section className="relative w-full pt-20 pb-20 px-4 md:px-8" id="services">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", amount: 0.3 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 flex flex-col items-center text-center"
            >
                <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6">Masterpieces</span>
                <h2 className="font-serif text-white/95 text-[clamp(24px,3.5vw,44px)] font-normal leading-tight">
                    Curated <span className="italic text-white/50">Excellence</span>
                </h2>
            </motion.div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-[40vh] md:gap-[50vh] pb-0 relative z-10">
                {servicesData.map((service, i) => (
                    <div
                        key={service.id}
                        className="sticky flex flex-col items-center justify-center w-full h-[70vh] md:h-[80vh] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border border-white/10"
                        style={{ top: `calc(10vh + ${i * 24}px)` }}
                    >
                        <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.4 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full"
                        >
                            <h3 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] mb-6 drop-shadow-2xl">
                                {service.title}
                            </h3>
                            <h4 className="text-white/80 font-sans tracking-[0.15em] md:tracking-[0.2em] text-[clamp(10px,1.2vw,14px)] font-semibold uppercase drop-shadow-lg">
                                {service.subtitle}
                            </h4>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}

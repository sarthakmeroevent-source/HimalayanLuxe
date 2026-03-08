import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const footerLinks = [
    { label: 'Home', path: '/' },
    { label: 'Experience', path: '/experience' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

export default function Footer() {
    return (
        <section className="relative w-full flex flex-col items-center justify-between px-8 md:px-16 py-16 bg-black/60 backdrop-blur-md" id="footer">
            <div className="w-full max-w-[1400px] flex flex-col items-center gap-8 md:gap-12 relative z-10">

                <motion.img
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1 }}
                    src="/LOGO.svg"
                    alt="Himalayan Luxe"
                    className="h-20 md:h-28 w-auto opacity-90 drop-shadow-2xl"
                />

                <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-16 gap-y-8">
                    {footerLinks.map((link, i) => (
                        <motion.div
                            key={link.label}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 * i }}
                        >
                            <Link
                                to={link.path}
                                className="text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-medium text-white/70 hover:text-gold transition-colors duration-500"
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col items-center mt-4 md:mt-8 gap-6"
                >
                    <p className="font-serif text-[clamp(18px,2vw,28px)] text-white/80 italic font-light tracking-wide text-center px-4 max-w-2xl">
                        "Crafting palatial celebrations for the world's most discerning families."
                    </p>
                    <div className="w-8 h-[1px] bg-gold/50"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex items-center gap-10 mt-4"
                >
                    <a href="#" className="text-white/40 hover:text-gold hover:scale-110 transition-all duration-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="#" className="text-white/40 hover:text-gold hover:scale-110 transition-all duration-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                    <a href="#" className="text-white/40 hover:text-gold hover:scale-110 transition-all duration-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[18px] h-[18px]">
                            <path d="M22.396 7.164c-.093 2.026-1.507 4.8-4.245 8.32C15.322 19.161 12.93 21 11.008 21c-1.214 0-2.24-1.12-3.08-3.36-.56-2.053-1.119-4.107-1.68-6.16-.653-2.333-1.306-3.5-1.96-3.5-.186 0-.746.373-1.68 1.12L1.18 7.556c1.027-.933 2.054-1.866 3.08-2.8 1.494-1.306 2.614-1.96 3.36-1.96 1.774 0 2.894 1.214 3.36 3.64l1.307 4.947c.466 1.773.84 2.66 1.12 2.66.373 0 1.213-.933 2.52-2.8 1.12-1.586 1.68-2.706 1.68-3.36 0-.84-.374-1.26-1.12-1.26-.28 0-.654.093-1.12.28 1.12-3.546 3.266-5.32 6.44-5.32 2.146 0 3.266 1.12 3.36 3.36z"></path>
                        </svg>
                    </a>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                className="w-full max-w-[1400px] mt-12 md:mt-16 border-t border-white/5 pt-6 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left relative z-10"
            >
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">
                    <span>© 2026 Himalayan Luxe.</span>
                    <span className="hidden md:block">|</span>
                    <span>Registered in Nepal</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/40">
                    <a href="#" className="hover:text-gold transition-colors duration-500">Cookie Policy</a>
                    <a href="#" className="hover:text-gold transition-colors duration-500">Privacy Policy</a>
                    <a href="#" className="hover:text-gold transition-colors duration-500">Website Terms</a>
                </div>

                <div className="flex items-center gap-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">
                    <span>Bespoke Design By</span>
                    <a href="https://meroevent.com/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors duration-500 font-bold tracking-[0.3em]">MeroEvent</a>
                </div>
            </motion.div>
        </section>
    );
}

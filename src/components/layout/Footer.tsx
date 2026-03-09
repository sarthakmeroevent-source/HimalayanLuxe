import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const footerLinks = [
    { label: 'Home', path: '/' },
    { label: 'Experience', path: '/experience' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

interface SocialLinks {
    social_instagram: string | null;
    social_facebook: string | null;
    social_tiktok: string | null;
}

export default function Footer() {
    const [socials, setSocials] = useState<SocialLinks>({ social_instagram: null, social_facebook: null, social_tiktok: null });

    useEffect(() => {
        supabase.from('site_settings').select('social_instagram, social_facebook, social_tiktok').limit(1).single()
            .then(({ data }) => {
                if (data) setSocials(data as SocialLinks);
            });
    }, []);

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
                    {/* Instagram */}
                    {socials.social_instagram ? (
                        <a href={socials.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/50 hover:bg-gold/5 hover:scale-110 transition-all duration-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                        </a>
                    ) : (
                        <span className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/15 cursor-default">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                        </span>
                    )}
                    {/* Facebook */}
                    {socials.social_facebook ? (
                        <a href={socials.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/50 hover:bg-gold/5 hover:scale-110 transition-all duration-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                    ) : (
                        <span className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/15 cursor-default">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </span>
                    )}
                    {/* TikTok */}
                    {socials.social_tiktok ? (
                        <a href={socials.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/50 hover:bg-gold/5 hover:scale-110 transition-all duration-500">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[14px] h-[14px]">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.83a4.84 4.84 0 0 1-1-.14z"></path>
                            </svg>
                        </a>
                    ) : (
                        <span className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/15 cursor-default">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[14px] h-[14px]">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.83a4.84 4.84 0 0 1-1-.14z"></path>
                            </svg>
                        </span>
                    )}
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
                    <Link to="/cookies" className="hover:text-gold transition-colors duration-500">Cookie Policy</Link>
                    <Link to="/privacy-policy" className="hover:text-gold transition-colors duration-500">Privacy Policy</Link>
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

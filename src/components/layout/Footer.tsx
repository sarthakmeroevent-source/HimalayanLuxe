export default function Footer() {
    return (
        <section className="section-container relative min-h-[60vh] w-full flex flex-col items-center justify-between px-8 md:px-24 py-24 bg-black/40" id="footer">
            <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-start justify-between gap-24 md:gap-12">
                <div className="flex flex-col items-start max-w-md">
                    <img src="/LOGO.svg" alt="Himalayan Luxe" className="h-12 w-auto mb-10 opacity-80" />
                    <p className="text-white/40 text-[12px] md:text-sm leading-relaxed tracking-wide font-sans mb-10">
                        International award-winning nuptial artist, specializing in palatial celebrations for the world's most discerning families.
                    </p>
                    <div className="flex gap-8">
                        {['Instagram', 'LinkedIn', 'Vimeo'].map((social) => (
                            <a key={social} href="#" className="text-[10px] tracking-[0.3em] uppercase font-medium text-white/40 hover:text-gold transition-colors duration-500">
                                {social}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24">
                    <div className="flex flex-col gap-6">
                        <span className="text-gold text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Discover</span>
                        {['About', 'Gallery', 'Venues', 'Process'].map((link) => (
                            <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[13px] md:text-sm font-sans tracking-wide">{link}</a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="text-gold text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Explore</span>
                        {['Destinations', 'Services', 'Artistry', 'Awards'].map((link) => (
                            <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[13px] md:text-sm font-sans tracking-wide">{link}</a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="text-gold text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Legal</span>
                        {['Privacy', 'Terms', 'Concierge'].map((link) => (
                            <a key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[13px] md:text-sm font-sans tracking-wide">{link}</a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between pt-24 border-t border-white/5">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-medium order-2 md:order-1">
                    © 2026 Himalayan Luxe. All Rights Reserved.
                </span>
                <div className="flex items-center gap-2 mb-8 md:mb-0 order-1 md:order-2">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium">Bespoke Design By</span>
                    <span className="liquid-gold-text text-[10px] tracking-[0.3em] uppercase font-bold">MeroEvent</span>
                </div>
            </div>
        </section>
    );
}

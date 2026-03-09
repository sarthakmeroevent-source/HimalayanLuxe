import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { CustomDatePicker } from '../components/ui/CustomDatePicker';
import { Instagram, Facebook, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    social_facebook: string | null;
    social_instagram: string | null;
    social_tiktok: string | null;
}

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        supabase.from('site_settings').select('contact_email, contact_phone, contact_address, social_facebook, social_instagram, social_tiktok').limit(1).single()
            .then(({ data }) => {
                if (data) setSettings(data as SiteSettings);
            });
    }, []);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const timers = [
            setTimeout(() => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; }, 10),
            setTimeout(() => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; }, 50),
            setTimeout(() => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; }, 100)
        ];
        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Save to Supabase
            const { error: dbError } = await supabase.from('inquiries').insert({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                event_type: formData.eventType,
                preferred_date: formData.date || null,
                message: formData.message,
            });

            if (dbError) throw dbError;

            // Fire-and-forget email notification (don't block form success)
            fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/swift-api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || null,
                    event_type: formData.eventType,
                    preferred_date: formData.date || null,
                    message: formData.message,
                }),
            }).then(async (res) => {
                const data = await res.json().catch(() => null);
                console.log('[notify-inquiry]', res.status, data);
            }).catch((err) => console.error('[notify-inquiry] failed:', err));

            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', eventType: '', date: '', message: '' });
        } catch (err) {
            setError((err as Error).message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            <section className="relative w-full px-8 md:px-16 py-20">
                <div className="max-w-[1400px] mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-20"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            Get In Touch
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Begin Your <span className="liquid-gold-text">Journey</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            Let's create something extraordinary together
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 auto-rows-min gap-6 md:gap-8">
                        {/* Contact Form - Main Bento Item */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            className="lg:col-span-7 lg:row-span-3 glass-card p-8 md:p-12 rounded-[32px] flex flex-col justify-center"
                        >
                            <h3 className="font-serif text-white/95 text-3xl mb-8">Send an Inquiry</h3>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <CheckCircle className="w-16 h-16 text-gold mb-6" />
                                    <h4 className="font-serif text-white/95 text-2xl mb-3">Thank You</h4>
                                    <p className="text-white/60 mb-8 max-w-md">Your inquiry has been submitted. We'll get back to you shortly.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="border border-gold/30 px-8 py-3 rounded-xl text-xs font-medium uppercase tracking-[0.2em] text-gold hover:bg-gold/10 transition-all"
                                    >
                                        Send Another
                                    </button>
                                </motion.div>
                            ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="z-50 relative">
                                        <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                            Event Type
                                        </label>
                                        <CustomSelect
                                            value={formData.eventType}
                                            onChange={(val) => setFormData({ ...formData, eventType: val })}
                                            options={[
                                                { value: 'wedding', label: 'Wedding' },
                                                { value: 'destination', label: 'Destination Event' },
                                                { value: 'corporate', label: 'Corporate Event' },
                                                { value: 'other', label: 'Other' }
                                            ]}
                                            placeholder="Select Event Type"
                                        />
                                    </div>
                                    <div className="z-40 relative">
                                        <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                            Preferred Date
                                        </label>
                                        <CustomDatePicker
                                            value={formData.date}
                                            onChange={(val) => setFormData({ ...formData, date: val })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors resize-none custom-scrollbar"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full group relative overflow-hidden rounded-xl border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10 lg:col-span-2 disabled:opacity-50"
                                >
                                    <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                                    </span>
                                </button>
                            </form>
                            )}
                        </motion.div>

                        {/* Contact Info Bento Box */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            className="lg:col-span-5 glass-card p-8 rounded-[32px] flex flex-col justify-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
                            <h3 className="font-serif text-white/95 text-2xl mb-6 relative z-10">Contact Details</h3>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="text-gold text-xs mb-1 tracking-wider uppercase font-medium">Email</div>
                                    <a href={`mailto:${settings?.contact_email || ''}`} className="text-white/80 hover:text-white text-lg transition-colors">
                                        {settings?.contact_email || '...'}
                                    </a>
                                </div>
                                <div>
                                    <div className="text-gold text-xs mb-1 tracking-wider uppercase font-medium">Phone</div>
                                    <a href={`tel:${settings?.contact_phone?.replace(/[^+\d]/g, '') || ''}`} className="text-white/80 hover:text-white text-lg transition-colors">
                                        {settings?.contact_phone || '...'}
                                    </a>
                                </div>
                                <div>
                                    <div className="text-gold text-xs mb-1 tracking-wider uppercase font-medium">Headquarters</div>
                                    <p className="text-white/80 text-lg leading-snug whitespace-pre-line">
                                        {settings?.contact_address || '...'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Follow & Office Hours Mini Bentos */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                            className="lg:col-span-5 grid grid-cols-2 gap-6 md:gap-8"
                        >
                            <div className="glass-card p-6 md:p-8 rounded-[32px] flex flex-col justify-center">
                                <h3 className="font-serif text-white/95 text-xl mb-4">Socials</h3>
                                <div className="flex items-center gap-4">
                                    {settings?.social_facebook ? (
                                        <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    ) : (
                                        <span className="h-12 w-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/15 cursor-default">
                                            <Facebook className="w-5 h-5" />
                                        </span>
                                    )}
                                    {settings?.social_instagram ? (
                                        <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    ) : (
                                        <span className="h-12 w-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/15 cursor-default">
                                            <Instagram className="w-5 h-5" />
                                        </span>
                                    )}
                                    {settings?.social_tiktok ? (
                                        <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <span className="h-12 w-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/15 cursor-default">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="glass-card p-6 md:p-8 rounded-[32px] flex flex-col justify-center text-sm">
                                <h3 className="font-serif text-white/95 text-xl mb-4">Hours</h3>
                                <div className="space-y-2 text-white/70">
                                    <div className="flex flex-col">
                                        <span className="text-white/40 text-xs uppercase tracking-wider">Mon - Fri</span>
                                        <span className="text-gold font-medium">9 AM - 6 PM</span>
                                    </div>
                                    <div className="flex flex-col mt-2">
                                        <span className="text-white/40 text-xs uppercase tracking-wider">Weekend</span>
                                        <span className="text-white/90 font-medium">Appointment Only</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive Map Bento Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                            className="lg:col-span-12 glass-card rounded-[32px] overflow-hidden relative min-h-[400px] p-2 mt-4"
                        >
                            <div className="absolute inset-0 z-10 pointer-events-none rounded-[32px] border border-white/10 ring-1 ring-inset ring-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.825633878198!2d85.3286985!3d27.6971206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900443fadcb%3A0x3533b926b11755f3!2sMero%20Event!5e0!3m2!1sen!2snp!4v1"
                                className="w-full h-full rounded-[24px] border-0"
                                style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(115%) sepia(20%) grayscale(20%)' }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

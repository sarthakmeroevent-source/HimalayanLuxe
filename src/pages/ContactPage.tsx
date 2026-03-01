import { motion } from 'framer-motion';
import { useState } from 'react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { CustomDatePicker } from '../components/ui/CustomDatePicker';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="relative min-h-screen pt-32 pb-20">
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

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
                                    />
                                </div>

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

                                <div>
                                    <label className="block text-white/70 text-sm mb-2 tracking-wide">
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={5}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full group relative overflow-hidden rounded-full border border-gold/30 px-8 py-4 transition-all duration-700 hover:border-gold hover:bg-gold/10"
                                >
                                    <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-700 group-hover:text-white">
                                        Submit Inquiry
                                    </span>
                                </button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-8 rounded-[24px]">
                                <h3 className="font-serif text-white/95 text-2xl mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-gold text-sm mb-2 tracking-wider uppercase">Email</div>
                                        <a href="mailto:info@himalayanluxe.com" className="text-white/80 hover:text-gold transition-colors">
                                            info@himalayanluxe.com
                                        </a>
                                    </div>
                                    <div>
                                        <div className="text-gold text-sm mb-2 tracking-wider uppercase">Phone</div>
                                        <a href="tel:+1234567890" className="text-white/80 hover:text-gold transition-colors">
                                            +1 (234) 567-890
                                        </a>
                                    </div>
                                    <div>
                                        <div className="text-gold text-sm mb-2 tracking-wider uppercase">Address</div>
                                        <p className="text-white/80">
                                            123 Luxury Lane<br />
                                            Beverly Hills, CA 90210<br />
                                            United States
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-[24px]">
                                <h3 className="font-serif text-white/95 text-2xl mb-6">Office Hours</h3>
                                <div className="space-y-3 text-white/70">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="text-gold">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="text-gold">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="text-white/40">Closed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-[24px]">
                                <h3 className="font-serif text-white/95 text-2xl mb-6">Follow Us</h3>
                                <div className="flex gap-4">
                                    {['Instagram', 'Facebook', 'Pinterest', 'LinkedIn'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold transition-all duration-300"
                                        >
                                            {social[0]}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

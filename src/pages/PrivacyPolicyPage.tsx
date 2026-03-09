import { motion } from 'framer-motion';
import { useEffect } from 'react';
import SimpleCTA from '../components/common/SimpleCTA';

export default function PrivacyPolicyPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="relative min-h-screen pt-32 pb-0 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none -mr-40 -mt-20"></div>
            <div className="absolute top-1/3 left-0 w-[800px] h-[800px] bg-emerald-deep/30 rounded-full blur-[150px] pointer-events-none -ml-60"></div>

            {/* Hero Section */}
            <section className="relative w-full px-8 md:px-16 pt-12 pb-16 flex flex-col items-center justify-center min-h-[30vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[1000px] mx-auto text-center relative z-10"
                >
                    <span className="flex items-center justify-center gap-3 text-gold text-xs tracking-[0.4em] uppercase font-medium mb-6">
                        <span className="h-[1px] w-8 bg-gold/50"></span>
                        Legal Documentation
                        <span className="h-[1px] w-8 bg-gold/50"></span>
                    </span>
                    <h1 className="font-serif text-white/95 text-[clamp(32px,4vw,64px)] leading-[1.1] font-normal tracking-tight mb-6">
                        Privacy <span className="liquid-gold-text italic">Policy</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                        Your privacy is as paramount to us as the flawless execution of your celebrations. Discover how we protect your personal information.
                    </p>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="relative w-full px-4 md:px-8 pb-32 z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="max-w-[900px] mx-auto"
                >
                    <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-8 md:p-16 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="max-w-none text-white/60 text-lg leading-relaxed font-light">
                            <p className="text-xl text-white/80 font-medium mb-8">
                                Last Updated: March 2026
                            </p>

                            <p className="mb-8">
                                Welcome to Himalayan Luxe ("we", "our", or "us"). We are an exclusive luxury event management company registered and operating under the laws of Nepal. We deeply value the trust of our discerning clients.
                                This Privacy Policy outlines how we collect, use, protect, and handle your personal data across our website and during the orchestration of our bespoke services, ensuring compliance with the Privacy Act, 2075 (2018) of Nepal.
                            </p>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">1. Information We Collect</h2>
                            <p className="mb-4">
                                To craft highly personalized and extraordinary experiences, we may collect the following types of information:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-8">
                                <li><strong className="text-white/80">Personal Details:</strong> Name, contact information (email, phone number), and billing or residential addresses.</li>
                                <li><strong className="text-white/80">Event Specifics:</strong> Dietary preferences, cultural or religious requirements, family structures, guest lists, and intimate details shared to personalize your event.</li>
                                <li><strong className="text-white/80">Travel & Logistics:</strong> Passport details, travel itineraries, and accommodation preferences when we manage full-scale destination events.</li>
                                <li><strong className="text-white/80">Digital Data:</strong> Information gathered through your interaction with our website, including IP addresses, browser types, and navigation patterns via cookies.</li>
                            </ul>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">2. How We Use Your Information</h2>
                            <p className="mb-4">
                                We utilize your personal data exclusively for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-8">
                                <li><strong className="text-white/80">Service Execution:</strong> To meticulously plan, design, and orchestrate your bespoke events and coordinate logistical arrangements.</li>
                                <li><strong className="text-white/80">Communication:</strong> To respond to your inquiries, provide ongoing updates during the planning process, and send necessary administrative notices.</li>
                                <li><strong className="text-white/80">Personalization:</strong> To tailor every facet of your event to your exact vision, ensuring an unparalleled level of service.</li>
                                <li><strong className="text-white/80">Improvement:</strong> To continuously enhance our website and service offerings based on client feedback and interactions.</li>
                            </ul>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">3. Information Sharing and Disclosure</h2>
                            <p className="mb-4">
                                Discretion is the cornerstone of our service. We <strong className="text-white/80">never</strong> sell, trade, or rent your personal information to third parties. We only share information under the following strict conditions:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-8">
                                <li><strong className="text-white/80">Trusted Partners:</strong> With elite vendors, hospitality partners, and artists directly involved in your event. These partners are bound by strict confidentiality agreements.</li>
                                <li><strong className="text-white/80">Legal Requirements:</strong> If required by law, court order, or governmental authority, specifically in accordance with the legal framework of Nepal.</li>
                            </ul>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">4. Data Security</h2>
                            <p className="mb-8">
                                We employ state-of-the-art security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Both our physical and digital infrastructures are designed to safeguard the sensitive nature of the information entrusted to us by our high-profile clients.
                            </p>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">5. Your Rights Under Nepalese Law</h2>
                            <p className="mb-4">
                                In alignment with the Privacy Act, 2075 (2018) of Nepal, you possess fundamental rights regarding your personal information:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-8">
                                <li><strong className="text-white/80">Right to Access:</strong> You may request a copy of the personal data we hold about you.</li>
                                <li><strong className="text-white/80">Right to Rectification:</strong> You may request corrections to any inaccurate or incomplete data.</li>
                                <li><strong className="text-white/80">Right to Erasure:</strong> You may request the deletion of your personal data when it is no longer strictly necessary for the purposes it was collected (subject to legal retention requirements).</li>
                            </ul>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">6. Changes to This Privacy Policy</h2>
                            <p className="mb-8">
                                As our prestigious services evolve, we may update this Privacy Policy. We will notify our clients of significant changes by posting the new policy on our website with an updated revision date.
                            </p>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">7. Contact Us</h2>
                            <p className="mb-6">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to our dedicated concierge team:
                            </p>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6 inline-block">
                                <p className="mb-2"><strong className="text-gold">Email:</strong> privacy@himalayanluxe.com</p>
                                <p className="mb-2"><strong className="text-gold">Phone:</strong> +977 (0) 1 2345678</p>
                                <p className="mb-0"><strong className="text-gold">Address:</strong> Kathmandu, Nepal</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <SimpleCTA />
        </div>
    );
}

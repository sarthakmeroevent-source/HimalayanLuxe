import { motion } from 'framer-motion';
import { useEffect } from 'react';
import SimpleCTA from '../components/common/SimpleCTA';

export default function TermsPage() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    const sections = [
        {
            title: "1. Introduction",
            content: (
                <>
                    <p>
                        These Terms of Use, together with our Privacy Policy (collectively, the "User Agreement"), form a legally binding agreement between you and Himalayan Luxe Ltd ("Himalayan Luxe", "we", "us", or "our") regarding your use of this website.
                    </p>
                    <p>
                        By accessing or using this website, you confirm that you accept these Terms of Use and that you agree to comply with them. If you do not agree to these terms, you must not use our website.
                    </p>
                </>
            )
        },
        {
            title: "2. Availability",
            content: (
                <>
                    <p>
                        We endeavor to ensure that this website is available 24 hours a day. However, we will not be liable if, for any reason, the website is unavailable at any time or for any period.
                    </p>
                    <p>
                        Access to this website may be suspended temporarily and without notice in the case of system failure, maintenance, or repair, or for reasons beyond our control.
                    </p>
                </>
            )
        },
        {
            title: "3. Use of Website",
            content: (
                <>
                    <p>
                        You may use this website only for lawful purposes. You may not use our website:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-white/60 marker:text-gold">
                        <li>In any way that breaches any applicable local, national, or international law or regulation.</li>
                        <li>In any way that is unlawful or fraudulent, or has any unlawful or fraudulent purpose or effect.</li>
                        <li>To transmit, or procure the sending of, any unsolicited or unauthorized advertising or promotional material.</li>
                        <li>To knowingly transmit any data, send or upload any material that contains viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs.</li>
                    </ul>
                    <p className="mt-4">
                        Except as expressly permitted by these Terms, you must not copy, reproduce, distribute, publish, enter into a database, display, perform, modify, create derivative works from, transmit, or in any way exploit any part of our website or its content.
                    </p>
                </>
            )
        },
        {
            title: "4. Intellectual Property",
            content: (
                <>
                    <p>
                        Himalayan Luxe Ltd is the owner or the licensee of all intellectual property rights in our website, and in the material published on it (including the site's structure, style, typography, imagery, and video). Those works are protected by copyright laws and treaties around the world. All such rights are reserved.
                    </p>
                    <p>
                        The reproduction of photographs and videos without written consent is strictly prohibited. The authors assert their moral rights over all such content.
                    </p>
                </>
            )
        },
        {
            title: "5. Information & Accuracy",
            content: (
                <>
                    <p>
                        The content on our website is provided for general information only. It is not intended to amount to advice on which you should rely. You must obtain professional or specialist advice before taking, or refraining from, any action on the basis of the content on our website.
                    </p>
                    <p>
                        Although we make reasonable efforts to update the information on our site, we make no representations, warranties, or guarantees, whether express or implied, that the content on our website is accurate, complete, or up to date.
                    </p>
                </>
            )
        },
        {
            title: "6. Liability",
            content: (
                <>
                    <p>
                        Nothing in these Terms of Use excludes or limits our liability for death or personal injury arising from our negligence, or our fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by law.
                    </p>
                    <p>
                        To the extent permitted by law, we exclude all conditions, warranties, representations or other terms which may apply to our website or any content on it, whether express or implied.
                    </p>
                    <p>
                        We will not be liable to any user for any loss or damage, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, even if foreseeable, arising under or in connection with:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-white/60 marker:text-gold">
                        <li>use of, or inability to use, our website; or</li>
                        <li>use of or reliance on any content displayed on our website.</li>
                    </ul>
                </>
            )
        },
        {
            title: "7. Indemnity",
            content: (
                <p>
                    You agree to indemnify, defend and hold harmless Himalayan Luxe Ltd, its directors, officers, employees, consultants, agents, and affiliates, from any and all third party claims, liability, damages and/or costs (including, but not limited to, legal fees) arising from your use of this website or your breach of the Terms of Use.
                </p>
            )
        },
        {
            title: "8. Governing Law & Jurisdiction",
            content: (
                <p>
                    These terms of use, their subject matter and their formation, are governed by the laws of Nepal. You and we both agree that the courts of Nepal will have exclusive jurisdiction over any disputes arising out of or related to this User Agreement or the use of our website.
                </p>
            )
        }
    ];

    return (
        <div className="relative min-h-screen pt-32 pb-0 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none -mr-40 -mt-20"></div>
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-deep/30 rounded-full blur-[150px] pointer-events-none -ml-40"></div>

            {/* Header Section */}
            <section className="relative w-full px-8 md:px-16 pt-12 pb-16 flex flex-col items-center justify-center">
                <div className="max-w-[1000px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            Legal Information
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,64px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Terms of <span className="liquid-gold-text italic">Use</span>
                        </h1>
                        <p className="text-white/60 text-lg mx-auto leading-relaxed">
                            Please read these terms carefully before utilizing our digital platforms.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative w-full px-6 md:px-12 lg:px-16 pb-24 z-10">
                <div className="max-w-[900px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 1 }}
                        className="glass-card rounded-[32px] p-8 md:p-12 lg:p-16"
                    >
                        <p className="text-white/50 text-sm tracking-wider uppercase mb-12 border-b border-white/10 pb-6">
                            Last Updated: March 2026
                        </p>

                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                >
                                    <h2 className="font-serif text-2xl text-gold/90 mb-4">{section.title}</h2>
                                    <div className="text-white/70 font-light leading-relaxed space-y-4">
                                        {section.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="mt-16 pt-10 border-t border-white/10">
                            <p className="text-white/70 font-light leading-relaxed">
                                If you have any concerns about material which appears on our site, please contact us at <a href="mailto:info@himalayanluxe.com" className="text-gold hover:underline transition-all">info@himalayanluxe.com</a>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <SimpleCTA 
                title={<>Any <span className="liquid-gold-text">Questions?</span></>}
                subtitle="Our concierge team is available to provide any clarity you may need regarding our services or terms."
            />
        </div>
    );
}

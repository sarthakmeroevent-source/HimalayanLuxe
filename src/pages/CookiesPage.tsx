import { motion } from 'framer-motion';
import { useEffect } from 'react';
import SimpleCTA from '../components/common/SimpleCTA';

export default function CookiesPage() {
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

    const cookieTypes = [
        {
            category: "Essential Cookies",
            description: "These are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.",
            cookies: [
                { name: "PHPSESSID", purpose: "Maintains user session state across page requests.", duration: "Session" },
                { name: "cookie-consent", purpose: "Remembers your cookie preference settings.", duration: "1 Year" }
            ]
        },
        {
            category: "Performance & Analytics",
            description: "These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.",
            cookies: [
                { name: "_ga", purpose: "Google Analytics: Used to distinguish users.", duration: "2 Years" },
                { name: "_gid", purpose: "Google Analytics: Used to distinguish users.", duration: "24 Hours" }
            ]
        },
        {
            category: "Marketing & Social",
            description: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
            cookies: [
                { name: "_fbp", purpose: "Facebook pixel used to deliver advertisement products.", duration: "3 Months" }
            ]
        }
    ];

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
                        Client Transparency
                        <span className="h-[1px] w-8 bg-gold/50"></span>
                    </span>
                    <h1 className="font-serif text-white/95 text-[clamp(32px,4vw,64px)] leading-[1.1] font-normal tracking-tight mb-6">
                        Cookie <span className="liquid-gold-text italic">Policy</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                        To ensure your digital journey with Himalayan Luxe is as seamless and personalized as our physical events, we utilize refined cookie technologies.
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
                    className="max-w-[1000px] mx-auto"
                >
                    <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-8 md:p-16 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="max-w-none text-white/60 text-lg leading-relaxed font-light">
                            <p className="text-xl text-white/80 font-medium mb-8">
                                Last Updated: March 2026
                            </p>

                            <p className="mb-12">
                                Himalayan Luxe ("we", "us", or "our") uses cookies on our website to enhance your experience, analyze site usage, and assist in our marketing efforts. This policy explains what cookies are, how we use them, and your choices regarding their use.
                            </p>

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">What are Cookies?</h2>
                            <p className="mb-12">
                                Cookies are small text files stored on your device when you visit a website. They serve as a "memory" for the website, allowing it to recognize your device and store information about your preferences or past actions, ensuring a more fluid and bespoke browsing experience.
                            </p>

                            {cookieTypes.map((type, idx) => (
                                <div key={idx} className="mb-16 last:mb-0">
                                    <h3 className="font-serif text-2xl text-white/90 mb-4">{type.category}</h3>
                                    <p className="mb-8 italic text-white/50 text-base">{type.description}</p>
                                    
                                    <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/5">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5">
                                                    <th className="p-5 text-gold text-xs uppercase tracking-widest font-semibold">Cookie Name</th>
                                                    <th className="p-5 text-gold text-xs uppercase tracking-widest font-semibold">Purpose</th>
                                                    <th className="p-5 text-gold text-xs uppercase tracking-widest font-semibold">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {type.cookies.map((cookie, cIdx) => (
                                                    <tr key={cIdx} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-5 text-white/80 font-mono text-sm">{cookie.name}</td>
                                                        <td className="p-5 text-white/60 text-sm leading-relaxed">{cookie.purpose}</td>
                                                        <td className="p-5 text-white/60 text-sm whitespace-nowrap">{cookie.duration}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            <h2 className="font-serif text-3xl text-gold mb-6 mt-12">Managing Your Preferences</h2>
                            <p className="mb-8">
                                Most web browsers allow you to control cookies through their settings. You can choose to block all cookies, or only third-party cookies, or have your browser notify you when a cookie is set. Please note that disabling essential cookies may affect the functionality of our website.
                            </p>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-12">
                                <h4 className="text-white/90 font-medium mb-4 italic">Direct Privacy Inquiries</h4>
                                <p className="text-sm mb-6">If you have specific questions about our use of cookies or your data privacy, our concierge team is available to assist you.</p>
                                <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                                    <p className="mb-0 text-sm"><strong className="text-gold uppercase tracking-tighter mr-2">Email:</strong> privacy@himalayanluxe.com</p>
                                    <p className="mb-0 text-sm"><strong className="text-gold uppercase tracking-tighter mr-2">Ref:</strong> Cookie Inquiry 2026</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <SimpleCTA />
        </div>
    );
}

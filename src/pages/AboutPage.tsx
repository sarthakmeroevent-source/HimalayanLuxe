import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleCTA from '../components/common/SimpleCTA';
import { Sparkles, Heart, Crown, Award } from 'lucide-react';
import { useAboutContent, useAboutStats, useTeamMembers } from '../hooks/useAboutContent';

// Fallback data
const fallbackStats = [
    { id: '1', number: '500+', label: 'Luxury Events', sort_order: 0 },
    { id: '2', number: '50+', label: 'Countries', sort_order: 1 },
    { id: '3', number: '15+', label: 'Years Excellence', sort_order: 2 },
    { id: '4', number: '100%', label: 'Satisfaction', sort_order: 3 },
];

const statIcons = [Crown, Sparkles, Award, Heart];

const fallbackTeam = [
    { id: '1', name: 'Sarthak Sharma', role: 'Founder & CEO', image_url: '/ceo.png', bio: 'Visionary leader with a passion for transforming Nepal into a world-class luxury event destination.', sort_order: 0 },
    { id: '2', name: 'Aashan Khatri', role: 'Head of Operations', image_url: '/HERO.png', bio: 'The engine behind every seamless celebration. Orchestrates logistics and execution with precision.', sort_order: 1 },
    { id: '3', name: 'Priya Thapa', role: 'Design Lead', image_url: '/HERO.png', bio: 'A creative force who translates emotions into spaces with elegance and deep aesthetic understanding.', sort_order: 2 },
];

const fallbackBody = [
    'We know these landscapes intimately — from the snow-capped peaks to the serene lakesides. Our clients don\'t just visit Nepal; they experience it as honored guests of the land itself.',
    'Our curated network of the finest vendors, venues, and artisans ensures every celebration is flawless. Relationships built on trust and a shared pursuit of excellence.',
    'A team of diverse backgrounds in event design, logistics, hospitality, and creative direction. No detail overlooked, no vision too ambitious.',
    'From the first conversation to the last dance — we make the entire journey as pleasurable and stress-free as possible. You dream it, we orchestrate it.',
];

function FlipCard({ member, index }: { member: typeof fallbackTeam[0]; index: number }) {
    const [flipped, setFlipped] = useState(false);
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[3/4] cursor-pointer [perspective:1200px]"
            onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)} onClick={() => setFlipped(f => !f)}>
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] border border-white/10">
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" draggable={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h3 className="font-serif text-white text-xl md:text-2xl mb-1">{member.name}</h3>
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-[1px] bg-gold/50" />
                            <p className="text-gold/80 text-[11px] tracking-[0.2em] uppercase">{member.role}</p>
                        </div>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] border border-gold/20"
                    style={{ background: 'linear-gradient(160deg, rgba(10,25,18,0.97), rgba(5,15,10,0.97))' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />
                    <div className="relative h-full flex flex-col justify-center p-8 md:p-10">
                        <div className="w-10 h-[2px] bg-gold/40 mb-6" />
                        <h3 className="font-serif text-white text-xl md:text-2xl mb-1">{member.name}</h3>
                        <p className="text-gold/70 text-[11px] tracking-[0.2em] uppercase mb-6">{member.role}</p>
                        <p className="text-white/55 text-sm leading-[1.8] font-light">{member.bio}</p>
                        <div className="mt-auto pt-8 flex items-center gap-2 text-white/20 text-[9px] tracking-[0.3em] uppercase">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
                            Hover to flip back
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function AboutPage() {
    const { data: aboutContent } = useAboutContent();
    const { data: dbStats } = useAboutStats();
    const { data: dbTeam } = useTeamMembers();

    const stats = dbStats && dbStats.length > 0 ? dbStats : fallbackStats;
    const team = dbTeam && dbTeam.length > 0 ? dbTeam : fallbackTeam;

    // Parse body: DB stores paragraphs separated by blank lines, or use fallback
    const bodyParagraphs = aboutContent?.body
        ? aboutContent.body.split(/\n\s*\n/).filter(Boolean)
        : fallbackBody;

    const heading = aboutContent?.subtitle || 'Curating memories beyond your imagination. Promoting Nepal as a global wedding destination hub.';

    useEffect(() => {
        window.scrollTo(0, 0);
        const t = setTimeout(() => window.scrollTo(0, 0), 10);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="relative min-h-screen pt-32 pb-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none -mr-40 -mt-20" />

            {/* Page Header */}
            <section className="relative w-full px-8 md:px-16 pt-10 pb-4 z-10">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-6">
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-3 block">Our Legacy</span>
                        <h1 className="font-serif text-white/95 text-[clamp(28px,4vw,56px)] leading-[1.1] font-normal tracking-tight mb-4">
                            About <span className="liquid-gold-text">Us</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* About Content */}
            <section className="relative w-full px-8 md:px-16 py-10 md:py-16 z-10">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 items-start">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                        <h2 className="font-serif text-white/90 text-2xl md:text-3xl lg:text-[2.5rem] leading-[1.25] mb-8">
                            {heading.includes('.') ? (
                                <>
                                    {heading.split('.')[0]}.{' '}
                                    <span className="text-gold italic">{heading.split('.').slice(1).join('.').trim()}</span>
                                </>
                            ) : heading}
                        </h2>
                        <div className="w-16 h-[1px] bg-gold/40 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-white/55 text-sm leading-[1.9] font-light">
                            {bodyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="hidden lg:block">
                        <div className="glass-card rounded-2xl p-8 border border-gold/20 text-center sticky top-32">
                            <p className="font-serif text-white/90 text-lg leading-snug mb-1">Plan Your Dream</p>
                            <p className="font-serif text-gold text-lg leading-snug mb-6">Himalayan Celebration</p>
                            <div className="w-8 h-[1px] bg-gold/30 mx-auto mb-6" />
                            <p className="text-white/40 text-xs tracking-wide mb-6 leading-relaxed">Let's create something extraordinary together</p>
                            <Link to="/contact" className="inline-block px-8 py-3 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] tracking-[0.2em] uppercase hover:bg-gold/20 hover:border-gold/50 transition-all duration-300">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Grid — Flip Cards */}
            <section className="relative w-full px-8 md:px-16 py-12 md:py-20 z-10">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-14">
                        <span className="text-gold text-[11px] tracking-[0.4em] uppercase font-medium block mb-4">The Visionaries</span>
                        <h2 className="font-serif text-white/95 text-3xl lg:text-4xl">Our Team</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {team.map((member, i) => (
                            <FlipCard key={member.id} member={member} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <section className="relative w-full px-8 md:px-16 py-12 md:py-20 z-10">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-card relative overflow-hidden rounded-[40px] p-8 md:p-16 border border-gold/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                            {stats.map((stat, i) => {
                                const Icon = statIcons[i % statIcons.length];
                                return (
                                    <div key={stat.id} className="flex flex-col items-center text-center group">
                                        <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:border-gold/50 transition-colors duration-500">
                                            <Icon className="w-6 h-6 text-gold opacity-80" />
                                        </div>
                                        <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/95 mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-500">{stat.number}</div>
                                        <div className="text-gold text-xs tracking-[0.2em] uppercase font-medium">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            <SimpleCTA />
        </div>
    );
}
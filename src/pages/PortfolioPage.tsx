import { motion } from 'framer-motion';
import { useState } from 'react';
import SimpleCTA from '../components/common/SimpleCTA';

const portfolioItems = [
    {
        id: 1,
        title: 'Royal Rajasthan Wedding',
        category: 'Wedding',
        location: 'Udaipur, India',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
        description: 'A three-day celebration at a historic palace'
    },
    {
        id: 2,
        title: 'Maldives Destination',
        category: 'Destination',
        location: 'Maldives',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
        description: 'Intimate beachfront ceremony at sunset'
    },
    {
        id: 3,
        title: 'French Chateau Affair',
        category: 'Wedding',
        location: 'Loire Valley, France',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
        description: 'Elegant celebration in a 16th-century chateau'
    },
    {
        id: 4,
        title: 'Dubai Luxury Gala',
        category: 'Corporate',
        location: 'Dubai, UAE',
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80',
        description: 'High-profile corporate event with 500+ guests'
    },
    {
        id: 5,
        title: 'Tuscany Villa Romance',
        category: 'Wedding',
        location: 'Tuscany, Italy',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
        description: 'Rustic elegance in Italian countryside'
    },
    {
        id: 6,
        title: 'Bali Cliffside Ceremony',
        category: 'Destination',
        location: 'Uluwatu, Bali',
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
        description: 'Breathtaking ocean views and traditional Balinese touches'
    }
];

const categories = ['All', 'Wedding', 'Destination', 'Corporate'];

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredItems = activeCategory === 'All' 
        ? portfolioItems 
        : portfolioItems.filter(item => item.category === activeCategory);

    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <section className="relative w-full px-8 md:px-16 py-20">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-16"
                    >
                        <span className="liquid-gold-text text-xs tracking-[0.4em] uppercase font-medium mb-6 block">
                            Our Work
                        </span>
                        <h1 className="font-serif text-white/95 text-[clamp(32px,5vw,72px)] leading-[1.1] font-normal tracking-tight mb-8">
                            Timeless <span className="liquid-gold-text">Masterpieces</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                            Each event is a unique story, meticulously crafted and flawlessly executed
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center gap-4 mb-16 flex-wrap"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 ${
                                    activeCategory === category
                                        ? 'bg-gold/20 border border-gold text-gold'
                                        : 'border border-white/20 text-white/60 hover:border-gold/50 hover:text-gold'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>

                    {/* Portfolio Grid */}
                    <motion.div 
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-[24px] aspect-[4/5] cursor-pointer"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <span className="text-gold text-xs tracking-[0.3em] uppercase mb-2 block">
                                            {item.category}
                                        </span>
                                        <h3 className="font-serif text-white text-2xl mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/60 text-sm mb-2">
                                            {item.location}
                                        </p>
                                        <p className="text-white/50 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            <SimpleCTA />
        </div>
    );
}

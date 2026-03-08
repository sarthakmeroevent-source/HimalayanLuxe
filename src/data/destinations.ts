const baseImages = [
    'https://images.unsplash.com/photo-1745677617593-75a5bbd1a8f7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1640876522637-9432f175581f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1592731056711-b3101e30584b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
    'https://images.unsplash.com/photo-1673129864790-0fa848c4720e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1733899740934-95dd57fc113b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596221897845-b8ebacc61293?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1680112365184-dc7dfb5db6ed?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop'
];

const getGallery = (startIndex: number, count: number = 18) => {
    const gallery = [];
    for (let i = 0; i < count; i++) {
        gallery.push(baseImages[(startIndex + i) % baseImages.length]);
    }
    return gallery;
};

export const destinationsData = [
    {
        id: 'phewa-lake',
        name: 'Phewa Lake',
        code: 'PHEWA LAKE',
        description: 'Serene waters reflecting the majestic Annapurna range',
        fullDescription: 'Experience the magic of Phewa Lake, where the reflection of Mount Machhapuchhre creates a picture-perfect backdrop. Ideal for both intimate ceremonies and grand celebrations, this location offers a blend of natural beauty and cultural richness.',
        image: baseImages[0],
        events: '50+ Events',
        features: ['Lakeside Venues', 'Boat Access', 'Mountain Views'],
        gallery: getGallery(0)
    },
    {
        id: 'annapurna',
        name: 'Annapurna Himalaya',
        code: 'ANNAPURNA',
        description: 'Snow-capped peaks setting an awe-inspiring backdrop',
        fullDescription: 'Immerse yourself in the breathtaking majesty of the Annapurna range. Our exclusive high-altitude venues provide unparalleled panoramic views, creating an unforgettable setting for your most significant moments.',
        image: baseImages[1],
        events: '40+ Events',
        features: ['Panoramic Views', 'Luxury Camps', 'Helicopter Access'],
        gallery: getGallery(1)
    },
    {
        id: 'mustang',
        name: 'Mustang',
        code: 'MUSTANG',
        description: 'Mystical desert landscapes and ancient Tibetan culture',
        fullDescription: 'Discover the ancient and mystical kingdom of Mustang. Its unique desert landscape, striking red cliffs, and profound cultural heritage offer an extraordinarily dramatic and deeply spiritual setting for any celebration.',
        image: baseImages[2],
        events: '35+ Events',
        features: ['Ancient Monasteries', 'Desert Landscapes', 'Cultural Immersion'],
        gallery: getGallery(2)
    },
    {
        id: 'illam',
        name: 'Illam',
        code: 'ILLAM',
        description: 'Lush tea gardens rolling across misty emerald hills',
        fullDescription: 'Step into the verdant paradise of Illam, famous for its rolling tea gardens and cool, misty climate. This serene and exceptionally green region provides a refreshing and elegant backdrop for daytime events and retreats.',
        image: baseImages[3],
        events: '45+ Events',
        features: ['Tea Garden Estates', 'Misty Mornings', 'Boutique Resorts'],
        gallery: getGallery(3)
    },
    {
        id: 'badimalika',
        name: 'Badimalika',
        code: 'BADIMALIKA',
        description: 'Pristine meadows offering untouched natural elegance',
        fullDescription: 'A hidden jewel of the far-west, Badimalika boasts expansive alpine meadows that seemingly touch the sky. It represents the ultimate exclusive experience, pristine, untouched, and utterly magnificent.',
        image: baseImages[4],
        events: '30+ Events',
        features: ['Alpine Meadows', 'Remote Exclusivity', 'Wildflower Blooms'],
        gallery: getGallery(4)
    },
    {
        id: 'manang',
        name: 'Manang',
        code: 'MANANG',
        description: 'High altitude serenity hidden within the rocky passes',
        fullDescription: 'Nestled amidst the spectacular Himalayas, Manang offers a raw and powerful landscape. Its stark beauty, traditional stone architecture, and proximity to glacial lakes make it an adventurous yet deeply romantic destination.',
        image: baseImages[5],
        events: '55+ Events',
        features: ['Glacial Lakes', 'Stone Architecture', 'Adventure Focus'],
        gallery: getGallery(5)
    },
    {
        id: 'solukhumbu',
        name: 'Solukhumbu',
        code: 'SOLUKHUMBU',
        description: 'The roof of the world in the legendary Everest region',
        fullDescription: 'Host your event in the shadow of Mount Everest. Solukhumbu is the epitome of grandeur and triumph. Our bespoke services ensure that even in this remote and soaring environment, luxury and perfection are guaranteed.',
        image: baseImages[6],
        events: '25+ Events',
        features: ['Everest Views', 'Sherpa Culture', 'Luxury Lodges'],
        gallery: getGallery(6)
    },
    {
        id: 'gorkha',
        name: 'Gorkha',
        code: 'GORKHA',
        description: 'Historic grandeur steeped in rich royal heritage',
        fullDescription: 'Celebrate amidst the historical significance and architectural splendor of Gorkha. The dramatic hilltop palaces and ancient temples provide a regal and culturally profound atmosphere for grand, traditional ceremonies.',
        image: baseImages[7],
        events: '20+ Events',
        features: ['Historic Forts', 'Palace Courtyards', 'Royal Heritage'],
        gallery: getGallery(7)
    },
    {
        id: 'lumbini',
        name: 'Lumbini',
        code: 'LUMBINI',
        description: 'The birthplace of Buddha, radiating profound peace',
        fullDescription: 'Find tranquility and spiritual resonance in Lumbini. The sprawling sacred gardens, magnificent monasteries, and profound history make this an unparalleled destination for wellness retreats and serene, mindful ceremonies.',
        image: baseImages[8],
        events: '60+ Events',
        features: ['Sacred Gardens', 'Monastic Zones', 'Spiritual Ambiance'],
        gallery: getGallery(8)
    }
];

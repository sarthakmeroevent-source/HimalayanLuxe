import OrbitCarousel from "@/components/ui/animated-carousel";

export default function OrbitCarouselDemo() {
  const dummyItems = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', label: 'Mountains' },
    { id: 2, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', label: 'Ocean' },
    { id: 3, url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', label: 'Beach' },
  ];

  return (
    <div className="bg-gray-950 min-h-screen">
       <OrbitCarousel items={dummyItems} />
    </div>
  );
}

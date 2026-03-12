import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useGallery() {
  return useQuery({
    queryKey: ['gallery-aggregated'],
    queryFn: async () => {
      // Fetch from all sources in parallel (including team_members to exclude their photos)
      const [mediaRes, destGalleryRes, destinationsRes, teamRes] = await Promise.all([
        supabase.from('media_files').select('id, url, filename, mime_type').not('mime_type', 'like', 'video/%').order('uploaded_at', { ascending: false }),
        supabase.from('destination_gallery').select('id, image_url').order('sort_order', { ascending: true }),
        supabase.from('destinations').select('id, cover_image_url, name').order('sort_order', { ascending: true }),
        supabase.from('team_members').select('image_url'),
      ]);

      // Collect team member image URLs to exclude from gallery
      const teamUrls = new Set<string>();
      if (teamRes.data) {
        for (const t of teamRes.data) {
          if (t.image_url) teamUrls.add(t.image_url);
        }
      }

      const images: GalleryImage[] = [];
      const seenUrls = new Set<string>();

      // 1. Destination cover images first
      if (destinationsRes.data) {
        for (const d of destinationsRes.data) {
          if (d.cover_image_url && !seenUrls.has(d.cover_image_url)) {
            seenUrls.add(d.cover_image_url);
            images.push({ id: `dest-${d.id}`, image_url: d.cover_image_url, caption: d.name });
          }
        }
      }

      // 2. Destination gallery images
      if (destGalleryRes.data) {
        for (const g of destGalleryRes.data) {
          if (g.image_url && !seenUrls.has(g.image_url)) {
            seenUrls.add(g.image_url);
            images.push({ id: `dg-${g.id}`, image_url: g.image_url, caption: null });
          }
        }
      }

      // 3. Media library images (exclude videos and team member photos)
      if (mediaRes.data) {
        for (const m of mediaRes.data) {
          if (m.url && !seenUrls.has(m.url) && !teamUrls.has(m.url)) {
            seenUrls.add(m.url);
            images.push({ id: `media-${m.id}`, image_url: m.url, caption: m.filename });
          }
        }
      }

      return shuffle(images);
    },
    staleTime: 1000 * 60 * 5,
  });
}

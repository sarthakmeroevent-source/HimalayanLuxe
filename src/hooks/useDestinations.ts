import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  cover_image_url: string;
  description: string;
  full_description: string | null;
  events: string | null;
  features: string[];
  sort_order: number;
}

export interface DestinationGalleryImage {
  id: string;
  destination_id: string;
  image_url: string;
  sort_order: number;
}

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as DestinationItem[];
    },
    staleTime: 1000 * 60 * 10,
    retry: 3,
    refetchOnWindowFocus: true,
  });
}

export function useDestinationBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['destination-public', slug],
    queryFn: async () => {
      if (!slug) return null;
      // Try slug first, then id
      let { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!data) {
        ({ data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', slug)
          .maybeSingle());
      }
      if (error) throw error;
      return data as DestinationItem | null;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

export function useDestinationGallery(destinationId: string | undefined) {
  return useQuery({
    queryKey: ['destination-gallery-public', destinationId],
    queryFn: async () => {
      if (!destinationId) return [];
      const { data, error } = await supabase
        .from('destination_gallery')
        .select('*')
        .eq('destination_id', destinationId)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as DestinationGalleryImage[];
    },
    enabled: !!destinationId,
    staleTime: 1000 * 60 * 10,
  });
}

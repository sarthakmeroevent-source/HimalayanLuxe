import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface HeroItem {
  id: string;
  title: string;
  tagline: string;
  media_url: string;
  media_type: 'video' | 'image';
  status: 'active' | 'disabled';
}

export function useActiveHero() {
  return useQuery({
    queryKey: ['active-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_items')
        .select('*')
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data as HeroItem | null;
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}

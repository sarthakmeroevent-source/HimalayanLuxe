import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface PhilosophyItem {
  id: string;
  title: string;
  heading: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export function usePhilosophies() {
  return useQuery({
    queryKey: ['philosophies-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('philosophies')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as PhilosophyItem[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

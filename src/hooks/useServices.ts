import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  features: string[];
  sort_order: number;
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as ServiceItem[];
    },
    retry: 3,
    refetchOnWindowFocus: true,
  });
}

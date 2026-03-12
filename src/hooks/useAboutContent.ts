import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface AboutContent {
  id: string;
  heading: string;
  subtitle: string;
  body: string;
}

export interface AboutStat {
  id: string;
  number: string;
  label: string;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  sort_order: number;
}

export function useAboutContent() {
  return useQuery({
    queryKey: ['about_content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('about_content').select('*').limit(1).single();
      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data as AboutContent;
    },
  });
}

export function useAboutStats() {
  return useQuery({
    queryKey: ['about_stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('about_stats').select('*').order('sort_order');
      if (error) throw error;
      return data as AboutStat[];
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*').order('sort_order');
      if (error) throw error;
      return data as TeamMember[];
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useWorkExperience() {
  return useQuery({
    queryKey: ["work_experience"],
    queryFn: async () => {
      const { data, error } = await supabase.from("work_experience").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase.from("education").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useHobbies() {
  return useQuery({
    queryKey: ["hobbies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hobbies").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

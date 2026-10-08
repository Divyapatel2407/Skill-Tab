import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { Profile, Skill, Project, Certification, Internship, ProfileData } from './supabase';

export function useProfileData() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [data, setData] = useState<ProfileData>({
    profile: null,
    skills: [],
    projects: [],
    certifications: [],
    internships: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ensureProfile = useCallback(async () => {
    const { data: existing, error: e1 } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (e1) throw e1;

    if (existing) {
      setProfileId(existing.id);
      return existing as Profile;
    }

    const { data: created, error: e2 } = await supabase
      .from('profiles')
      .insert({ full_name: 'New Student' })
      .select()
      .single();

    if (e2) throw e2;
    setProfileId((created as Profile).id);
    return created as Profile;
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await ensureProfile();
      const pid = profile.id;

      const [skillsRes, projectsRes, certsRes, internRes] = await Promise.all([
        supabase.from('skills').select('*').eq('profile_id', pid).order('created_at'),
        supabase.from('projects').select('*').eq('profile_id', pid).order('created_at', { ascending: false }),
        supabase.from('certifications').select('*').eq('profile_id', pid).order('created_at', { ascending: false }),
        supabase.from('internships').select('*').eq('profile_id', pid).order('created_at', { ascending: false }),
      ]);

      if (skillsRes.error) throw skillsRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (certsRes.error) throw certsRes.error;
      if (internRes.error) throw internRes.error;

      setProfileId(pid);
      setData({
        profile: profile,
        skills: (skillsRes.data as Skill[]) ?? [],
        projects: (projectsRes.data as Project[]) ?? [],
        certifications: (certsRes.data as Certification[]) ?? [],
        internships: (internRes.data as Internship[]) ?? [],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [ensureProfile]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!profileId) return;
      const { error: err } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profileId);
      if (err) throw err;
      await loadAll();
    },
    [profileId, loadAll]
  );

  return { profileId, data, loading, error, loadAll, updateProfile, setProfileId };
}

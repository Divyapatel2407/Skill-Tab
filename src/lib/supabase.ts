import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  university: string | null;
  degree: string | null;
  major: string | null;
  graduation_year: number | null;
  gpa: number | null;
  achievements: string | null;
  linkedin: string | null;
  github: string | null;
  target_career: string | null;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  profile_id: string;
  name: string;
  category: 'technical' | 'soft';
  proficiency: number; // 1-5
  created_at: string;
};

export type Project = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  technologies: string[];
  link: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type Certification = {
  id: string;
  profile_id: string;
  name: string;
  issuer: string | null;
  domain: string | null;
  issue_date: string | null;
  credential_id: string | null;
  created_at: string;
};

export type Internship = {
  id: string;
  profile_id: string;
  company: string;
  role: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  skills_gained: string[];
  created_at: string;
};

export type ProfileData = {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  internships: Internship[];
};

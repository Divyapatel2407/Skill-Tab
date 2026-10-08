/*
# SkillTab - Smart Student Career Profile Schema

## Overview
Creates the full database schema for SkillTab, a career intelligence platform.
Single-tenant model (no auth) — one student profile with related skills, projects,
certifications, and internships. Career skill requirements are hardcoded in the
frontend as reference data.

## Tables

### profiles
- Stores the student's personal and academic information.
- Columns: id, full_name, email, phone, bio, university, degree, major,
  graduation_year, gpa, achievements, linkedin, github, target_career, created_at, updated_at.

### skills
- Stores technical and soft skills with proficiency levels (1=Beginner to 5=Expert).
- Columns: id, profile_id (FK), name, category ('technical'|'soft'), proficiency (1-5), created_at.

### projects
- Stores project entries with technologies used.
- Columns: id, profile_id (FK), title, description, technologies (text[]), link, start_date, end_date, created_at.

### certifications
- Stores certifications with relevant domains.
- Columns: id, profile_id (FK), name, issuer, domain, issue_date, credential_id, created_at.

### internships
- Stores internship experience records.
- Columns: id, profile_id (FK), company, role, description, start_date, end_date, location, skills_gained (text[]), created_at.

## Security
- RLS enabled on all tables.
- Policies allow anon + authenticated full CRUD (single-tenant, intentionally public data).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'New Student',
  email text,
  phone text,
  bio text,
  university text,
  degree text,
  major text,
  graduation_year int,
  gpa numeric(3,2),
  achievements text,
  linkedin text,
  github text,
  target_career text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'technical' CHECK (category IN ('technical', 'soft')),
  proficiency int NOT NULL DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_skills" ON skills;
CREATE POLICY "anon_select_skills" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_skills" ON skills;
CREATE POLICY "anon_insert_skills" ON skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_skills" ON skills;
CREATE POLICY "anon_update_skills" ON skills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_skills" ON skills;
CREATE POLICY "anon_delete_skills" ON skills FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  technologies text[] DEFAULT '{}',
  link text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text,
  domain text,
  issue_date date,
  credential_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_certifications" ON certifications;
CREATE POLICY "anon_select_certifications" ON certifications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_certifications" ON certifications;
CREATE POLICY "anon_insert_certifications" ON certifications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_certifications" ON certifications;
CREATE POLICY "anon_update_certifications" ON certifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_certifications" ON certifications;
CREATE POLICY "anon_delete_certifications" ON certifications FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company text NOT NULL,
  role text,
  description text,
  start_date date,
  end_date date,
  location text,
  skills_gained text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_internships" ON internships;
CREATE POLICY "anon_select_internships" ON internships FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_internships" ON internships;
CREATE POLICY "anon_insert_internships" ON internships FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_internships" ON internships;
CREATE POLICY "anon_update_internships" ON internships FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_internships" ON internships;
CREATE POLICY "anon_delete_internships" ON internships FOR DELETE TO anon, authenticated USING (true);

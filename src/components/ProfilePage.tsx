import { useState } from 'react';
import { User, Save, CheckCircle2 } from 'lucide-react';
import type { ProfileData } from '@/lib/supabase';
import { SectionHeader, Button, Input, TextArea, Select } from './ui';

type ProfilePageProps = {
  data: ProfileData;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
};

export function ProfilePage({ data, onUpdate }: ProfilePageProps) {
  const profile = data.profile;
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    bio: profile?.bio ?? '',
    university: profile?.university ?? '',
    degree: profile?.degree ?? '',
    major: profile?.major ?? '',
    graduation_year: profile?.graduation_year?.toString() ?? '',
    gpa: profile?.gpa?.toString() ?? '',
    achievements: profile?.achievements ?? '',
    linkedin: profile?.linkedin ?? '',
    github: profile?.github ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onUpdate({
        full_name: form.full_name || 'New Student',
        email: form.email || null,
        phone: form.phone || null,
        bio: form.bio || null,
        university: form.university || null,
        degree: form.degree || null,
        major: form.major || null,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        gpa: form.gpa ? parseFloat(form.gpa) : null,
        achievements: form.achievements || null,
        linkedin: form.linkedin || null,
        github: form.github || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Profile"
        subtitle="Personal and academic information"
        icon={User}
        action={
          <Button onClick={handleSave} disabled={saving} size="md">
            {saving ? (
              'Saving...'
            ) : saved ? (
              <>
                <CheckCircle2 size={16} /> Saved!
              </>
            ) : (
              <>
                <Save size={16} /> Save Profile
              </>
            )}
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 234 567 890"
            />
            <Input
              label="LinkedIn"
              value={form.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
            <Input
              label="GitHub"
              value={form.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="github.com/johndoe"
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Bio"
              rows={3}
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="A short description about yourself..."
            />
          </div>
        </div>

        {/* Academic Info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Academic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="University"
              value={form.university}
              onChange={(e) => handleChange('university', e.target.value)}
              placeholder="Stanford University"
            />
            <Select
              label="Degree"
              value={form.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
            >
              <option value="">Select degree</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.E">B.E</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.Com">B.Com</option>
              <option value="B.A">B.A</option>
              <option value="M.Tech">M.Tech</option>
              <option value="M.Sc">M.Sc</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
            </Select>
            <Input
              label="Major / Field of Study"
              value={form.major}
              onChange={(e) => handleChange('major', e.target.value)}
              placeholder="Computer Science"
            />
            <Input
              label="Graduation Year"
              type="number"
              value={form.graduation_year}
              onChange={(e) => handleChange('graduation_year', e.target.value)}
              placeholder="2026"
            />
            <Input
              label="GPA (out of 10)"
              type="number"
              step="0.01"
              value={form.gpa}
              onChange={(e) => handleChange('gpa', e.target.value)}
              placeholder="8.5"
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Academic Achievements"
              rows={3}
              value={form.achievements}
              onChange={(e) => handleChange('achievements', e.target.value)}
              placeholder="Dean's list, hackathon winner, best project award..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

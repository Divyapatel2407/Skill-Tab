import { useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar, MapPin, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Internship } from '@/lib/supabase';
import { SectionHeader, Button, Input, TextArea, Modal, Badge, EmptyState } from './ui';

type InternshipsPageProps = {
  profileId: string | null;
  internships: Internship[];
  onReload: () => void;
};

export function InternshipsPage({ profileId, internships, onReload }: InternshipsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    company: '',
    role: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    skills_gained: '',
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!profileId || !form.company.trim()) return;
    setSaving(true);
    try {
      const skills = form.skills_gained
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await supabase.from('internships').insert({
        profile_id: profileId,
        company: form.company.trim(),
        role: form.role || null,
        description: form.description || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        location: form.location || null,
        skills_gained: skills,
      });
      setForm({ company: '', role: '', description: '', start_date: '', end_date: '', location: '', skills_gained: '' });
      setModalOpen(false);
      onReload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('internships').delete().eq('id', id);
    onReload();
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <SectionHeader
        title="Internships"
        subtitle="Record your internship experience and skills gained"
        icon={Briefcase}
        action={
          <Button onClick={() => setModalOpen(true)} size="md">
            <Plus size={16} /> Add Internship
          </Button>
        }
      />

      {internships.length > 0 ? (
        <div className="space-y-4">
          {internships.map((intern) => (
            <div
              key={intern.id}
              className="group rounded-2xl border border-slate-800 bg-slate-800/30 p-5 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Briefcase size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{intern.company}</h3>
                    {intern.role && <p className="text-sm text-slate-400">{intern.role}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(intern.id)}
                  className="rounded-lg p-1 text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              {intern.description && (
                <p className="mt-3 text-sm text-slate-400">{intern.description}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {(intern.start_date || intern.end_date) && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(intern.start_date)} — {formatDate(intern.end_date) || 'Present'}
                  </span>
                )}
                {intern.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {intern.location}
                  </span>
                )}
              </div>
              {intern.skills_gained && intern.skills_gained.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {intern.skills_gained.map((skill) => (
                    <Badge key={skill} className="border-slate-700 bg-slate-700/40 text-slate-300">
                      <Cpu size={10} /> {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No internships yet"
          description="Add your internship experiences to demonstrate real-world exposure."
          action={
            <Button onClick={() => setModalOpen(true)} size="sm">
              <Plus size={14} /> Add Internship
            </Button>
          }
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Internship">
        <div className="space-y-4">
          <Input
            label="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="e.g. Google, Microsoft, Startup Inc."
            autoFocus
          />
          <Input
            label="Role / Position"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Software Engineer Intern"
          />
          <TextArea
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What did you work on? What were your responsibilities?"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </div>
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Bangalore, India / Remote"
          />
          <Input
            label="Skills Gained (comma-separated)"
            value={form.skills_gained}
            onChange={(e) => setForm({ ...form, skills_gained: e.target.value })}
            placeholder="React, Node.js, Teamwork, Git"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving || !form.company.trim()}>
              {saving ? 'Adding...' : 'Add Internship'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

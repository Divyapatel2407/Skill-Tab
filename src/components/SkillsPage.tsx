import { useState } from 'react';
import { Wrench, Plus, Trash2, Code2, Heart, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/supabase';
import { proficiencyLabels, proficiencyColors } from '@/lib/careers';
import { SectionHeader, Button, Input, Select, Modal, Badge, EmptyState } from './ui';

type SkillsPageProps = {
  profileId: string | null;
  skills: Skill[];
  onReload: () => void;
};

export function SkillsPage({ profileId, skills, onReload }: SkillsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'technical', proficiency: 3 });
  const [saving, setSaving] = useState(false);

  const techSkills = skills.filter((s) => s.category === 'technical');
  const softSkills = skills.filter((s) => s.category === 'soft');

  const handleAdd = async () => {
    if (!profileId || !form.name.trim()) return;
    setSaving(true);
    try {
      await supabase.from('skills').insert({
        profile_id: profileId,
        name: form.name.trim(),
        category: form.category,
        proficiency: form.proficiency,
      });
      setForm({ name: '', category: 'technical', proficiency: 3 });
      setModalOpen(false);
      onReload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id);
    onReload();
  };

  const renderSkillCard = (skill: Skill) => (
    <div
      key={skill.id}
      className="group flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/40 p-3.5 transition hover:border-slate-600"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{skill.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge className={proficiencyColors[skill.proficiency]}>
              {proficiencyLabels[skill.proficiency]}
            </Badge>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={10}
                  className={n <= skill.proficiency ? 'fill-blue-400 text-blue-400' : 'text-slate-700'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleDelete(skill.id)}
        className="rounded-lg p-1.5 text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div>
      <SectionHeader
        title="Skills"
        subtitle="Technical and soft skills with proficiency levels"
        icon={Wrench}
        action={
          <Button onClick={() => setModalOpen(true)} size="md">
            <Plus size={16} /> Add Skill
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Technical Skills */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Code2 size={18} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Technical Skills</h3>
            <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-300">{techSkills.length}</Badge>
          </div>
          {techSkills.length > 0 ? (
            <div className="space-y-2.5">{techSkills.map(renderSkillCard)}</div>
          ) : (
            <EmptyState
              icon={Code2}
              title="No technical skills yet"
              description="Add programming languages, tools, and technologies you know."
            />
          )}
        </div>

        {/* Soft Skills */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Heart size={18} className="text-pink-400" />
            <h3 className="text-sm font-semibold text-white">Soft Skills</h3>
            <Badge className="border-pink-500/30 bg-pink-500/10 text-pink-300">{softSkills.length}</Badge>
          </div>
          {softSkills.length > 0 ? (
            <div className="space-y-2.5">{softSkills.map(renderSkillCard)}</div>
          ) : (
            <EmptyState
              icon={Heart}
              title="No soft skills yet"
              description="Add communication, leadership, teamwork and other soft skills."
            />
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Skill">
        <div className="space-y-4">
          <Input
            label="Skill Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Python, Communication, React..."
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft</option>
          </Select>
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-400">
              Proficiency: {proficiencyLabels[form.proficiency]}
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, proficiency: n })}
                  className={`flex-1 rounded-lg border py-2.5 text-center text-xs font-medium transition ${
                    form.proficiency === n
                      ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                      : 'border-slate-700 bg-slate-800/30 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {n}
                  <span className="mt-0.5 block text-[9px] opacity-70">{proficiencyLabels[n]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving || !form.name.trim()}>
              {saving ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

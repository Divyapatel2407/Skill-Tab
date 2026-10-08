import { useState } from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink, Calendar, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/supabase';
import { SectionHeader, Button, Input, TextArea, Modal, Badge, EmptyState } from './ui';

type ProjectsPageProps = {
  profileId: string | null;
  projects: Project[];
  onReload: () => void;
};

export function ProjectsPage({ profileId, projects, onReload }: ProjectsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    start_date: '',
    end_date: '',
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!profileId || !form.title.trim()) return;
    setSaving(true);
    try {
      const techs = form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await supabase.from('projects').insert({
        profile_id: profileId,
        title: form.title.trim(),
        description: form.description || null,
        technologies: techs,
        link: form.link || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      setForm({ title: '', description: '', technologies: '', link: '', start_date: '', end_date: '' });
      setModalOpen(false);
      onReload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    onReload();
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <SectionHeader
        title="Projects"
        subtitle="Showcase your projects and technologies used"
        icon={FolderGit2}
        action={
          <Button onClick={() => setModalOpen(true)} size="md">
            <Plus size={16} /> Add Project
          </Button>
        }
      />

      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-slate-800 bg-slate-800/30 p-5 transition hover:border-slate-700"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white">{project.title}</h3>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="rounded-lg p-1 text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              {project.description && (
                <p className="mb-3 text-sm text-slate-400 line-clamp-3">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} className="border-slate-700 bg-slate-700/40 text-slate-300">
                      <Cpu size={10} /> {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500">
                {(project.start_date || project.end_date) && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(project.start_date)} — {formatDate(project.end_date) || 'Present'}
                  </span>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    View <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Add your academic, personal, or hackathon projects to showcase your work."
          action={
            <Button onClick={() => setModalOpen(true)} size="sm">
              <Plus size={14} /> Add Project
            </Button>
          }
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Project">
        <div className="space-y-4">
          <Input
            label="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Smart Resume Builder"
            autoFocus
          />
          <TextArea
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this project do? What problem does it solve?"
          />
          <Input
            label="Technologies (comma-separated)"
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            placeholder="React, Node.js, PostgreSQL, TailwindCSS"
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
            label="Project Link (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://github.com/username/project"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving || !form.title.trim()}>
              {saving ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

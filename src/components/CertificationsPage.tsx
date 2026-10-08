import { useState } from 'react';
import { Award, Plus, Trash2, Calendar, Building2, Hash } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Certification } from '@/lib/supabase';
import { SectionHeader, Button, Input, Modal, Badge, EmptyState } from './ui';

type CertificationsPageProps = {
  profileId: string | null;
  certifications: Certification[];
  onReload: () => void;
};

export function CertificationsPage({ profileId, certifications, onReload }: CertificationsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    domain: '',
    issue_date: '',
    credential_id: '',
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!profileId || !form.name.trim()) return;
    setSaving(true);
    try {
      await supabase.from('certifications').insert({
        profile_id: profileId,
        name: form.name.trim(),
        issuer: form.issuer || null,
        domain: form.domain || null,
        issue_date: form.issue_date || null,
        credential_id: form.credential_id || null,
      });
      setForm({ name: '', issuer: '', domain: '', issue_date: '', credential_id: '' });
      setModalOpen(false);
      onReload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('certifications').delete().eq('id', id);
    onReload();
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <SectionHeader
        title="Certifications"
        subtitle="Professional certifications and relevant domains"
        icon={Award}
        action={
          <Button onClick={() => setModalOpen(true)} size="md">
            <Plus size={16} /> Add Certification
          </Button>
        }
      />

      {certifications.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-2xl border border-slate-800 bg-slate-800/30 p-5 transition hover:border-slate-700"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <Award size={20} className="text-amber-400" />
                </div>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="rounded-lg p-1 text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-white">{cert.name}</h3>
              {cert.issuer && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Building2 size={12} /> {cert.issuer}
                </p>
              )}
              {cert.domain && (
                <div className="mt-2">
                  <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-300">{cert.domain}</Badge>
                </div>
              )}
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                {cert.issue_date && (
                  <p className="flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(cert.issue_date)}
                  </p>
                )}
                {cert.credential_id && (
                  <p className="flex items-center gap-1">
                    <Hash size={11} /> {cert.credential_id}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No certifications yet"
          description="Add your professional certifications to strengthen your career profile."
          action={
            <Button onClick={() => setModalOpen(true)} size="sm">
              <Plus size={14} /> Add Certification
            </Button>
          }
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Certification">
        <div className="space-y-4">
          <Input
            label="Certification Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. AWS Certified Solutions Architect"
            autoFocus
          />
          <Input
            label="Issuer / Organization"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            placeholder="e.g. Amazon Web Services"
          />
          <Input
            label="Domain"
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            placeholder="e.g. Cloud Computing, Data Science, Cybersecurity"
          />
          <Input
            label="Issue Date"
            type="date"
            value={form.issue_date}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
          />
          <Input
            label="Credential ID (optional)"
            value={form.credential_id}
            onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
            placeholder="e.g. AWS-ASA-123456"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving || !form.name.trim()}>
              {saving ? 'Adding...' : 'Add Certification'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import {
  TrendingUp,
  Wrench,
  FolderGit2,
  Award,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import type { Page } from './Sidebar';
import type { ProfileData } from '@/lib/supabase';
import { getCareer, proficiencyLabels } from '@/lib/careers';
import { analyzeCareer } from '@/lib/analysis';
import { SectionHeader, Button } from './ui';

type DashboardProps = {
  data: ProfileData;
  onNavigate: (page: Page) => void;
};

export function Dashboard({ data, onNavigate }: DashboardProps) {
  const { profile, skills, projects, certifications, internships } = data;
  const career = getCareer(profile?.target_career ?? null);
  const analysis = profile?.target_career ? analyzeCareer(profile.target_career, skills) : null;

  const techSkills = skills.filter((s) => s.category === 'technical');
  const softSkills = skills.filter((s) => s.category === 'soft');

  const stats = [
    { label: 'Technical Skills', value: techSkills.length, icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Projects', value: projects.length, icon: FolderGit2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Certifications', value: certifications.length, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Internships', value: internships.length, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const scoreColor =
    analysis && analysis.readinessScore >= 75
      ? 'text-emerald-400'
      : analysis && analysis.readinessScore >= 50
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        subtitle="Your career profile at a glance"
        icon={TrendingUp}
      />

      {/* Welcome banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-800/80 via-slate-800/40 to-slate-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Welcome back, {profile?.full_name || 'Student'}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {career
                ? `Targeting: ${career.title}`
                : 'Select a target career to see your readiness analysis'}
            </p>
          </div>
          <Button onClick={() => onNavigate('analysis')} variant="secondary" size="md">
            <Target size={16} />
            Career Analysis
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => {
                const pageMap: Record<string, Page> = {
                  'Technical Skills': 'skills',
                  Projects: 'projects',
                  Certifications: 'certifications',
                  Internships: 'internships',
                };
                onNavigate(pageMap[stat.label]);
              }}
              className="group rounded-xl border border-slate-800 bg-slate-800/30 p-5 text-left transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/60"
            >
              <div className={`mb-3 inline-flex rounded-lg ${stat.bg} p-2.5`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs font-medium text-slate-400">{stat.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Readiness Score */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Career Readiness</h3>
          </div>
          {analysis ? (
            <div className="flex flex-col items-center">
              {/* Circular score */}
              <div className="relative mb-4 flex h-36 w-36 items-center justify-center">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="60" fill="none" stroke="rgb(30 41 59)" strokeWidth="10" />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(analysis.readinessScore / 100) * 377} 377`}
                    className={scoreColor}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-4xl font-bold ${scoreColor}`}>{analysis.readinessScore}</span>
                  <span className="text-xs text-slate-500">out of 100</span>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-slate-300">{analysis.careerTitle}</p>
              <div className="mt-4 flex w-full gap-2">
                <div className="flex-1 rounded-lg bg-emerald-500/10 py-2 text-center">
                  <p className="text-lg font-bold text-emerald-400">{analysis.matchedCount}</p>
                  <p className="text-[10px] text-slate-500">Matched</p>
                </div>
                <div className="flex-1 rounded-lg bg-yellow-500/10 py-2 text-center">
                  <p className="text-lg font-bold text-yellow-400">{analysis.partialCount}</p>
                  <p className="text-[10px] text-slate-500">Partial</p>
                </div>
                <div className="flex-1 rounded-lg bg-red-500/10 py-2 text-center">
                  <p className="text-lg font-bold text-red-400">{analysis.missingCount}</p>
                  <p className="text-[10px] text-slate-500">Missing</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <Target size={36} className="mb-3 text-slate-600" />
              <p className="text-sm text-slate-400">No target career selected</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate('analysis')}
              >
                Select Career <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Skill Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Skill Overview</h3>
            </div>
            <button
              onClick={() => onNavigate('skills')}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Manage Skills →
            </button>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3">
              <p className="text-xs text-slate-500">Technical Skills</p>
              <p className="text-2xl font-bold text-white">{techSkills.length}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3">
              <p className="text-xs text-slate-500">Soft Skills</p>
              <p className="text-2xl font-bold text-white">{softSkills.length}</p>
            </div>
          </div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 12).map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-2.5 py-1 text-xs text-slate-300"
                >
                  {skill.name}
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{proficiencyLabels[skill.proficiency]}</span>
                </span>
              ))}
              {skills.length > 12 && (
                <span className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800/50 px-2.5 py-1 text-xs text-slate-500">
                  +{skills.length - 12} more
                </span>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-700 py-6 text-center">
              <p className="text-xs text-slate-500">No skills added yet</p>
              <button
                onClick={() => onNavigate('skills')}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                Add your first skill →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skill Gap Summary */}
      {analysis && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Skill Gap Summary for {analysis.careerTitle}</h3>
            <button
              onClick={() => onNavigate('analysis')}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              View Full Analysis →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">Matched Skills</span>
              </div>
              {analysis.matched.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched.slice(0, 6).map((s) => (
                    <span key={s.name} className="text-xs text-emerald-300/80">{s.name}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">None yet</p>
              )}
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-400" />
                <span className="text-xs font-medium text-yellow-300">Partial Skills</span>
              </div>
              {analysis.partial.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.partial.slice(0, 6).map((s) => (
                    <span key={s.name} className="text-xs text-yellow-300/80">{s.name}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">None</p>
              )}
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <XCircle size={16} className="text-red-400" />
                <span className="text-xs font-medium text-red-300">Missing Skills</span>
              </div>
              {analysis.missing.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.slice(0, 6).map((s) => (
                    <span key={s.name} className="text-xs text-red-300/80">{s.name}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">None — fully ready!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { ProfileData } from '@/lib/supabase';
import { careers, proficiencyLabels, getCareer } from '@/lib/careers';
import { analyzeCareer } from '@/lib/analysis';
import { SectionHeader, Button, Badge } from './ui';

type AnalysisPageProps = {
  data: ProfileData;
  onUpdateProfile: (updates: Record<string, unknown>) => Promise<void>;
};

export function AnalysisPage({ data, onUpdateProfile }: AnalysisPageProps) {
  const { profile, skills } = data;
  const [selectedCareerId, setSelectedCareerId] = useState<string>(profile?.target_career ?? '');
  const [selecting, setSelecting] = useState(false);

  const activeCareerId = selectedCareerId || profile?.target_career || '';
  const analysis = activeCareerId ? analyzeCareer(activeCareerId, skills) : null;
  const activeCareer = getCareer(activeCareerId);

  const handleSelectCareer = async (careerId: string) => {
    setSelecting(true);
    setSelectedCareerId(careerId);
    try {
      await onUpdateProfile({ target_career: careerId });
    } finally {
      setSelecting(false);
    }
  };

  const scoreColor =
    analysis && analysis.readinessScore >= 75
      ? 'text-emerald-400'
      : analysis && analysis.readinessScore >= 50
      ? 'text-yellow-400'
      : 'text-red-400';

  const scoreStroke =
    analysis && analysis.readinessScore >= 75
      ? '#34d399'
      : analysis && analysis.readinessScore >= 50
      ? '#facc15'
      : '#f87171';

  const scoreLabel =
    analysis && analysis.readinessScore >= 75
      ? 'Career Ready'
      : analysis && analysis.readinessScore >= 50
      ? 'Almost There'
      : 'Needs Work';

  return (
    <div>
      <SectionHeader
        title="Career Analysis"
        subtitle="Select a career and see your skill gap analysis"
        icon={Target}
      />

      {/* Career Selection Grid */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles size={16} className="text-blue-400" />
          Select Your Target Career
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {careers.map((career) => {
            const isActive = career.id === activeCareerId;
            return (
              <button
                key={career.id}
                onClick={() => handleSelectCareer(career.id)}
                disabled={selecting}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-blue-500/50 bg-blue-500/10 ring-1 ring-blue-500/20'
                    : 'border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-br ${career.color} p-2 shadow-lg`}>
                  {isActive && (
                    <CheckCircle2 size={18} className="text-white" />
                  )}
                  {!isActive && (
                    <Target size={18} className="text-white" />
                  )}
                </div>
                <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                  {career.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{career.description}</p>
                {isActive && (
                  <div className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-400">
                    Selected <CheckCircle2 size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && activeCareer ? (
        <div className="space-y-6">
          {/* Readiness Score Banner */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-800/60 via-slate-800/30 to-slate-900 p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              {/* Circular Score */}
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="rgb(30 41 59)" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke={scoreStroke}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(analysis.readinessScore / 100) * 339} 339`}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{analysis.readinessScore}</span>
                  <span className="text-[10px] text-slate-500">/ 100</span>
                </div>
              </div>
              {/* Score Details */}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{analysis.careerTitle}</h3>
                  <Badge className={`border-slate-700 bg-slate-700/40 ${scoreColor}`}>
                    {scoreLabel}
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-slate-400">
                  You meet <span className="font-semibold text-white">{analysis.matchedCount}</span> out of{' '}
                  <span className="font-semibold text-white">{analysis.totalSkills}</span> required skills for this role.
                </p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-400">{analysis.matchedCount}</span>
                    <span className="text-xs text-slate-500">Matched</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-1.5">
                    <AlertTriangle size={14} className="text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">{analysis.partialCount}</span>
                    <span className="text-xs text-slate-500">Partial</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5">
                    <XCircle size={14} className="text-red-400" />
                    <span className="text-sm font-semibold text-red-400">{analysis.missingCount}</span>
                    <span className="text-xs text-slate-500">Missing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Comparison Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <TrendingUp size={16} className="text-blue-400" />
              Skill Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-medium">Skill</th>
                    <th className="pb-3 pr-4 font-medium">Category</th>
                    <th className="pb-3 pr-4 font-medium">Required</th>
                    <th className="pb-3 pr-4 font-medium">Your Level</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analysis.matched.map((s) => (
                    <tr key={`m-${s.name}`} className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-medium text-white">{s.name}</td>
                      <td className="py-3 pr-4">
                        <Badge className={s.category === 'technical' ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-pink-500/30 bg-pink-500/10 text-pink-300'}>
                          {s.category}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{proficiencyLabels[s.required]}</td>
                      <td className="py-3 pr-4 text-slate-300">{s.current ? proficiencyLabels[s.current] : '—'}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <CheckCircle2 size={14} /> Matched
                        </span>
                      </td>
                    </tr>
                  ))}
                  {analysis.partial.map((s) => (
                    <tr key={`p-${s.name}`} className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-medium text-white">{s.name}</td>
                      <td className="py-3 pr-4">
                        <Badge className={s.category === 'technical' ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-pink-500/30 bg-pink-500/10 text-pink-300'}>
                          {s.category}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{proficiencyLabels[s.required]}</td>
                      <td className="py-3 pr-4 text-slate-300">{s.current ? proficiencyLabels[s.current] : '—'}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400">
                          <AlertTriangle size={14} /> Partial
                        </span>
                      </td>
                    </tr>
                  ))}
                  {analysis.missing.map((s) => (
                    <tr key={`x-${s.name}`} className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-medium text-white">{s.name}</td>
                      <td className="py-3 pr-4">
                        <Badge className={s.category === 'technical' ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-pink-500/30 bg-pink-500/10 text-pink-300'}>
                          {s.category}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{proficiencyLabels[s.required]}</td>
                      <td className="py-3 pr-4 text-slate-600">Not added</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                          <XCircle size={14} /> Missing
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Lightbulb size={16} className="text-amber-400" />
                Recommendations to Bridge Skill Gaps
              </h3>
              <div className="space-y-2.5">
                {analysis.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-3.5"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[10px] font-bold text-amber-400">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.recommendations.length === 0 && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">You're Career Ready!</h3>
              <p className="mt-1 text-sm text-slate-400">
                You meet all the required skills for {analysis.careerTitle}. Keep upskilling to stay ahead!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 px-6 py-16 text-center">
          <Target size={40} className="mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300">No career selected</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Choose a target career above to see your skill gap analysis, readiness score, and personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}

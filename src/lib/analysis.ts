import { getCareer, proficiencyLabels } from './careers';
import type { Skill } from './supabase';

export type SkillMatchStatus = 'matched' | 'partial' | 'missing';

export type SkillGap = {
  name: string;
  category: 'technical' | 'soft';
  required: number;
  current: number | null;
  status: SkillMatchStatus;
};

export type CareerAnalysis = {
  careerId: string;
  careerTitle: string;
  readinessScore: number;
  matched: SkillGap[];
  partial: SkillGap[];
  missing: SkillGap[];
  totalSkills: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  recommendations: string[];
};

export function analyzeCareer(careerId: string, skills: Skill[]): CareerAnalysis | null {
  const career = getCareer(careerId);
  if (!career) return null;

  const skillsMap = new Map<string, number>();
  for (const s of skills) {
    const key = s.name.toLowerCase().trim();
    if (!skillsMap.has(key) || skillsMap.get(key)! < s.proficiency) {
      skillsMap.set(key, s.proficiency);
    }
  }

  const gaps: SkillGap[] = career.required_skills.map((req) => {
    const key = req.name.toLowerCase().trim();
    const current = skillsMap.has(key) ? skillsMap.get(key)! : null;
    let status: SkillMatchStatus = 'missing';
    if (current !== null && current >= req.min_proficiency) {
      status = 'matched';
    } else if (current !== null && current > 0) {
      status = 'partial';
    }
    return {
      name: req.name,
      category: req.category,
      required: req.min_proficiency,
      current,
      status,
    };
  });

  const matched = gaps.filter((g) => g.status === 'matched');
  const partial = gaps.filter((g) => g.status === 'partial');
  const missing = gaps.filter((g) => g.status === 'missing');

  const total = gaps.length;
  const score = Math.round((matched.length / total) * 100);

  const recommendations: string[] = [];
  for (const m of missing) {
    recommendations.push(
      `Learn "${m.name}" from scratch — it's a ${m.category} skill required for ${career.title}. Target proficiency: ${proficiencyLabels[m.required]}.`
    );
  }
  for (const p of partial) {
    recommendations.push(
      `Improve "${p.name}" from ${proficiencyLabels[p.current!]} to ${proficiencyLabels[p.required]} to fully meet the ${career.title} requirement.`
    );
  }

  return {
    careerId,
    careerTitle: career.title,
    readinessScore: score,
    matched,
    partial,
    missing,
    totalSkills: total,
    matchedCount: matched.length,
    partialCount: partial.length,
    missingCount: missing.length,
    recommendations,
  };
}

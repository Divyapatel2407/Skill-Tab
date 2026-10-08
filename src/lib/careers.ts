export type CareerSkillRequirement = {
  name: string;
  min_proficiency: number; // 1-5, the minimum proficiency expected
  category: 'technical' | 'soft';
};

export type Career = {
  id: string;
  title: string;
  icon: string; // lucide icon name
  description: string;
  color: string; // tailwind gradient classes
  required_skills: CareerSkillRequirement[];
};

export const careers: Career[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: 'BarChart3',
    description: 'Analyze data to uncover insights and drive business decisions.',
    color: 'from-blue-500 to-cyan-500',
    required_skills: [
      { name: 'SQL', min_proficiency: 4, category: 'technical' },
      { name: 'Python', min_proficiency: 3, category: 'technical' },
      { name: 'Excel', min_proficiency: 4, category: 'technical' },
      { name: 'Tableau', min_proficiency: 3, category: 'technical' },
      { name: 'Statistics', min_proficiency: 4, category: 'technical' },
      { name: 'Data Visualization', min_proficiency: 3, category: 'technical' },
      { name: 'Communication', min_proficiency: 4, category: 'soft' },
      { name: 'Critical Thinking', min_proficiency: 4, category: 'soft' },
      { name: 'Problem Solving', min_proficiency: 3, category: 'soft' },
    ],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: 'BrainCircuit',
    description: 'Build predictive models and extract knowledge from complex data.',
    color: 'from-emerald-500 to-teal-500',
    required_skills: [
      { name: 'Python', min_proficiency: 4, category: 'technical' },
      { name: 'Machine Learning', min_proficiency: 4, category: 'technical' },
      { name: 'Statistics', min_proficiency: 4, category: 'technical' },
      { name: 'SQL', min_proficiency: 3, category: 'technical' },
      { name: 'Deep Learning', min_proficiency: 3, category: 'technical' },
      { name: 'Data Visualization', min_proficiency: 3, category: 'technical' },
      { name: 'R', min_proficiency: 3, category: 'technical' },
      { name: 'Critical Thinking', min_proficiency: 4, category: 'soft' },
      { name: 'Problem Solving', min_proficiency: 4, category: 'soft' },
      { name: 'Communication', min_proficiency: 3, category: 'soft' },
    ],
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    icon: 'Code2',
    description: 'Design, build, and maintain software applications.',
    color: 'from-violet-500 to-purple-500',
    required_skills: [
      { name: 'Java', min_proficiency: 3, category: 'technical' },
      { name: 'JavaScript', min_proficiency: 4, category: 'technical' },
      { name: 'Python', min_proficiency: 3, category: 'technical' },
      { name: 'Git', min_proficiency: 4, category: 'technical' },
      { name: 'Data Structures', min_proficiency: 4, category: 'technical' },
      { name: 'Algorithms', min_proficiency: 4, category: 'technical' },
      { name: 'Databases', min_proficiency: 3, category: 'technical' },
      { name: 'REST APIs', min_proficiency: 3, category: 'technical' },
      { name: 'Problem Solving', min_proficiency: 4, category: 'soft' },
      { name: 'Teamwork', min_proficiency: 3, category: 'soft' },
      { name: 'Communication', min_proficiency: 3, category: 'soft' },
    ],
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    icon: 'Cpu',
    description: 'Deploy and scale ML models into production systems.',
    color: 'from-orange-500 to-amber-500',
    required_skills: [
      { name: 'Python', min_proficiency: 4, category: 'technical' },
      { name: 'Machine Learning', min_proficiency: 4, category: 'technical' },
      { name: 'Deep Learning', min_proficiency: 4, category: 'technical' },
      { name: 'TensorFlow', min_proficiency: 3, category: 'technical' },
      { name: 'Docker', min_proficiency: 3, category: 'technical' },
      { name: 'Cloud Computing', min_proficiency: 3, category: 'technical' },
      { name: 'MLOps', min_proficiency: 3, category: 'technical' },
      { name: 'SQL', min_proficiency: 3, category: 'technical' },
      { name: 'Problem Solving', min_proficiency: 4, category: 'soft' },
      { name: 'Critical Thinking', min_proficiency: 3, category: 'soft' },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    icon: 'ShieldCheck',
    description: 'Protect systems and data from cyber threats and attacks.',
    color: 'from-red-500 to-rose-500',
    required_skills: [
      { name: 'Network Security', min_proficiency: 4, category: 'technical' },
      { name: 'Linux', min_proficiency: 3, category: 'technical' },
      { name: 'Python', min_proficiency: 3, category: 'technical' },
      { name: 'Penetration Testing', min_proficiency: 3, category: 'technical' },
      { name: 'Cryptography', min_proficiency: 3, category: 'technical' },
      { name: 'SIEM', min_proficiency: 3, category: 'technical' },
      { name: 'Risk Assessment', min_proficiency: 3, category: 'technical' },
      { name: 'Incident Response', min_proficiency: 3, category: 'technical' },
      { name: 'Critical Thinking', min_proficiency: 4, category: 'soft' },
      { name: 'Problem Solving', min_proficiency: 4, category: 'soft' },
      { name: 'Attention to Detail', min_proficiency: 4, category: 'soft' },
    ],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    icon: 'Palette',
    description: 'Create intuitive, visually appealing user experiences.',
    color: 'from-pink-500 to-fuchsia-500',
    required_skills: [
      { name: 'Figma', min_proficiency: 4, category: 'technical' },
      { name: 'User Research', min_proficiency: 3, category: 'technical' },
      { name: 'Prototyping', min_proficiency: 3, category: 'technical' },
      { name: 'Wireframing', min_proficiency: 4, category: 'technical' },
      { name: 'Design Systems', min_proficiency: 3, category: 'technical' },
      { name: 'HTML/CSS', min_proficiency: 3, category: 'technical' },
      { name: 'Adobe XD', min_proficiency: 3, category: 'technical' },
      { name: 'Creativity', min_proficiency: 4, category: 'soft' },
      { name: 'Communication', min_proficiency: 4, category: 'soft' },
      { name: 'Empathy', min_proficiency: 3, category: 'soft' },
      { name: 'Problem Solving', min_proficiency: 3, category: 'soft' },
    ],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    icon: 'Target',
    description: 'Guide product strategy from conception through launch.',
    color: 'from-indigo-500 to-blue-500',
    required_skills: [
      { name: 'Product Strategy', min_proficiency: 4, category: 'technical' },
      { name: 'Market Research', min_proficiency: 3, category: 'technical' },
      { name: 'Agile/Scrum', min_proficiency: 4, category: 'technical' },
      { name: 'Data Analysis', min_proficiency: 3, category: 'technical' },
      { name: 'User Stories', min_proficiency: 3, category: 'technical' },
      { name: 'SQL', min_proficiency: 2, category: 'technical' },
      { name: 'Communication', min_proficiency: 5, category: 'soft' },
      { name: 'Leadership', min_proficiency: 4, category: 'soft' },
      { name: 'Critical Thinking', min_proficiency: 4, category: 'soft' },
      { name: 'Problem Solving', min_proficiency: 4, category: 'soft' },
      { name: 'Stakeholder Management', min_proficiency: 3, category: 'soft' },
    ],
  },
];

export const proficiencyLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Basic',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

export const proficiencyColors: Record<number, string> = {
  1: 'bg-red-500/20 text-red-300 border-red-500/30',
  2: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  3: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  4: 'bg-green-500/20 text-green-300 border-green-500/30',
  5: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export function getCareer(id: string | null): Career | undefined {
  if (!id) return undefined;
  return careers.find((c) => c.id === id);
}

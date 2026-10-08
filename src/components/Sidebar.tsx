import {
  LayoutDashboard,
  User,
  Wrench,
  FolderGit2,
  Award,
  Briefcase,
  Target,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export type Page =
  | 'dashboard'
  | 'profile'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'internships'
  | 'analysis';

export const navItems: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'internships', label: 'Internships', icon: Briefcase },
  { id: 'analysis', label: 'Career Analysis', icon: Target },
];

type SidebarProps = {
  current: Page;
  onNavigate: (page: Page) => void;
  profileName: string;
  targetCareer: string | null;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ current, onNavigate, profileName, targetCareer, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">SkillTab</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Career Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const isActive = current === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 ring-1 ring-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Profile mini-card */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-sm font-bold text-white">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">{profileName}</p>
              <p className="truncate text-xs text-slate-500">{targetCareer || 'No target career'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

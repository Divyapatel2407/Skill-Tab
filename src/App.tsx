import { useState } from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import { Sidebar, type Page } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { SkillsPage } from './components/SkillsPage';
import { ProjectsPage } from './components/ProjectsPage';
import { CertificationsPage } from './components/CertificationsPage';
import { InternshipsPage } from './components/InternshipsPage';
import { AnalysisPage } from './components/AnalysisPage';
import { useProfileData } from './lib/useProfileData';
import { getCareer } from './lib/careers';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profileId, data, loading, error, loadAll, updateProfile } = useProfileData();

  const profileName = data.profile?.full_name || 'Student';
  const targetCareer = data.profile?.target_career
    ? getCareer(data.profile.target_career)?.title ?? null
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        current={page}
        onNavigate={setPage}
        profileName={profileName}
        targetCareer={targetCareer}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">SkillTab</span>
          </div>
        </div>

        {/* Page content */}
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
                <p className="text-sm text-slate-500">Loading your profile...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
                <AlertCircle size={28} className="text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={() => loadAll()}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {page === 'dashboard' && <Dashboard data={data} onNavigate={setPage} />}
              {page === 'profile' && <ProfilePage data={data} onUpdate={updateProfile} />}
              {page === 'skills' && (
                <SkillsPage profileId={profileId} skills={data.skills} onReload={loadAll} />
              )}
              {page === 'projects' && (
                <ProjectsPage profileId={profileId} projects={data.projects} onReload={loadAll} />
              )}
              {page === 'certifications' && (
                <CertificationsPage
                  profileId={profileId}
                  certifications={data.certifications}
                  onReload={loadAll}
                />
              )}
              {page === 'internships' && (
                <InternshipsPage
                  profileId={profileId}
                  internships={data.internships}
                  onReload={loadAll}
                />
              )}
              {page === 'analysis' && (
                <AnalysisPage data={data} onUpdateProfile={updateProfile} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

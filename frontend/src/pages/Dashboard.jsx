import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useDeveloperStore } from '../stores/useDeveloperStore';
import DeveloperProjects from '../components/DeveloperProjects';
import ProjectOverview from '../components/admin/ProjectOverview';
import Loader from '../components/Loader';
import Skeleton from '../components/ui/Skeleton';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const { projects, fetchMyProjects, isLoading } = useProjectStore();
    const { fetchDevelopers } = useDeveloperStore();
    const [activeView, setActiveView] = useState('projects'); // 'projects' or 'project-overview' or 'profile'
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        fetchMyProjects();
    }, [fetchMyProjects]);

    const handleLogout = async () => {
        await logout();
    };

    const handleNavigation = (view, id = null) => {
        setActiveView(view);
        if (id) setSelectedProjectId(id);
    };

    return (
        <div className="min-h-screen bg-bg-app font-sans selection:bg-primary/20">
            {/* Glossy Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group hover:rotate-0 transition-transform">
                            <span className="text-white font-black text-xl">M</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-text-primary tracking-tighter uppercase">By4K's Manage</h1>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Developer Hub</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-1 px-4 py-2 bg-bg-muted/50 rounded-xl border border-border/50">
                            <div className="w-2 h-2 bg-achievement rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 text-[10px] font-black text-white bg-danger hover:bg-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-danger/20"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {activeView === 'projects' && (
                    <div className="space-y-8">
                        {/* Welcome Card */}
                        <div className="relative overflow-hidden bg-bg-card border border-border rounded-[40px] p-10 shadow-sm group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-4xl font-black text-text-primary mb-3 tracking-tighter uppercase italic">
                                        Welcome, {user?.name?.split(' ')[0]}! 👋
                                    </h2>
                                    <p className="text-text-secondary font-medium text-lg leading-relaxed max-w-xl">
                                        Your dev workspace is ready. You currently have <span className="text-primary font-black underline decoration-primary/30 decoration-4 underline-offset-4">
                                            {isLoading && projects.length === 0 ? <Skeleton className="inline-block h-6 w-24 align-middle" /> : `${projects.length} assignments`}
                                        </span> active.
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setActiveView('profile')}
                                        className="px-8 py-4 bg-bg-muted border border-border rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-border transition-all"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <DeveloperProjects
                            projects={projects}
                            isLoading={isLoading}
                            onNavigate={handleNavigation}
                        />
                    </div>
                )}

                {activeView === 'project-overview' && (
                    <ProjectOverview
                        projectId={selectedProjectId}
                        projects={projects}
                        onBack={() => setActiveView('projects')}
                    />
                )}

                {activeView === 'profile' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="flex items-center space-x-2 text-[10px] text-text-muted mb-6 cursor-pointer hover:text-text-primary uppercase tracking-widest font-black transition-colors" onClick={() => setActiveView('projects')}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                            <span>Back to Projects</span>
                        </div>

                        <div className="bg-bg-card border border-border rounded-[40px] p-12 shadow-sm text-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border-2 border-primary/20">
                                <span className="text-4xl text-primary font-black">{user?.name?.charAt(0)}</span>
                            </div>
                            <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">{user?.name}</h3>
                            <p className="text-text-muted font-black uppercase tracking-widest text-[10px] mb-10">{user?.role} • {user?.isActive ? 'ACTIVE ACCOUNT' : 'INACTIVE'}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-bg-muted/50 rounded-3xl border border-border">
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2">Email Address</p>
                                    <p className="font-bold text-text-primary truncate">{user?.email}</p>
                                </div>
                                <div className="p-6 bg-bg-muted/50 rounded-3xl border border-border">
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2">Projects Joined</p>
                                    <p className="font-bold text-text-primary">{projects.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;


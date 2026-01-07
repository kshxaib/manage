import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useProjectStore } from '../stores/useProjectStore';
import DeveloperProjects from '../components/DeveloperProjects';
import ProjectOverview from '../components/admin/ProjectOverview';
import Skeleton from '../components/ui/Skeleton';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const { projects, fetchMyProjects, isLoading } = useProjectStore();
    const [activeView, setActiveView] = useState('projects'); 
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-base font-semibold text-gray-900">Developer Dashboard</h1>
                            <p className="text-xs text-gray-500">Project Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                            <span className="text-xs font-medium text-gray-700">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeView === 'projects' && (
                    <div className="space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, {user?.name?.split(' ')[0]}!</h2>
                                    <p className="text-gray-600">
                                        You have <span className="font-semibold text-blue-600">
                                            {isLoading && projects.length === 0 ? (
                                                <Skeleton className="inline-block h-4 w-20 align-middle" />
                                            ) : (
                                                `${projects.length} active project${projects.length !== 1 ? 's' : ''}`
                                            )}
                                        </span> assigned to you.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveView('profile')}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    View Profile
                                </button>
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
                        <div className="mb-6">
                            <button 
                                onClick={() => setActiveView('projects')}
                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Projects
                            </button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-semibold text-blue-700">{user?.name?.charAt(0)}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{user?.name}</h3>
                            <p className="text-sm text-gray-500 mb-8">
                                {user?.role} • {user?.isActive ? 'Active Account' : 'Inactive'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Email Address</p>
                                    <p className="font-medium text-gray-900 truncate">{user?.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Projects Assigned</p>
                                    <p className="font-medium text-gray-900">{projects.length}</p>
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
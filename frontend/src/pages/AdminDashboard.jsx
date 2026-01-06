import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useClientStore } from '../stores/useClientStore';
import { useDeveloperStore } from '../stores/useDeveloperStore';
import { useProjectStore } from '../stores/useProjectStore';
import AdminSidebar from '../components/AdminSidebar';
import Loader from '../components/Loader';
import AddClientForm from '../components/AddClientForm';
import CreateProjectForm from '../components/CreateProjectForm';

// Sub-components
import AllClients from '../components/admin/AllClients';
import AllProjects from '../components/admin/AllProjects';
import AllDevelopers from '../components/admin/AllDevelopers';
import ClientInfo from '../components/admin/ClientInfo';
import ClientProjects from '../components/admin/ClientProjects';
import ProjectOverview from '../components/admin/ProjectOverview';

const AdminDashboard = () => {
    const { user, logout } = useAuthStore();
    const { clients, fetchClients, isLoading: clientsLoading } = useClientStore();
    const { developers, fetchDevelopers, isLoading: developersLoading } = useDeveloperStore();
    const { projects, fetchAllProjects, isLoading: projectsLoading } = useProjectStore();
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

    useEffect(() => {
        fetchClients();
        fetchDevelopers();
        fetchAllProjects();
    }, [fetchClients, fetchDevelopers, fetchAllProjects]);

    const handleLogout = async () => {
        await logout();
    };

    const handleNavigation = (view, id = null) => {
        setActiveView(view);
        if (view.includes('client')) {
            setSelectedClientId(id);
        } else if (view.includes('project')) {
            setSelectedProjectId(id);
        }
    };

    const isInitialLoading = (clientsLoading && clients.length === 0) ||
        (developersLoading && developers.length === 0) ||
        (projectsLoading && projects.length === 0);

    if (isInitialLoading && !isAddClientModalOpen && !isCreateProjectModalOpen) {
        return <Loader message="Loading dashboard..." />;
    }

    const selectedClient = clients?.find(c => c._id === selectedClientId);

    const renderContent = () => {
        switch (activeView) {
            case 'all-clients':
                return (
                    <AllClients
                        clients={clients}
                        onNavigate={handleNavigation}
                        onAddClient={() => setIsAddClientModalOpen(true)}
                    />
                );
            case 'all-projects':
                return (
                    <AllProjects
                        projects={projects}
                        onNavigate={handleNavigation}
                        onAddProject={() => setIsCreateProjectModalOpen(true)}
                    />
                );
            case 'all-developers':
                return <AllDevelopers developers={developers} />;
            case 'client-personal-info':
                return (
                    <ClientInfo
                        client={selectedClient}
                        onNavigate={handleNavigation}
                        onBack={() => setActiveView('all-clients')}
                    />
                );
            case 'client-projects-list':
                return (
                    <ClientProjects
                        client={selectedClient}
                        projects={projects}
                        onNavigate={handleNavigation}
                        onBack={() => setActiveView('all-clients')}
                    />
                );
            case 'project-overview':
                return (
                    <ProjectOverview
                        projectId={selectedProjectId}
                        projects={projects}
                        onBack={() => setActiveView('all-projects')}
                    />
                );
            case 'dashboard':
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-300">
            <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium text-text-muted mb-1">
                    Total Clients
                </p>
                <p className="text-3xl font-bold text-text-primary">
                    {clients?.length || 0}
                </p>
            </div>

            <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium text-text-muted mb-1">
                    Total Developers
                </p>
                <p className="text-3xl font-bold text-text-primary">
                    {developers?.length || 0}
                </p>
            </div>

            <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium text-text-muted mb-1">
                    Total Projects
                </p>
                <p className="text-3xl font-bold text-text-primary">
                    {projects?.length || 0}
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-bg-app overflow-hidden">
            <AdminSidebar onNavigate={handleNavigation} activeView={activeView} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-bg-card border-b border-border shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm text-text-muted mt-1">
                                    By4K's Manage System
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:block text-right mr-4">
                                    <p className="text-sm font-bold text-text-primary">{user?.name}</p>
                                    <p className="text-[10px] text-accent font-bold uppercase tracking-tighter">{user?.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary 
                                             hover:bg-primary-hover rounded-lg transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-bg-app relative scroll-smooth">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {renderContent()}
                    </div>
                </main>
            </div>

            <AddClientForm
                isOpen={isAddClientModalOpen}
                onClose={() => setIsAddClientModalOpen(false)}
            />

            <CreateProjectForm
                isOpen={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
            />
        </div>
    );
};

export default AdminDashboard;

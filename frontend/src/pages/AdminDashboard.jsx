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
                        isLoading={clientsLoading}
                        onNavigate={handleNavigation}
                        onAddClient={() => setIsAddClientModalOpen(true)}
                    />
                );
            case 'all-projects':
                return (
                    <AllProjects
                        projects={projects}
                        isLoading={projectsLoading}
                        onNavigate={handleNavigation}
                        onAddProject={() => setIsCreateProjectModalOpen(true)}
                    />
                );
            case 'all-developers':
                return <AllDevelopers developers={developers} isLoading={developersLoading} />;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {clients?.length || 0}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Total Developers</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {developers?.length || 0}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {projects?.length || 0}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar onNavigate={handleNavigation} activeView={activeView} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 shadow-sm z-10">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500 mt-1">Management System</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 
                                             hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50">
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
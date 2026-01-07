const AdminSidebar = ({ onNavigate, activeView }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'all-clients', label: 'All Clients' },
        { id: 'all-projects', label: 'All Projects' },
        { id: 'all-developers', label: 'All Developers' },
    ];

    return (
        <div className="w-64 bg-bg-card border-r border-border h-screen">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-bold text-text-primary">Navigation</h2>
            </div>

            <div className="p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = activeView === item.id ||
                        (item.id === 'all-clients' && (activeView === 'client-personal-info' || activeView === 'client-projects-list')) ||
                        (item.id === 'all-projects' && activeView === 'project-overview');

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium
                                    transition-colors duration-200 ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-text-primary hover:bg-bg-muted'
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminSidebar;

const AdminSidebar = ({ onNavigate, activeView }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'all-clients', label: 'Clients' },
        { id: 'all-projects', label: 'Projects' },
        { id: 'all-developers', label: 'Team' },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="p-7 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
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
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium
                                    transition-colors duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
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
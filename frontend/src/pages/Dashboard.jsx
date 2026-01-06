import { useAuthStore } from '../stores/useAuthStore';

const Dashboard = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-bg-app">
            <header className="bg-bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-text-primary">
                            By4K's Manage
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary 
                                     hover:bg-primary-hover rounded-lg transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        Welcome, {user?.name}! 👋
                    </h2>
                    <p className="text-text-secondary">
                        You're logged in as <span className="font-medium text-accent">{user?.email}</span>
                    </p>
                </div>

                <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Your Profile
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border">
                            <span className="text-text-secondary">Role:</span>
                            <span className="font-medium text-text-primary">{user?.role}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                            <span className="text-text-secondary">Status:</span>
                            <span className={`font-medium ${user?.isActive ? 'text-success' : 'text-danger'}`}>
                                {user?.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-text-secondary">Projects:</span>
                            <span className="font-medium text-text-primary">{user?.projects?.length}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

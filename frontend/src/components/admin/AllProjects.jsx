const AllProjects = ({ projects, onNavigate, onAddProject }) => {
    return (
        <div className="bg-bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                <h2 className="text-2xl font-bold text-text-primary">All Projects</h2>
                <button
                    onClick={onAddProject}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm flex items-center space-x-2"
                >
                    <span>+</span>
                    <span>Create Project</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-border">
                            <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Project / Client</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Budget</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-text-muted uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {projects?.map((project) => (
                            <tr key={project._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-text-primary truncate max-w-[200px]">{project.projectName}</p>
                                    <p className="text-sm text-text-muted flex items-center">
                                        <span className="truncate max-w-[150px]">{project.client?.businessName || 'N/A'}</span>
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-tighter ${project.status === 'LIVE' ? 'bg-achievement-muted text-achievement' :
                                        project.status === 'DEVELOPMENT' ? 'bg-focus-muted text-focus' :
                                            project.status === 'ON_HOLD' ? 'bg-danger/10 text-danger' :
                                                'bg-bg-muted text-text-secondary'
                                        }`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-text-primary">₹{project.paymentSnapshot?.totalCost?.toLocaleString() || '0'}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onNavigate('project-overview', project._id)}
                                        className="text-accent hover:text-accent-hover font-bold text-xs px-3 py-1.5 bg-accent/5 rounded-md transition-colors"
                                    >
                                        View Overview
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!projects || projects.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-text-muted italic">
                                    No projects found. Launch your first project!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllProjects;

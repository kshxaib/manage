const ClientProjects = ({ client, projects, onNavigate, onBack }) => {
    if (!client) return null;
    const clientProjects = projects?.filter(p => {
        const pClientId = typeof p.client === 'object' ? p.client?._id : p.client;
        return pClientId === client._id;
    });

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 text-sm text-text-muted mb-4 cursor-pointer hover:text-text-primary" onClick={onBack}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span>Back to all clients</span>
                </div>
                <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-bold text-text-primary">
                        {client.clientName}
                    </h2>
                    <div className="flex bg-bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => onNavigate('client-personal-info', client._id)}
                            className="px-4 py-1.5 text-sm font-medium rounded-md transition-all text-text-secondary hover:text-text-primary"
                        >
                            Information
                        </button>
                        <button
                            className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-text-primary"
                        >
                            Projects
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientProjects && clientProjects.length > 0 ? (
                    clientProjects.map(project => (
                        <div
                            key={project._id}
                            onClick={() => onNavigate('project-overview', project._id)}
                            className="bg-bg-card border border-border rounded-xl shadow-sm overflow-hidden hover:border-accent transition-colors flex flex-col cursor-pointer group"
                        >
                            <div className="p-5 flex-1">
                                <h3 className="text-lg font-bold text-text-primary mb-2 truncate group-hover:text-accent transition-colors">{project.projectName}</h3>
                                <p className="text-sm text-text-secondary line-clamp-3 mb-4">{project.projectDescription}</p>
                            </div>
                            <div className="p-5 border-t border-border bg-gray-50/50 flex justify-between items-center">
                                <span className={`text-[11px] font-bold px-2 py-1 rounded uppercase ${project.status === 'LIVE' ? 'bg-achievement-muted text-achievement' : 'bg-focus-muted text-focus'}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                                <span className="text-sm font-bold text-text-primary">₹{project.paymentSnapshot?.totalCost?.toLocaleString() || '0'}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-bg-card border border-dashed border-border rounded-xl">
                        <div className="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">No Projects Yet</h3>
                        <p className="text-sm text-text-secondary mt-1">This client hasn't started any projects with us.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientProjects;

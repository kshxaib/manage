import Skeleton from './ui/Skeleton';

const DeveloperProjects = ({ projects, onNavigate, isLoading }) => {
    return (
        <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-border bg-gray-50/30 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Assignments</h2>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Projects you are currently working on</p>
                </div>
                <div className="px-4 py-2 bg-achievement/10 border border-achievement/20 rounded-xl">
                    <span className="text-xs font-black text-achievement uppercase tracking-widest">
                        {isLoading ? '...' : `${projects?.length || 0} Active Projects`}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-border">
                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Project Name</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <Skeleton className="w-10 h-10 rounded-xl" />
                                            <div>
                                                <Skeleton className="h-4 w-40 mb-2" />
                                                <Skeleton className="h-2 w-20" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Skeleton className="h-6 w-24 rounded-lg" />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Skeleton className="h-10 w-32 ml-auto rounded-xl" />
                                    </td>
                                </tr>
                            ))
                        ) : projects?.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project._id} className="hover:bg-bg-muted/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                                                {project.projectName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-text-primary uppercase tracking-tight text-sm group-hover:text-primary transition-colors">{project.projectName}</p>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{project.projectType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${project.status === 'LIVE' ? 'bg-achievement/5 border-achievement/20 text-achievement' :
                                            project.status === 'DEVELOPMENT' ? 'bg-focus/5 border-focus/20 text-focus' :
                                                project.status === 'PLANNING' ? 'bg-xp/10 border-xp/20 text-xp' :
                                                    'bg-bg-muted border-border text-text-secondary'
                                            }`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => onNavigate('project-overview', project._id)}
                                            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-text-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10"
                                        >
                                            <span>View Brief</span>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-8 py-20 text-center">
                                    <div className="max-w-xs mx-auto">
                                        <div className="w-16 h-16 bg-bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4 border border-border">
                                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                        </div>
                                        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">No active assignments found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeveloperProjects;

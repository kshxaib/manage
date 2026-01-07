import React, { useState, useMemo, useEffect } from 'react';
import Skeleton from '../ui/Skeleton';

const AllProjects = ({ projects, onNavigate, onAddProject, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Apply filtering
    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        return projects.filter(project => {
            const matchesSearch =
                project.projectName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                project.client?.clientName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

            const matchesStatus = statusFilter === '' || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, debouncedSearchQuery, statusFilter]);

    const projectStatuses = ['PLANNING', 'DEVELOPMENT', 'REVIEW', 'LIVE', 'ON_HOLD', 'CANCELLED'];

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

            {/* Filter Bar */}
            <div className="p-4 bg-white border-b border-border flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by project or client name..."
                        className="w-full pl-10 pr-4 py-2 bg-bg-muted border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="w-full px-4 py-2 bg-bg-muted border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {projectStatuses.map(status => (
                            <option key={status} value={status}>{status.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
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
                        {isLoading ? (
                            // Loading Skeletons
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-3 w-24" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-20 rounded-md" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-16" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-8 w-24 ml-auto rounded-md" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <tr key={project._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-text-primary truncate max-w-[200px]">{project.projectName}</p>
                                        <p className="text-sm text-text-muted flex items-center">
                                            <span className="truncate max-w-[150px]">{project.client?.clientName || 'N/A'}</span>
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-tighter ${project.status === 'LIVE' ? 'bg-achievement-muted text-achievement' :
                                                project.status === 'DEVELOPMENT' ? 'bg-focus-muted text-focus' :
                                                    project.status === 'PLANNING' ? 'bg-accent/10 text-accent' :
                                                        project.status === 'REVIEW' ? 'bg-primary/10 text-primary' :
                                                            project.status === 'ON_HOLD' ? 'bg-warning/10 text-warning' :
                                                                project.status === 'CANCELLED' ? 'bg-danger/10 text-danger' :
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="max-w-xs mx-auto">
                                        <div className="w-16 h-16 bg-bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">
                                            {debouncedSearchQuery || statusFilter ? 'No matching projects found.' : 'No projects found.'}
                                        </p>
                                        {debouncedSearchQuery || statusFilter ? (
                                            <p className="mt-4 text-xs font-medium text-text-muted">Adjust your filters to see more results</p>
                                        ) : (
                                            <button onClick={onAddProject} className="mt-4 text-xs font-black text-primary uppercase hover:underline">Launch your first project</button>
                                        )}
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

export default AllProjects;

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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all your projects</p>
                </div>
                <button
                    onClick={onAddProject}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-200 flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by project or client name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <div className="relative">
                        <select
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="" className="text-gray-500">All Statuses</option>
                            {projectStatuses.map(status => (
                                <option key={status} value={status} className="text-gray-900">{status.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Project / Client</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-32 mb-2 bg-gray-200" />
                                        <Skeleton className="h-3.5 w-24 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-7 w-24 rounded bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-20 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-9 w-28 ml-auto rounded-lg bg-gray-200" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <tr key={project._id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {project.projectName}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <span>{project.client?.clientName || 'No client assigned'}</span>
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-gray-900">
                                            ₹{project.paymentSnapshot?.totalCost?.toLocaleString() || '0'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onNavigate('project-overview', project._id)}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium text-sm rounded-lg hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800 transition-all duration-200 border border-blue-100 shadow-sm hover:shadow"
                                        >
                                            View Details
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-200 shadow-sm">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {debouncedSearchQuery || statusFilter ? 'No matching projects' : 'No projects yet'}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {debouncedSearchQuery || statusFilter 
                                                ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                                                : 'Get started by creating your first project.'}
                                        </p>
                                        {debouncedSearchQuery || statusFilter ? (
                                            <button 
                                                onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                Clear filters
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={onAddProject}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                            >
                                                Create Your First Project
                                            </button>
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

const getStatusStyle = (status) => {
    switch(status) {
        case 'LIVE':
            return 'bg-green-50 text-green-700 border border-green-100';
        case 'DEVELOPMENT':
            return 'bg-blue-50 text-blue-700 border border-blue-100';
        case 'PLANNING':
            return 'bg-purple-50 text-purple-700 border border-purple-100';
        case 'REVIEW':
            return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
        case 'ON_HOLD':
            return 'bg-orange-50 text-orange-700 border border-orange-100';
        case 'CANCELLED':
            return 'bg-red-50 text-red-700 border border-red-100';
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
};

export default AllProjects;
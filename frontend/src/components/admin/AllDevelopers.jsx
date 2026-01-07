import React, { useState, useMemo, useEffect } from 'react';
import Skeleton from '../ui/Skeleton';
import AddDeveloperForm from '../AddDeveloperForm';
import { useDeveloperStore } from '../../stores/useDeveloperStore';

const AllDevelopers = ({ developers, isLoading }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const { toggleDeveloperStatus, isLoading: isActionLoading } = useDeveloperStore();

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Apply filtering
    const filteredDevelopers = useMemo(() => {
        if (!developers) return [];
        return developers.filter(dev => {
            const matchesSearch =
                dev.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                dev.email?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

            const matchesRole = roleFilter === '' || dev.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [developers, debouncedSearchQuery, roleFilter]);

    const roles = ["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "DESIGNER"];

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your development team members</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Team Member
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
                        placeholder="Search team members by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <div className="relative">
                        <select
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="" className="text-gray-500">All Roles</option>
                            {roles.map(role => (
                                <option key={role} value={role} className="text-gray-900">{role}</option>
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
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Team Member</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-32 mb-2 bg-gray-200" />
                                        <Skeleton className="h-4 w-24 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-40 mb-2 bg-gray-200" />
                                        <Skeleton className="h-5 w-32 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-7 w-24 rounded bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-7 w-20 rounded bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-9 w-28 ml-auto rounded-lg bg-gray-200" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredDevelopers.length > 0 ? (
                            filteredDevelopers.map((dev) => (
                                <tr key={dev._id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{dev.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900">{dev.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                            {dev.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${dev.isActive 
                                            ? 'bg-green-50 text-green-700 border border-green-100' 
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                            {dev.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleDeveloperStatus(dev._id)}
                                            disabled={isActionLoading}
                                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${dev.isActive
                                                ? 'bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 hover:from-red-100 hover:text-red-700 border-red-200 hover:border-red-300'
                                                : 'bg-gradient-to-r from-green-50 to-green-50/50 text-green-600 hover:from-green-100 hover:text-green-700 border-green-200 hover:border-green-300'
                                                }`}
                                        >
                                            {dev.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-200 shadow-sm">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {debouncedSearchQuery || roleFilter ? 'No matching team members' : 'No team members yet'}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {debouncedSearchQuery || roleFilter 
                                                ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                                                : 'Get started by adding your first team member.'}
                                        </p>
                                        {debouncedSearchQuery || roleFilter ? (
                                            <button 
                                                onClick={() => { setSearchQuery(''); setRoleFilter(''); }}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                Clear filters
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                            >
                                                Add Your First Member
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddDeveloperForm
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default AllDevelopers;
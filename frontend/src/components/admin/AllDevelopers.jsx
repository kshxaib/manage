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
        <div className="bg-bg-card border border-border rounded-[32px] shadow-sm p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter italic">Human Capital</h2>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">
                        {debouncedSearchQuery || roleFilter ? 'Filtered team results' : `Total: ${developers?.length || 0} members in your production team`}
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-accent/20 flex items-center space-x-3"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Onboard Member</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="mb-10 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full px-6 py-4 bg-bg-muted border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-text-muted/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        className="w-full px-6 py-4 bg-bg-muted border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1.5rem_center] bg-no-repeat"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="p-6 border border-border rounded-[24px] bg-bg-card flex items-center space-x-6">
                            <Skeleton className="w-16 h-16 rounded-[20px] shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    ))
                ) : filteredDevelopers.length > 0 ? (
                    filteredDevelopers.map((dev) => (
                        <div key={dev._id} className="group p-6 border border-border rounded-[24px] bg-bg-card hover:border-accent hover:shadow-2xl hover:shadow-accent/5 transition-all flex items-center space-x-6 relative overflow-hidden">

                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-[20px] bg-bg-muted flex items-center justify-center text-accent font-black text-2xl border-2 border-border group-hover:border-accent/30 transition-colors">
                                    {dev.name[0]}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-bg-card ${dev.isActive ? 'bg-achievement' : 'bg-danger'}`}></div>
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="font-black text-text-primary uppercase tracking-tight text-lg truncate">{dev.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-[9px] text-accent font-black uppercase tracking-widest px-2 py-0.5 bg-accent/5 rounded-md border border-accent/10">{dev.role}</span>
                                    <span className="text-text-muted/30">|</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${dev.isActive ? 'text-achievement' : 'text-danger'}`}>
                                        {dev.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                                <p className="text-xs text-text-muted font-bold truncate mt-2">{dev.email}</p>
                            </div>

                            <div className="shrink-0 flex flex-col items-end">
                                <button
                                    onClick={() => toggleDeveloperStatus(dev._id)}
                                    disabled={isActionLoading}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dev.isActive
                                        ? 'bg-danger/5 text-danger hover:bg-danger hover:text-white'
                                        : 'bg-achievement/5 text-achievement hover:bg-achievement hover:text-white'
                                        }`}
                                >
                                    {dev.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-border rounded-[32px]">
                        <p className="text-text-muted font-black tracking-widest uppercase text-xs mb-4">
                            {debouncedSearchQuery || roleFilter ? 'No matching production team members found.' : 'No production team members identified.'}
                        </p>
                        {debouncedSearchQuery || roleFilter ? (
                            <p className="text-xs font-bold text-text-muted italic">Try adjusting your filters to find who you're looking for</p>
                        ) : (
                            <button onClick={() => setIsAddModalOpen(true)} className="text-xs font-black text-accent uppercase hover:underline">Onboard your first member</button>
                        )}
                    </div>
                )}
            </div>

            <AddDeveloperForm
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default AllDevelopers;


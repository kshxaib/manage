import React, { useState, useEffect } from 'react';
import { formatDate } from '../../../utils/dateUtils';

const OverviewTab = ({ project, isAdmin, isLocked, updateProjectInfo, isLoading }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        projectName: '',
        projectType: 'WEBSITE',
        status: 'PLANNING',
        techStack: '',
        startDate: '',
        expectedEndDate: '',
        projectDescription: ''
    });

    useEffect(() => {
        if (project) {
            setEditForm({
                projectName: project.projectName || '',
                projectType: project.projectType || 'WEBSITE',
                status: project.status || 'PLANNING',
                techStack: project.techStack || '',
                startDate: project.startDate?.split('T')[0] || '',
                expectedEndDate: project.expectedEndDate?.split('T')[0] || '',
                projectDescription: project.projectDescription || ''
            });
        }
    }, [project]);

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        const success = await updateProjectInfo(project._id, editForm);
        if (success) setIsEditModalOpen(false);
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Project Information</h3>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-[10px] font-black uppercase text-focus hover:underline tracking-widest"
                    >
                        Edit Details
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                <div className="p-6 bg-bg-muted/30 rounded-2xl border border-border/50">
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Type</p>
                    <p className="font-bold text-text-primary">{project.projectType}</p>
                </div>
                <div className="p-6 bg-bg-muted/30 rounded-2xl border border-border/50">
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Start Date</p>
                    <p className="font-bold text-text-primary">{formatDate(project.startDate)}</p>
                </div>
                <div className="p-6 bg-bg-muted/30 rounded-2xl border border-border/50">
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Expected Delivery</p>
                    <p className="font-bold text-text-primary">
                        {formatDate(project.expectedEndDate)}
                    </p>
                </div>
                <div className="p-6 bg-bg-muted/30 rounded-2xl border border-border/50">
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Tech Stack</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.techStack?.split(',').map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-border rounded-lg text-[10px] font-bold text-text-secondary">{tech.trim()}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Execution Brief</h4>
                <div className="p-8 bg-bg-muted/20 border border-border rounded-3xl leading-relaxed text-text-secondary font-medium">
                    {project.projectDescription || 'No description provided.'}
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Edit Project Details</h3>
                        <form onSubmit={handleUpdateProject} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Project Name</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.projectName}
                                        onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Project Type</label>
                                    <select
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.projectType}
                                        onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                                    >
                                        <option value="WEBSITE">Website</option>
                                        <option value="APP">Mobile App</option>
                                        <option value="BOTH">Website & App</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Current Status</label>
                                    <select
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        <option value="PLANNING">Planning</option>
                                        <option value="DEVELOPMENT">Development</option>
                                        <option value="REVIEW">Review</option>
                                        <option value="LIVE">Live / Completed</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Tech Stack (comma separated)</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="React, Node.js, MongoDB"
                                        value={editForm.techStack}
                                        onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Expected Delivery</label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.expectedEndDate}
                                        onChange={(e) => setEditForm({ ...editForm, expectedEndDate: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Execution Brief / Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all resize-none"
                                        value={editForm.projectDescription}
                                        onChange={(e) => setEditForm({ ...editForm, projectDescription: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-focus text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-focus/20"
                                >
                                    {isLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;

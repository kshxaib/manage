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
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Project Information</h2>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                    >
                        Edit Details
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Type</p>
                    <p className="text-base font-semibold text-gray-900">{project.projectType}</p>
                </div>
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Start Date</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(project.startDate)}</p>
                </div>
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Expected Delivery</p>
                    <p className="text-base font-semibold text-gray-900">
                        {formatDate(project.expectedEndDate)}
                    </p>
                </div>
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.techStack?.split(',').map((tech, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                                {tech.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Project Description</h3>
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 leading-relaxed">
                    {project.projectDescription || 'No description provided.'}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Project Details</h3>
                        </div>
                        
                        <form onSubmit={handleUpdateProject} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={editForm.projectName}
                                        onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                                    <select
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={editForm.projectType}
                                        onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                                    >
                                        <option value="WEBSITE">Website</option>
                                        <option value="APP">Mobile App</option>
                                        <option value="BOTH">Website & App</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                                    <select
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack (comma separated)</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="React, Node.js, MongoDB"
                                        value={editForm.techStack}
                                        onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={editForm.expectedEndDate}
                                        onChange={(e) => setEditForm({ ...editForm, expectedEndDate: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        value={editForm.projectDescription}
                                        onChange={(e) => setEditForm({ ...editForm, projectDescription: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
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
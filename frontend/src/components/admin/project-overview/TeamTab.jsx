import ConfirmModal from '../../ui/ConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';

const TeamTab = ({ project, developers, isAdmin, isLocked, addDeveloperToProject, removeDeveloperFromProject, isLoading }) => {
    const [isDevModalOpen, setIsDevModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [devToRemove, setDevToRemove] = useState(null);
    const [devForm, setDevForm] = useState({ developerId: '', role: 'FULLSTACK' });

    const handleAddDeveloper = async (e) => {
        e.preventDefault();
        if (!devForm.developerId) return toast.error("Select a developer");
        const success = await addDeveloperToProject(project._id, devForm);
        if (success) {
            setIsDevModalOpen(false);
            setDevForm({ developerId: '', role: 'FULLSTACK' });
        }
    };

    const handleRemoveDeveloper = async () => {
        if (!devToRemove) return;
        await removeDeveloperFromProject(project._id, devToRemove);
        setDevToRemove(null);
    };

    const openConfirmModal = (devId) => {
        setDevToRemove(devId);
        setIsConfirmOpen(true);
    };

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Development Team</h2>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsDevModalOpen(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                    >
                        + Assign Team Member
                    </button>
                )}
            </div>

            {/* Team Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Team Member</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {project.assignedDevelopers?.length > 0 ? (
                            project.assignedDevelopers.map((dev, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {dev.developer?.name} 
                                                    {dev.developer?._id === project.createdBy && (
                                                        <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Owner</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {dev.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 truncate max-w-xs">{dev.developer?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isLocked && isAdmin && (
                                            <button
                                                onClick={() => openConfirmModal(dev.developer?._id)}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Members</h3>
                                        <p className="text-gray-500 text-sm mb-4">Assign developers to start working on this project.</p>
                                        {!isLocked && isAdmin && (
                                            <button
                                                onClick={() => setIsDevModalOpen(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                            >
                                                + Assign First Member
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleRemoveDeveloper}
                title="Remove Team Member?"
                message="This developer will no longer have access to this project. You can re-assign them later if needed."
                confirmText="Remove"
            />

            {/* Assign Member Modal */}
            {isDevModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Assign Team Member</h3>
                        </div>
                        
                        <form onSubmit={handleAddDeveloper} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Developer</label>
                                    <select
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={devForm.developerId}
                                        onChange={(e) => setDevForm({ ...devForm, developerId: e.target.value })}
                                    >
                                        <option value="">Choose a developer...</option>
                                        {developers.filter(d => !project.assignedDevelopers?.some(ad => {
                                            const adId = ad.developer._id || ad.developer;
                                            return adId === d._id;
                                        })).map(dev => (
                                            <option key={dev._id} value={dev._id}>
                                                {dev.name} ({dev.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Role</label>
                                    <select
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={devForm.role}
                                        onChange={(e) => setDevForm({ ...devForm, role: e.target.value })}
                                    >
                                        {["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "DESIGNER"].map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setIsDevModalOpen(false)} 
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Assigning...' : 'Assign Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamTab;
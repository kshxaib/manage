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
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Active Development Team</h3>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsDevModalOpen(true)}
                        className="px-4 py-2 bg-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                    >
                        + Assign Member
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.assignedDevelopers?.length > 0 ? (
                    project.assignedDevelopers.map((dev, idx) => (
                        <div key={idx} className="p-5 border border-border rounded-2xl bg-bg-card flex items-center justify-between group hover:border-accent/30 transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-bg-muted flex items-center justify-center text-accent font-black text-lg border border-border">
                                    {dev.developer?.name?.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-text-primary uppercase tracking-tight text-sm">
                                        {dev.developer?.name} {dev.developer?._id === project.createdBy && "(Owner)"}
                                    </p>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{dev.role}</p>
                                </div>
                            </div>
                            {!isLocked && isAdmin && (
                                <button
                                    onClick={() => openConfirmModal(dev.developer?._id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-3xl">
                        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">No developers assigned yet.</p>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleRemoveDeveloper}
                title="Remove Member?"
                message="This developer will no longer have access to this project. You can re-assign them later if needed."
                confirmText="Remove"
            />

            {isDevModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Assign Team Member</h3>
                        <form onSubmit={handleAddDeveloper} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Select Developer</label>
                                <select
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    value={devForm.developerId}
                                    onChange={(e) => setDevForm({ ...devForm, developerId: e.target.value })}
                                >
                                    <option value="">Choose a developer...</option>
                                    {developers.filter(d => !project.assignedDevelopers?.some(ad => {
                                        const adId = ad.developer._id || ad.developer;
                                        return adId === d._id;
                                    })).map(dev => (
                                        <option key={dev._id} value={dev._id}>{dev.name} ({dev.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Assign Role</label>
                                <select
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    value={devForm.role}
                                    onChange={(e) => setDevForm({ ...devForm, role: e.target.value })}
                                >
                                    {["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "DESIGNER"].map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsDevModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-accent text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20">
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

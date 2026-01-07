import React, { useState, useEffect } from 'react';

const InfrastructureTab = ({ project, isAdmin, isLocked, updateInfrastructure, isLoading }) => {
    const [isInfraModalOpen, setIsInfraModalOpen] = useState(false);
    const [infraForm, setInfraForm] = useState({
        deploymentLinks: '',
        hosting: { backendHosting: '', database: '', domainName: '' }
    });

    useEffect(() => {
        if (project) {
            setInfraForm({
                deploymentLinks: project.deploymentLinks?.join(', ') || '',
                hosting: project.hosting || { backendHosting: '', database: '', domainName: '' }
            });
        }
    }, [project]);

    const handleUpdateInfra = async (e) => {
        e.preventDefault();
        const deploymentLinks = infraForm.deploymentLinks.split(',').map(l => l.trim()).filter(l => l !== '');
        const success = await updateInfrastructure(project._id, {
            deploymentLinks,
            hosting: infraForm.hosting
        });
        if (success) setIsInfraModalOpen(false);
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Tech Stack & Hosting</h3>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsInfraModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        Update Infra
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-3xl">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-4">Backend Hosting</p>
                    <p className="text-xl font-black text-text-primary capitalize">{project.hosting?.backendHosting || 'Not Assigned'}</p>
                </div>
                <div className="p-6 bg-focus/5 border border-focus/20 rounded-3xl">
                    <p className="text-[10px] text-focus font-black uppercase tracking-widest mb-4">Database System</p>
                    <p className="text-xl font-black text-text-primary capitalize">{project.hosting?.database || 'Not Assigned'}</p>
                </div>
                <div className="p-6 bg-achievement/5 border border-achievement/20 rounded-3xl">
                    <p className="text-[10px] text-achievement font-black uppercase tracking-widest mb-4">Domain Name</p>
                    <p className="text-xl font-black text-text-primary lowercase truncate">{project.hosting?.domainName || 'No Domain Connected'}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Deployment Links</h4>
                <div className="grid grid-cols-1 gap-3">
                    {project.deploymentLinks?.length > 0 ? (
                        project.deploymentLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-bg-muted/30 border border-border rounded-xl group hover:border-accent hover:bg-bg-muted/50 transition-all"
                            >
                                <span className="text-xs font-bold text-text-secondary truncate pr-4">{link}</span>
                                <svg className="w-4 h-4 text-text-muted group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">No deployment links available.</p>
                        </div>
                    )}
                </div>
            </div>

            {isInfraModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6 text-left">Update Infrastructure Details</h3>
                        <form onSubmit={handleUpdateInfra} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 text-left">Deployment Links (comma separated)</label>
                                    <textarea
                                        rows={2}
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all resize-none"
                                        placeholder="https://app.com, https://stating.app.com"
                                        value={infraForm.deploymentLinks}
                                        onChange={(e) => setInfraForm({ ...infraForm, deploymentLinks: e.target.value })}
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Backend Hosting</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="AWS / Vercel / Render"
                                        value={infraForm.hosting.backendHosting}
                                        onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, backendHosting: e.target.value } })}
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Database</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="MongoDB / PostgreSQL"
                                        value={infraForm.hosting.database}
                                        onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, database: e.target.value } })}
                                    />
                                </div>
                                <div className="col-span-full text-left">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Domain Name</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="example.com"
                                        value={infraForm.hosting.domainName}
                                        onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, domainName: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsInfraModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                    {isLoading ? 'Updating...' : 'Save Infra Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfrastructureTab;
